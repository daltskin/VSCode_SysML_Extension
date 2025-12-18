import * as vscode from 'vscode';
import { ModelExplorerProvider } from './explorer/modelExplorerProvider';
import { SysMLFormatter } from './formatting/formatter';
import { LibraryService } from './library';
import { SysMLDefinitionProvider } from './navigation/definitionProvider';
import { SysMLDocumentSymbolProvider } from './navigation/symbolProvider';
import { SysMLParser } from './parser/sysmlParser';
import { SysMLCodeActionProvider } from './validation/codeActions';
import { SysMLValidator } from './validation/validator';
import { VisualizationPanel } from './visualization/visualizationPanel';

let modelExplorerProvider: ModelExplorerProvider;
let parser: SysMLParser;
let outputChannel: vscode.OutputChannel;
let libraryService: LibraryService;
let documentChangeDebounceTimer: ReturnType<typeof setTimeout> | undefined;

export function activate(context: vscode.ExtensionContext) {
    // Create dedicated output channel for logging
    outputChannel = vscode.window.createOutputChannel('SysML');
    context.subscriptions.push(outputChannel);

    outputChannel.appendLine('SysML v2.0 extension is now active');

    // Initialize library service lazily (don't block activation)
    libraryService = LibraryService.getInstance(context.extensionPath);

    // Defer library initialization to not block extension activation
    globalThis.setImmediate(() => {
        libraryService.initialize().then(() => {
            const stats = libraryService.getStats();
            outputChannel.appendLine(`SysML Library indexed: ${stats.totalSymbols} symbols from ${stats.totalFiles} files`);
        }).catch((error) => {
            outputChannel.appendLine(`Warning: Failed to initialize library: ${error.message}`);
        });
    });

    parser = new SysMLParser();
    const formatter = new SysMLFormatter();
    const validator = new SysMLValidator(parser);

    modelExplorerProvider = new ModelExplorerProvider(parser);
    vscode.window.registerTreeDataProvider('sysmlModelExplorer', modelExplorerProvider);

    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('sysml', formatter)
    );

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider('sysml', new SysMLDefinitionProvider(parser))
    );

    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider('sysml', new SysMLDocumentSymbolProvider(parser))
    );

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            'sysml',
            new SysMLCodeActionProvider(),
            { providedCodeActionKinds: SysMLCodeActionProvider.providedCodeActionKinds }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.formatDocument', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                await vscode.commands.executeCommand('editor.action.formatDocument');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.validateModel', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                const diagnostics = await validator.validate(editor.document);
                vscode.window.showInformationMessage(
                    `Validation complete: ${diagnostics.length} issue(s) found`
                );
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.showVisualizer', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                // Default to structural view for SysML v2.0 compliance
                VisualizationPanel.createOrShow(context.extensionUri, parser, editor.document);
            }
        })
    );


    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.refreshModelTree', () => {
            modelExplorerProvider.refresh();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.refreshVisualization', () => {
            if (VisualizationPanel.currentPanel) {
                // Get the document from the current panel
                const currentDocument = VisualizationPanel.currentPanel.getDocument();

                if (currentDocument && currentDocument.languageId === 'sysml') {
                    VisualizationPanel.currentPanel.dispose();
                    VisualizationPanel.createOrShow(context.extensionUri, parser, currentDocument);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.visualizeFolder', async (uri: vscode.Uri) => {
            try {
                let targetUri = uri;

                // If no URI provided, try to get from active editor or selection
                if (!targetUri) {
                    const editor = vscode.window.activeTextEditor;
                    if (editor) {
                        targetUri = editor.document.uri;
                    }
                }

                if (!targetUri) {
                    vscode.window.showErrorMessage('No folder or file selected for SysML visualization');
                    return;
                }

                const stat = await vscode.workspace.fs.stat(targetUri);

                if (stat.type === vscode.FileType.Directory) {
                    // Handle folder selection - visualize all .sysml files in the folder
                    const folderUri = targetUri;

                    // Find all .sysml files in the folder
                    const sysmlFiles = await vscode.workspace.findFiles(
                        new vscode.RelativePattern(folderUri, '**/*.sysml'),
                        '**/node_modules/**'
                    );

                    if (sysmlFiles.length === 0) {
                        vscode.window.showInformationMessage('No SysML files found in the selected folder');
                        return;
                    }

                    // Read and combine all SysML files
                    let combinedContent = '';
                    const fileNames: string[] = [];

                    for (const fileUri of sysmlFiles) {
                        try {
                            const content = await vscode.workspace.fs.readFile(fileUri);
                            const fileName = fileUri.fsPath.substring(fileUri.fsPath.lastIndexOf('/') + 1);
                            fileNames.push(fileName);

                            combinedContent += `// === ${fileName} ===\n`;
                            combinedContent += Buffer.from(content).toString('utf8');
                            combinedContent += '\n\n';
                        } catch (error) {
                            console.warn(`Failed to read SysML file ${fileUri.fsPath}:`, error);
                        }
                    }

                    if (combinedContent.trim() === '') {
                        vscode.window.showErrorMessage('Failed to read any SysML files from the folder');
                        return;
                    }

                    // Create a virtual document for the combined content
                    // Use the first actual file as the base document to avoid untitled files
                    const firstFileDocument = await vscode.workspace.openTextDocument(sysmlFiles[0]);

                    // Create a wrapper that provides combined content but uses the real file URI
                    // This avoids creating an untitled document
                    const combinedDocumentProxy = {
                        getText: () => combinedContent,
                        uri: firstFileDocument.uri,
                        languageId: 'sysml',
                        version: firstFileDocument.version,
                        lineCount: combinedContent.split('\n').length,
                        lineAt: (line: number) => firstFileDocument.lineAt(Math.min(line, firstFileDocument.lineCount - 1)),
                        offsetAt: (position: vscode.Position) => firstFileDocument.offsetAt(position),
                        positionAt: (offset: number) => firstFileDocument.positionAt(offset),
                        getWordRangeAtPosition: (position: vscode.Position) => firstFileDocument.getWordRangeAtPosition(position),
                        validateRange: (range: vscode.Range) => firstFileDocument.validateRange(range),
                        validatePosition: (position: vscode.Position) => firstFileDocument.validatePosition(position),
                        fileName: firstFileDocument.fileName,
                        isUntitled: false,
                        isDirty: false,
                        isClosed: false,
                        eol: firstFileDocument.eol,
                        encoding: 'utf8',
                        save: () => Promise.resolve(false)
                    } as unknown as vscode.TextDocument;

                    // Show ONLY the visualization panel, not the text document
                    VisualizationPanel.createOrShow(context.extensionUri, parser, combinedDocumentProxy,
                        `SysML Visualization - ${fileNames.length} files from ${folderUri.fsPath}`);

                    vscode.window.showInformationMessage(
                        `Visualizing ${fileNames.length} SysML files: ${fileNames.join(', ')}`
                    );
                } else {
                    // Handle single file selection - visualize only the selected file
                    if (!targetUri.fsPath.endsWith('.sysml')) {
                        vscode.window.showErrorMessage('Selected file is not a SysML file (.sysml)');
                        return;
                    }

                    try {
                        const fileName = targetUri.fsPath.substring(targetUri.fsPath.lastIndexOf('/') + 1);

                        // Open the actual file document (not untitled) - this doesn't show it
                        const document = await vscode.workspace.openTextDocument(targetUri);

                        // Show the visualization with the single file
                        VisualizationPanel.createOrShow(context.extensionUri, parser, document,
                            `SysML Visualization - ${fileName}`);

                        vscode.window.showInformationMessage(`Visualizing single SysML file: ${fileName}`);
                    } catch (error) {
                        vscode.window.showErrorMessage(`Failed to read SysML file: ${error}`);
                        return;
                    }
                }

            } catch (error) {
                vscode.window.showErrorMessage(`Failed to visualize SysML folder: ${error}`);
                console.error('Error in sysml.visualizeFolder:', error);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.visualizeFolderWithView', async (uri: vscode.Uri) => {
            // Import at runtime to avoid circular dependencies
            const { getRendererDefinitions } = await import('./visualization/renderers');

            const views = getRendererDefinitions();
            const items = views.map(view => ({
                label: view.label,
                description: view.description,
                viewId: view.id
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select visualization view'
            });

            if (selected) {
                // Execute visualizeFolder with the selected view
                await vscode.commands.executeCommand('sysml.visualizeFolder', uri);
                // Then switch to the selected view
                if (VisualizationPanel.currentPanel) {
                    await vscode.commands.executeCommand('sysml.changeVisualizerView', selected.viewId);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.changeVisualizerView', async (viewId?: string) => {
            if (!VisualizationPanel.currentPanel) {
                vscode.window.showWarningMessage('No visualization panel is currently open');
                return;
            }

            let selectedViewId = viewId;

            // If no view ID provided, show picker
            if (!selectedViewId) {
                const { getRendererDefinitions } = await import('./visualization/renderers');
                const views = getRendererDefinitions();
                const items = views.map(view => ({
                    label: view.label,
                    description: view.description,
                    viewId: view.id
                }));

                const selected = await vscode.window.showQuickPick(items, {
                    placeHolder: 'Select visualization view'
                });

                if (!selected) {
                    return;
                }

                selectedViewId = selected.viewId;
            }

            // Change the view
            VisualizationPanel.currentPanel.changeView(selectedViewId);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.exportVisualization', async () => {
            const format = await vscode.window.showQuickPick(['PNG', 'SVG'], {
                placeHolder: 'Select export format'
            });
            if (format) {
                VisualizationPanel.currentPanel?.exportVisualization(format);
            }
        })
    );

    // Debug command to test parser
    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.debugParser', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'sysml') {
                outputChannel.clear();
                outputChannel.show();
                outputChannel.appendLine('=== SysML Parser Debug Test ===');
                outputChannel.appendLine(`Document: ${editor.document.fileName}`);
                outputChannel.appendLine(`Content length: ${editor.document.getText().length} characters`);

                try {
                    outputChannel.appendLine('Starting parser test...');
                    const elements = parser.parse(editor.document);
                    outputChannel.appendLine(`✅ Parser succeeded! Found ${elements.length} elements:`);

                    elements.forEach((element, index) => {
                        outputChannel.appendLine(`  ${index + 1}. ${element.name} (${element.type}) - ${element.children.length} children`);
                    });

                    const relationships = parser.getRelationships();
                    outputChannel.appendLine(`Found ${relationships.length} relationships`);

                    const sequenceDiagrams = parser.getSequenceDiagrams();
                    outputChannel.appendLine(`Found ${sequenceDiagrams.length} sequence diagrams`);

                    const activityDiagrams = parser.getActivityDiagrams(editor.document);
                    outputChannel.appendLine(`Found ${activityDiagrams.length} activity diagrams`);

                } catch (error) {
                    outputChannel.appendLine(`❌ Parser failed with error: ${error}`);
                    if (error instanceof Error) {
                        outputChannel.appendLine(`Stack trace: ${error.stack}`);
                    }
                }
                outputChannel.appendLine('=== Debug Test Complete ===');
            } else {
                vscode.window.showWarningMessage('Please open a SysML file first');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('sysml.jumpToDefinition', (uri: vscode.Uri, range: vscode.Range) => {
            if (!uri || !range) {
                vscode.window.showWarningMessage('Cannot navigate: missing location information');
                return;
            }

            vscode.window.showTextDocument(uri, {
                preserveFocus: false,
                preview: false
            }).then(editor => {
                // Set selection and reveal the range
                editor.selection = new vscode.Selection(range.start, range.end);
                editor.revealRange(range, vscode.TextEditorRevealType.InCenter);

                // Create a prominent highlight for the selected element
                const decorationType = vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255, 215, 0, 0.4)', // Gold background
                    border: '2px solid #FFD700', // Gold border
                    borderRadius: '3px',
                    isWholeLine: false,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
                });

                editor.setDecorations(decorationType, [range]);

                // Clear the highlight after 3 seconds
                setTimeout(() => {
                    decorationType.dispose();
                }, 3000);
            });
        })
    );

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === 'sysml') {
        vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);
        modelExplorerProvider.loadDocument(activeEditor.document);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === 'sysml') {
                vscode.commands.executeCommand('setContext', 'sysml.modelLoaded', true);
                modelExplorerProvider.loadDocument(editor.document);

                if (vscode.workspace.getConfiguration('sysml').get('validation.enabled')) {
                    validator.validate(editor.document);
                }
            }
        })
    );

    // Validate on open so diagnostics/squiggles appear without requiring an edit.
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.languageId === 'sysml') {
                if (vscode.workspace.getConfiguration('sysml').get('validation.enabled')) {
                    validator.validate(document);
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'sysml') {
                // Debounce document changes to avoid overwhelming the parser
                if (documentChangeDebounceTimer) {
                    globalThis.clearTimeout(documentChangeDebounceTimer);
                }

                documentChangeDebounceTimer = setTimeout(() => {
                    modelExplorerProvider.loadDocument(event.document);
                    if (vscode.workspace.getConfiguration('sysml').get('validation.enabled')) {
                        validator.validate(event.document);
                    }
                }, 50); // 50ms debounce - minimal delay for near-instant updates

                // Note: Visualization panel only updates on file save for smooth editing
            }
        })
    );

    // Update visualization only on file save for smooth editing experience
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(document => {
            if (document.languageId === 'sysml') {
                if (VisualizationPanel.currentPanel) {
                    VisualizationPanel.currentPanel.notifyFileChanged(document.uri);
                }
            }
        })
    );

    // Watch for file system changes to SysML files
    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.sysml');

    context.subscriptions.push(fileSystemWatcher);

    context.subscriptions.push(
        fileSystemWatcher.onDidChange(uri => {
            outputChannel.appendLine(`SysML file changed: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidCreate(uri => {
            outputChannel.appendLine(`SysML file created: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
        })
    );

    context.subscriptions.push(
        fileSystemWatcher.onDidDelete(uri => {
            outputChannel.appendLine(`SysML file deleted: ${uri.fsPath}`);
            if (VisualizationPanel.currentPanel) {
                VisualizationPanel.currentPanel.notifyFileChanged(uri);
            }
        })
    );
}

export function getOutputChannel(): vscode.OutputChannel {
    return outputChannel;
}

export function getLibraryService(): LibraryService {
    return libraryService;
}

export function deactivate() {
    outputChannel?.appendLine('SysML v2.0 extension is now deactivated');

    // Clean up resources
    if (VisualizationPanel.currentPanel) {
        VisualizationPanel.currentPanel.dispose();
    }
}
