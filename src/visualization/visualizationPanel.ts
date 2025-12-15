import * as vscode from 'vscode';
import { SysMLElement, SysMLParser } from '../parser/sysmlParser';

export class VisualizationPanel {
    public static currentPanel: VisualizationPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private _currentView: string = 'elk'; // Store current view state - default to General View
    private _isNavigating: boolean = false; // Flag to prevent view reset during navigation
    private _lastUpdateTime: number = 0; // Prevent rapid successive updates
    private _fileChangeDebounceTimer: ReturnType<typeof setTimeout> | undefined; // Debounce file change notifications
    private _lastContentHash: string = ''; // Cache content hash to skip unchanged updates
    private _pendingUpdate: ReturnType<typeof setTimeout> | undefined; // Coalesce rapid updates

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,

        private _parser: SysMLParser,

        private _document: vscode.TextDocument
    ) {
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, extensionUri);

        // Request current view state from webview after initialization
        setTimeout(() => {
            this._panel.webview.postMessage({ command: 'requestCurrentView' });
        }, 100);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'webviewLog':
                        // Forward webview console logs to VS Code output channel
                        this.logWebviewMessage(message.level, message.args);
                        break;
                    case 'jumpToElement':
                        this.jumpToElement(message.elementName);
                        break;
                    case 'export':
                        this.handleExport(message.format, message.data);
                        break;
                    case 'executeCommand':
                        if (message.args && message.args.length > 0) {
                            // Execute command asynchronously with a small delay to ensure webview context is ready
                            setTimeout(() => {
                                vscode.commands.executeCommand(message.args[0]);
                            }, 100);
                        }
                        break;
                    case 'viewChanged':
                        // Store the current view state when it changes
                        this._currentView = message.view;
                        break;
                    case 'currentViewResponse':
                        // Update our stored view state with the current webview state
                        this._currentView = message.view;
                        break;
                }
            },
            null,
            this._disposables
        );

        this.updateVisualization();
    }

    public static createOrShow(extensionUri: vscode.Uri, parser: SysMLParser, document: vscode.TextDocument, customTitle?: string) {
        // Determine the best column layout for side-by-side viewing
        const activeColumn = vscode.window.activeTextEditor?.viewColumn;
        let visualizerColumn: vscode.ViewColumn;

        if (activeColumn === vscode.ViewColumn.One) {
            visualizerColumn = vscode.ViewColumn.Two;
        } else if (activeColumn === vscode.ViewColumn.Two) {
            visualizerColumn = vscode.ViewColumn.Three;
        } else {
            // Default: put visualizer on the right
            visualizerColumn = vscode.ViewColumn.Beside;
        }

        const title = customTitle || 'SysML Model Visualizer';

        if (VisualizationPanel.currentPanel) {
            // If panel exists, update title and reveal it
            VisualizationPanel.currentPanel._panel.title = title;
            VisualizationPanel.currentPanel._panel.reveal(visualizerColumn);
            // Only update if the document has actually changed
            if (VisualizationPanel.currentPanel._document !== document) {
                VisualizationPanel.currentPanel._document = document;
                VisualizationPanel.currentPanel.updateVisualization();
            }
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'sysmlVisualizer',
            title,
            visualizerColumn,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'media'),
                    extensionUri
                ]
            }
        );

        VisualizationPanel.currentPanel = new VisualizationPanel(panel, extensionUri, parser, document);
    }

    public exportVisualization(format: string) {
        this._panel.webview.postMessage({ command: 'export', format: format.toLowerCase() });
    }

    // Simple hash function for content comparison
    private hashContent(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    private async updateVisualization(forceUpdate: boolean = false) {
        // Skip update if we're currently navigating to prevent view reset
        if (this._isNavigating) {
            return;
        }

        // Check content hash first - skip expensive parsing if content unchanged
        const content = this._document.getText();
        const contentHash = this.hashContent(content);

        if (!forceUpdate && contentHash === this._lastContentHash) {
            // Content unchanged, skip update entirely
            return;
        }
        this._lastContentHash = contentHash;

        // Execute immediately - no debounce needed since content hash prevents redundant work
        await this._doUpdateVisualization();
    }

    private _doUpdateVisualization() {
        // Use fast parse for visualization - skip semantic resolution for speed
        // Semantic resolution is expensive and not needed for diagram rendering
        const elements = this._parser.parse(this._document);

        const relationships = this._parser.getRelationships();
        const sequenceDiagrams = this._parser.getSequenceDiagrams();

        // Get activity diagrams from parser
        const activityDiagrams = this._parser.getActivityDiagrams(this._document);

        const jsonElements = this.convertElementsToJSON(elements);

        // CRITICAL: Remove circular references before JSON serialization
        // The collectAllElements function may have added parentElement object references
        // which create circular structures that break JSON.stringify()
        function cleanCircularRefs(obj: any): any {
            if (!obj || typeof obj !== 'object') return obj;

            // Remove parentElement property that creates circular references
            if (obj.parentElement) {
                delete obj.parentElement;
            }

            // Recursively clean arrays
            if (Array.isArray(obj)) {
                obj.forEach(item => cleanCircularRefs(item));
            } else {
                // Recursively clean object properties
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        cleanCircularRefs(obj[key]);
                    }
                });
            }

            return obj;
        }

        // Clean all data structures before sending to webview
        cleanCircularRefs(jsonElements);
        cleanCircularRefs(relationships);
        cleanCircularRefs(sequenceDiagrams);
        cleanCircularRefs(activityDiagrams);

        this._panel.webview.postMessage({
            command: 'update',
            elements: jsonElements,
            relationships: relationships,
            sequenceDiagrams: sequenceDiagrams,
            activityDiagrams: activityDiagrams,
            currentView: this._currentView // Send the stored view state
        });
    }

    private convertElementsToJSON(elements: SysMLElement[]): Array<{
        name: string;
        type: string;
        attributes: Record<string, string | number | boolean>;
        children: Array<{name: string; type: string; attributes: Record<string, string | number | boolean>; children: unknown; relationships: import('../parser/sysmlParser').Relationship[]}>;
        relationships: import('../parser/sysmlParser').Relationship[];
    }> {
        return elements.map(element => {
            const attributes: Record<string, string | number | boolean> = {};
            if (element.attributes) {
                element.attributes.forEach((value, key) => {
                    attributes[key] = value;
                });
            }

            // Sanitize relationships to remove circular references
            // Only keep the essential string properties, not object references
            const sanitizedRelationships = (element.relationships || []).map(rel => ({
                type: rel.type,
                source: rel.source,
                target: rel.target,
                // Don't include sourceElement or targetElement which might be object references
            }));

            return {
                name: element.name,
                type: element.type,
                id: (element as any).id || element.name,
                attributes,
                properties: (element as any).properties || {},
                typing: (element as any).typing,
                children: this.convertElementsToJSON(element.children),
                relationships: sanitizedRelationships
            };
        });
    }

    private logWebviewMessage(level: string, args: any[]) {
        try {
            const { getOutputChannel } = require('../extension');
            const outputChannel = getOutputChannel();
            if (!outputChannel) {
                return;
            }

            // Format the message
            const formattedArgs = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');

            const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
            outputChannel.appendLine(`[Webview ${level.toUpperCase()}] ${prefix} ${formattedArgs}`);
        } catch (error) {
            // Silently fail if output channel not available
            console.error('Failed to log webview message:', error);
        }
    }

    private async jumpToElement(elementName: string) {
        this._isNavigating = true; // Set navigation flag

        let element = this._parser.findElement(elementName);

        // If not found in map, try searching recursively through the tree
        if (!element) {
            // Parse document to get all elements for recursive search
            const resolutionResult = await this._parser.parseWithSemanticResolution(this._document);
            const allElements = this._parser.convertEnrichedToSysMLElements(resolutionResult.elements);
            element = this.findElementRecursive(elementName, allElements);
        }

        if (element) {
            // Determine the appropriate column for the text editor
            // If visualizer is in column 2, open text in column 1, and vice versa
            const visualizerColumn = this._panel.viewColumn || vscode.ViewColumn.Two;
            const targetColumn = visualizerColumn === vscode.ViewColumn.One
                ? vscode.ViewColumn.Two
                : vscode.ViewColumn.One;

            // Open the document in the target column without stealing focus
            vscode.window.showTextDocument(this._document, {
                viewColumn: targetColumn,
                preserveFocus: true, // This prevents the text editor from stealing focus
                preview: false // Ensure it opens in a permanent editor tab
            }).then(editor => {
                // Navigate to the element
                editor.selection = new vscode.Selection(element.range.start, element.range.end);
                editor.revealRange(element.range, vscode.TextEditorRevealType.InCenter);

                // Create a more prominent highlight for the selected element
                const decorationType = vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255, 215, 0, 0.4)', // Gold background
                    border: '2px solid #FFD700', // Gold border
                    borderRadius: '3px',
                    isWholeLine: false,
                    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
                });

                editor.setDecorations(decorationType, [element.range]);

                // Clear the highlight after 3 seconds
                setTimeout(() => {
                    decorationType.dispose();
                }, 3000);

                // Send a message back to the webview to highlight the clicked element
                this._panel.webview.postMessage({
                    command: 'highlightElement',
                    elementName: elementName
                });

                // Clear navigation flag after a delay
                setTimeout(() => {
                    this._isNavigating = false;
                }, 500);
            });
        } else {
            // If element not found, show a message but don't change focus
            vscode.window.showInformationMessage(`Element "${elementName}" not found in the current document.`);
            this._isNavigating = false;
        }
    }

    private findElementRecursive(name: string, elements: SysMLElement[]): SysMLElement | undefined {
        for (const element of elements) {
            if (element.name === name) {
                return element;
            }
            if (element.children && element.children.length > 0) {
                const found = this.findElementRecursive(name, element.children);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    }

    private async handleExport(format: string, data: string) {
        const filters: { [key: string]: string[] } = {
            'PNG Images': ['png'],
            'SVG Images': ['svg'],
            'PDF Documents': ['pdf'],
            'JSON Files': ['json']
        };

        const uri = await vscode.window.showSaveDialog({
            filters: filters,
            defaultUri: vscode.Uri.file(`sysml-model.${format}`)
        });

        if (uri) {
            let buffer: Buffer;

            if (format === 'json') {
                // JSON data is already a data URL, extract the content
                if (data.startsWith('data:')) {
                    buffer = Buffer.from(data.split(',')[1], 'base64');
                } else {
                    // Direct JSON string
                    buffer = Buffer.from(data, 'utf8');
                }
            } else if (format === 'pdf') {
                // For PDF, we'll save the SVG data for now
                // In a full implementation, this would convert to actual PDF
                vscode.window.showInformationMessage('PDF export is not fully implemented yet. Saving as SVG instead.');
                buffer = Buffer.from(data, 'utf8');
            } else {
                // PNG/SVG - extract from data URL
                buffer = Buffer.from(data.split(',')[1], 'base64');
            }

            await vscode.workspace.fs.writeFile(uri, buffer);
            vscode.window.showInformationMessage(`Visualization exported to ${uri.fsPath}`);
        }
    }

    public getDocument(): vscode.TextDocument {
        return this._document;
    }

    public changeView(viewId: string): void {
        this._panel.webview.postMessage({
            command: 'changeView',
            view: viewId
        });
        this._currentView = viewId;
    }

    public notifyFileChanged(uri: vscode.Uri) {
        // Instant update - content hash check in updateVisualization prevents redundant work
        if (this._document.uri.toString() === uri.toString()) {
            this.updateVisualization();
        }
    }

    public dispose() {
        VisualizationPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }


    private _getHtmlForWebview(webview: vscode.Webview, extensionUri: vscode.Uri): string {
        // Get URIs for local vendor scripts
        const d3Uri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'd3.min.js'));
        const elkUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'elk.bundled.js'));
        const elkWorkerUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'webview', 'elkWorker.js'));
        const cytoscapeUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape.min.js'));
        const cytoscapeElkUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape-elk.js'));
        const cytoscapeSvgUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape-svg.js'));

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>SysML Model Visualizer v${Date.now()}</title>
    <script src="${d3Uri}"></script>
    <script src="${elkUri}"></script>
    <script src="${cytoscapeUri}"></script>
    <script src="${cytoscapeElkUri}"></script>
    <script src="${cytoscapeSvgUri}"></script>
    <style>
        * {
            font-family: var(--vscode-font-family), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        body {
            margin: 0;
            padding: 20px;
            font-size: 13px;
            font-weight: 400;
            line-height: 1.5;
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        #controls {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
        }
        #status-bar {
            margin-bottom: 8px;
            padding: 6px 12px;
            background-color: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.3;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        #status-text {
            flex-grow: 1;
        }
        button {
            margin-right: 4px;
            padding: 5px 10px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            font-weight: 500;
            line-height: 1.2;
            letter-spacing: 0.02em;
            transition: all 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        button:active {
            opacity: 0.9;
        }
        .view-btn {
            background: var(--vscode-button-secondaryBackground, var(--vscode-input-background));
            color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
            border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
            font-weight: 500;
            padding: 5px 10px;
        }
        .view-btn:hover {
            background: var(--vscode-button-secondaryHoverBackground, var(--vscode-list-hoverBackground));
            border-color: var(--vscode-focusBorder);
        }
        .view-btn-active {
            background: var(--vscode-button-background) !important;
            color: var(--vscode-button-foreground) !important;
            border-color: var(--vscode-button-background) !important;
        }
        .view-dropdown {
            position: relative;
            display: inline-flex;
            align-items: stretch;
        }
        .view-dropdown-menu {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            min-width: 180px;
            background: var(--vscode-menu-background, var(--vscode-dropdown-background));
            border: 1px solid var(--vscode-menu-border, var(--vscode-panel-border));
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            padding: 4px;
            display: none;
            flex-direction: column;
            gap: 1px;
            z-index: 20;
        }
        .view-dropdown-menu.show {
            display: flex;
        }
        .view-dropdown-item {
            width: 100%;
            justify-content: flex-start;
            padding: 6px 10px;
            margin: 0;
            border: none;
            border-radius: 3px;
            background: none;
            color: var(--vscode-menu-foreground, var(--vscode-foreground));
            font-size: 11px;
            font-weight: 400;
            line-height: 1.3;
            transition: background 0.1s ease;
        }
        .view-dropdown-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .view-dropdown-item.active {
            background: var(--vscode-list-activeSelectionBackground);
            color: var(--vscode-list-activeSelectionForeground);
            font-weight: 500;
        }
        .export-dropdown {
            position: relative;
            display: inline-block;
        }
        .export-menu {
            display: none;
            position: fixed;
            background-color: var(--vscode-menu-background);
            border: 1px solid var(--vscode-menu-border);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            min-width: 130px;
            width: 130px;
            z-index: 10000;
            padding: 4px;
        }
        @keyframes dropdown-appear {
            from {
                opacity: 0;
                transform: translateY(-12px) scale(0.92);
                filter: blur(4px);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }

        .export-menu.show {
            display: block;
        }
        .export-menu-item {
            display: block;
            width: 100%;
            padding: 6px 10px;
            margin: 0;
            text-align: left;
            background: none;
            border: none;
            border-radius: 3px;
            color: var(--vscode-menu-foreground);
            font-size: 11px;
            font-weight: 400;
            line-height: 1.2;
            transition: background-color 0.1s ease;
        }
        .export-menu-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .export-menu-item:first-child {
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }
        .export-menu-item:last-child {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }
        .action-btn {
            background: var(--vscode-button-secondaryBackground, var(--vscode-input-background));
            color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
            border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
            padding: 4px 8px;
            font-size: 11px;
        }
        .action-btn:hover {
            background-color: var(--vscode-button-secondaryHoverBackground, var(--vscode-list-hoverBackground));
            border-color: var(--vscode-focusBorder);
        }
        .primary-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: 1px solid transparent;
            padding: 4px 8px;
            font-size: 11px;
        }
        .primary-btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        #visualization-wrapper {
            position: relative;
            width: 100%;
            height: calc(100vh - 100px);
            min-height: 400px;
        }
        #visualization {
            width: 100%;
            height: 100%;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        /* Loading overlay styles */
        #loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--vscode-editor-background);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            border-radius: 8px;
            border: 1px solid var(--vscode-panel-border);
        }
        #loading-overlay.hidden {
            display: none;
        }
        .loading-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--vscode-panel-border);
            border-top-color: var(--vscode-button-background);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .loading-text {
            font-size: 14px;
            color: var(--vscode-foreground);
            margin-bottom: 12px;
            font-weight: 500;
        }
        .loading-progress-container {
            width: 200px;
            height: 4px;
            background: var(--vscode-panel-border);
            border-radius: 2px;
            overflow: hidden;
        }
        .loading-progress-bar {
            height: 100%;
            width: 30%;
            background: linear-gradient(90deg, var(--vscode-button-background), var(--vscode-button-hoverBackground));
            border-radius: 2px;
            animation: progress-indeterminate 1.5s ease-in-out infinite;
        }
        @keyframes progress-indeterminate {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(150%); width: 50%; }
            100% { transform: translateX(400%); width: 30%; }
        }
        #visualization.structural-transition-active {
            will-change: opacity, transform;
        }
        #visualization.structural-transition-active.fade-out {
            opacity: 0;
            transform: scale(0.98);
        }
        #visualization.structural-transition-active.fade-in {
            opacity: 1;
            transform: scale(1);
        }
        #visualization svg {
            display: block;
            width: 100%;
            height: 100%;
        }
        .node-group {
            cursor: pointer;
        }
        .node-group:hover .node-background {
            stroke-width: 2px !important;
            opacity: 1 !important;
        }
        .node {
            cursor: pointer;
            fill: var(--vscode-editor-selectionBackground);
            stroke: var(--vscode-editor-foreground);
            stroke-width: 2px;
        }
        .node:hover {
            fill: var(--vscode-editor-selectionHighlightBackground);
            stroke-width: 3px;
        }
        .node-background {
            transition: all 0.2s ease;
        }
        .node-label {
            fill: var(--vscode-editor-foreground);
            font-size: 12px;
            font-family: var(--vscode-font-family);
            pointer-events: none;
            dominant-baseline: central;
        }
        .node-type {
            fill: var(--vscode-descriptionForeground);
            font-size: 10px;
            font-family: var(--vscode-font-family);
            pointer-events: none;
            dominant-baseline: central;
        }
        .node-children {
            fill: var(--vscode-descriptionForeground);
            font-size: 9px;
            font-family: var(--vscode-font-family);
            pointer-events: none;
            opacity: 0.7;
        }
        .graph-node-group {
            cursor: pointer;
        }
        .graph-node-group:hover .graph-node-background {
            stroke-width: 2px !important;
            opacity: 1 !important;
        }
        .graph-node-background {
            transition: all 0.2s ease;
        }
        .hierarchy-cell:hover rect {
            stroke-width: 2px;
            opacity: 1;
            transform: scale(1.02);
            transition: all 0.2s ease;
        }
        .hierarchy-cell rect {
            transition: all 0.2s ease;
        }
        .hierarchy-cell .node-label {
            fill: var(--vscode-editor-foreground);
            font-size: 13px;
            font-weight: 600;
            pointer-events: none;
            dominant-baseline: central;
        }
        .hierarchy-cell .node-type {
            fill: var(--vscode-descriptionForeground);
            font-size: 11px;
            font-weight: 500;
            pointer-events: none;
            dominant-baseline: central;
        }
        .hierarchy-card-title {
            fill: var(--vscode-editor-foreground);
            font-size: 13px;
            font-weight: 600;
        }
        .hierarchy-card-type {
            fill: var(--vscode-descriptionForeground);
            font-size: 11px;
            font-style: italic;
        }
        .hierarchy-section-title {
            fill: var(--vscode-descriptionForeground);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .hierarchy-detail-text {
            fill: var(--vscode-editor-foreground);
            font-size: 11px;
        }
        .hierarchy-stat-pill-bg {
            fill: rgba(255, 255, 255, 0.05);
            stroke: var(--vscode-panel-border);
            stroke-width: 1px;
        }
        .hierarchy-stat-pill-label {
            fill: var(--vscode-editor-foreground);
            font-size: 10px;
            font-weight: 600;
        }
        .hierarchy-child-card rect {
            fill: rgba(255, 255, 255, 0.04);
            stroke: var(--vscode-panel-border);
            stroke-width: 1px;
            rx: 4px;
            ry: 4px;
        }
        .hierarchy-child-card text {
            fill: var(--vscode-editor-foreground);
            font-size: 10px;
            font-weight: 500;
        }
        .view-btn-active {
            background: var(--vscode-button-background) !important;
            color: var(--vscode-button-foreground) !important;
            border: 2px solid var(--vscode-charts-blue) !important;
            font-weight: bold !important;
            box-shadow: 0 0 4px var(--vscode-charts-blue) !important;
        }
        .highlighted-element {
            filter: drop-shadow(0 0 10px #FFD700);
        }
        .highlighted-element .node-background,
        .highlighted-element .graph-node-background,
        .highlighted-element rect {
            stroke: #FFD700 !important;
            stroke-width: 3px !important;
            opacity: 1 !important;
        }
        .highlighted-element .node {
            stroke: #FFD700 !important;
            stroke-width: 4px !important;
            fill: #FFD700 !important;
        }
        .element-pulse {
            pointer-events: none;
        }
        .link {
            fill: none;
            stroke: var(--vscode-editor-foreground);
            stroke-width: 1.5px;
            opacity: 0.6;
        }
        .relationship-link {
            fill: none;
            stroke: var(--vscode-charts-red);
            stroke-width: 2px;
            stroke-dasharray: 5, 5;
            opacity: 0.5;
        }

        .filter-input {
            padding: 5px 8px;
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.2;
            width: 150px;
            transition: border-color 0.1s ease;
        }
        .filter-input:hover {
            border-color: var(--vscode-focusBorder);
        }
        .filter-input:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }
        #sysml-toolbar {
            display: none;
            flex-direction: column;
            gap: 6px;
            padding: 6px 10px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            background-color: var(--vscode-editor-background);
            margin-bottom: 8px;
        }
        #sysml-toolbar.visible {
            display: flex;
        }
        .sysml-layout-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 400;
            line-height: 1.2;
            color: var(--vscode-descriptionForeground);
            flex-wrap: wrap;
        }
        .sysml-layout-btn {
            padding: 4px 8px;
            border-radius: 3px;
            border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
            background: var(--vscode-input-background);
            color: var(--vscode-foreground);
            cursor: pointer;
            font-size: 10px;
            font-weight: 500;
            line-height: 1.2;
            transition: all 0.1s ease;
        }
        .sysml-layout-btn.active {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-button-background);
        }
        .metadata-toggle {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            color: var(--vscode-foreground);
            user-select: none;
        }
        .metadata-toggle:hover {
            background: var(--vscode-list-hoverBackground);
        }
        .metadata-toggle input[type="checkbox"] {
            cursor: pointer;
            margin: 0;
        }
        #sysml-cytoscape {
            width: 100%;
            height: 100%;
        }
        /* Minimap styles */
        #minimap-container {
            position: absolute;
            bottom: 12px;
            right: 12px;
            width: 150px;
            height: 100px;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            z-index: 1000;
            opacity: 0.85;
            transition: opacity 0.15s ease;
        }
        #minimap-container:hover {
            opacity: 1;
        }
        #minimap-container.hidden {
            display: none;
        }
        #minimap-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 6px;
            background: var(--vscode-titleBar-activeBackground);
            border-bottom: 1px solid var(--vscode-panel-border);
            font-size: 9px;
            color: var(--vscode-titleBar-activeForeground);
            cursor: move;
        }
        #minimap-toggle {
            background: none;
            border: none;
            color: var(--vscode-titleBar-activeForeground);
            cursor: pointer;
            font-size: 10px;
            padding: 0 2px;
            opacity: 0.7;
            margin: 0;
        }
        #minimap-toggle:hover {
            opacity: 1;
        }
        #minimap-canvas {
            width: 100%;
            height: calc(100% - 18px);
            cursor: pointer;
        }
        #minimap-viewport {
            position: absolute;
            border: 1px solid var(--vscode-button-background);
            background: rgba(30, 136, 229, 0.1);
            pointer-events: none;
            border-radius: 2px;
        }
    </style>
</head>
<body>
    <div id="controls">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <div class="view-dropdown">
                <button id="view-dropdown-btn" class="view-btn" title="Switch between visualization views">
                    <span style="font-size: 8px;">▼</span> View
                </button>
                <div id="view-dropdown-menu" class="view-dropdown-menu">
                    <button class="view-dropdown-item" data-view="elk">◆ General</button>
                    <button class="view-dropdown-item" data-view="ibd">▦ Interconnection</button>
                    <button class="view-dropdown-item" data-view="activity">▶ Activity</button>
                    <button class="view-dropdown-item" data-view="state">⌘ State</button>
                    <button class="view-dropdown-item" data-view="sequence">⇄ Sequence</button>
                    <button class="view-dropdown-item" data-view="usecase">◎ Case</button>
                    <div style="border-top: 1px solid var(--vscode-panel-border); margin: 3px 0;"></div>
                    <button class="view-dropdown-item" data-view="tree">▲ Tree</button>
                    <button class="view-dropdown-item" data-view="package">▤ Package</button>
                    <button class="view-dropdown-item" data-view="graph">● Graph</button>
                    <button class="view-dropdown-item" data-view="hierarchy">■ Hierarchy</button>
                </div>
            </div>
            <span style="color: var(--vscode-panel-border);">|</span>
            <button id="fit-btn" class="action-btn" title="Fit diagram to view">⊞ Fit</button>
            <button id="reset-btn" class="action-btn" title="Reset zoom">↻ Reset</button>
            <button id="layout-direction-btn" class="action-btn" title="Toggle layout direction">→ LR</button>
            <button id="category-headers-btn" class="action-btn" title="Toggle category headers">☰ Group</button>
            <button id="minimap-toolbar-btn" class="action-btn" title="Toggle minimap">🗺</button>
            <span style="color: var(--vscode-panel-border);">|</span>
            <div class="export-dropdown" style="position: relative; display: inline-block;">
                <button id="export-btn" class="primary-btn" title="Export diagram">⇓ Export</button>
                <div id="export-menu" class="export-menu">
                    <button class="export-menu-item" data-format="png">PNG</button>
                    <button class="export-menu-item" data-format="svg">SVG</button>
                    <button class="export-menu-item" data-format="pdf">PDF</button>
                    <button class="export-menu-item" data-format="json">JSON</button>
                </div>
            </div>
            <span style="color: var(--vscode-panel-border);">|</span>
            <input type="text" class="filter-input" id="element-filter" placeholder="Filter..." oninput="filterElements(this.value)" title="Filter elements">
            <button id="clear-filter-btn" class="action-btn" title="Clear filter" style="padding: 4px 6px;">✕</button>
        </div>
    </div>
    <div id="status-bar">
        <span id="status-text">Ready</span>
    </div>

    <div id="sysml-toolbar" class="sysml-toolbar">
        <div class="sysml-layout-toggle">
            <button class="sysml-layout-btn active" data-sysml-mode="hierarchy">Hierarchy</button>
            <button class="sysml-layout-btn" data-sysml-mode="relationships">Orthogonal</button>
            <button class="sysml-layout-btn active" id="orientation-toggle" title="Toggle layout orientation">Linear</button>
            <label class="metadata-toggle" id="metadata-toggle" title="Show metadata">
                <input type="checkbox" id="metadata-checkbox" />
                <span>Details</span>
            </label>
        </div>
    </div>

    <div id="diagram-selector-container" style="display: none; padding: 6px 12px; background: var(--vscode-editor-background); border-bottom: 1px solid var(--vscode-panel-border); align-items: center; gap: 8px;">
        <label id="diagram-selector-label" style="font-size: 11px; font-weight: 500; color: var(--vscode-foreground);">Diagram:</label>
        <select id="diagram-selector" class="diagram-selector" style="padding: 4px 8px; font-size: 11px; background: var(--vscode-dropdown-background); color: var(--vscode-dropdown-foreground); border: 1px solid var(--vscode-dropdown-border); border-radius: 3px; cursor: pointer; min-width: 160px;"></select>
        <span id="diagram-count" style="font-size: 10px; color: var(--vscode-descriptionForeground);"></span>
    </div>
    <div id="visualization-wrapper">
        <div id="visualization"></div>
        <!-- Loading overlay (outside visualization to avoid being removed) -->
        <div id="loading-overlay">
            <div class="loading-spinner"></div>
            <div class="loading-text">Parsing SysML model...</div>
            <div class="loading-progress-container">
                <div class="loading-progress-bar"></div>
            </div>
        </div>
    </div>

    <!-- Minimap for navigation -->
    <div id="minimap-container">
        <div id="minimap-header">
            <span>Minimap</span>
            <button id="minimap-toggle" title="Hide minimap">−</button>
        </div>
        <canvas id="minimap-canvas"></canvas>
        <div id="minimap-viewport"></div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        // ELK Worker URL (must be set before ELK is instantiated)
        const elkWorkerUrl = '${elkWorkerUri}';

        let currentData = null;
        let currentView = 'elk';  // General View as default
        let selectedDiagramIndex = 0; // Track currently selected diagram for multi-diagram views
        const STRUCTURAL_VIEWS = new Set(['elk', 'hierarchy']);
        const MIN_CANVAS_ZOOM = 0.04;
        const MAX_CANVAS_ZOOM = 5;
        const MIN_SYSML_ZOOM = 0.04;
        const MAX_SYSML_ZOOM = 5;
        const ORIENTATION_LABELS = {
            horizontal: 'Horizontal',
            linear: 'Linear (Top-Down)'
        };
        const STATE_LAYOUT_LABELS = {
            horizontal: 'Left → Right',
            vertical: 'Top → Down',
            force: 'Auto-arrange'
        };
        const STATE_LAYOUT_ICONS = {
            horizontal: '→',
            vertical: '↓',
            force: '⚡'
        };
        // Use Case layout configuration (reuses same labels/icons)
        const USECASE_LAYOUT_LABELS = STATE_LAYOUT_LABELS;
        const USECASE_LAYOUT_ICONS = STATE_LAYOUT_ICONS;
        let lastView = currentView;
        let svg = null;
        let g = null;
        let zoom = null;
        let cy = null;
        let sysmlMode = 'hierarchy';
        let layoutDirection = 'horizontal'; // Universal layout direction: 'horizontal', 'vertical', or 'auto'
        let activityLayoutDirection = 'vertical'; // Activity diagrams default to top-down
        let stateLayoutOrientation = 'horizontal'; // Layout direction: 'horizontal', 'vertical', or 'force'
        let usecaseLayoutOrientation = 'horizontal'; // Use case layout: 'horizontal', 'vertical', or 'force'
        let filteredData = null; // Active filter state shared across views
        let isRendering = false;
        let showMetadata = false;
        let showCategoryHeaders = true; // Show category headers in General View
        const sysmlElementLookup = new Map();
        const VIEW_OPTIONS = {
            tree: { label: '▲ Tree View' },
            elk: { label: '◆ General View' },
            graph: { label: '● Graph View' },
            hierarchy: { label: '■ Hierarchy View' },
            sequence: { label: '⇄ Sequence View' },
            ibd: { label: '▦ Interconnection View' },
            activity: { label: '▶ Action Flow View' },
            state: { label: '⌘ State Transition View' },
            usecase: { label: '◎ Case View' },
            package: { label: '▤ Package View' }
        };
        // Legacy pillar view variables (kept for compatibility with old functions)
        const SYSML_PILLARS = [];
        const PILLAR_COLOR_MAP = {};
        const expandedPillars = new Set();
        let pillarOrientation = 'horizontal';
    let sysmlToolbarInitialized = false;
    let lastPillarStats = {};

        // ============== LOADING INDICATOR FUNCTIONALITY ==============
        function showLoading(message = 'Rendering diagram...') {
            const overlay = document.getElementById('loading-overlay');
            const textEl = overlay?.querySelector('.loading-text');
            if (overlay) {
                if (textEl) textEl.textContent = message;
                overlay.classList.remove('hidden');
            }
        }

        function hideLoading() {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        }

        // ============== MINIMAP FUNCTIONALITY ==============
        let minimapVisible = true;
        let minimapDragging = false;

        function initMinimap() {
            const container = document.getElementById('minimap-container');
            const canvas = document.getElementById('minimap-canvas');
            const toggle = document.getElementById('minimap-toggle');
            const header = document.getElementById('minimap-header');
            const toolbarBtn = document.getElementById('minimap-toolbar-btn');

            if (!container || !canvas || !toggle) return;

            // Function to toggle minimap visibility
            function toggleMinimapVisibility() {
                minimapVisible = !minimapVisible;
                if (minimapVisible) {
                    container.style.display = 'block';
                    toggle.textContent = '−';
                    toggle.title = 'Hide minimap';
                    if (toolbarBtn) {
                        toolbarBtn.classList.add('active');
                        toolbarBtn.style.background = 'var(--vscode-button-background)';
                        toolbarBtn.style.color = 'var(--vscode-button-foreground)';
                    }
                    updateMinimap();
                } else {
                    container.style.display = 'none';
                    toggle.textContent = '+';
                    toggle.title = 'Show minimap';
                    if (toolbarBtn) {
                        toolbarBtn.classList.remove('active');
                        toolbarBtn.style.background = '';
                        toolbarBtn.style.color = '';
                    }
                }
            }

            // Toggle minimap visibility from minimap header button
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMinimapVisibility();
            });

            // Toggle minimap visibility from toolbar button
            if (toolbarBtn) {
                toolbarBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleMinimapVisibility();
                });
                // Set initial state to active
                toolbarBtn.classList.add('active');
                toolbarBtn.style.background = 'var(--vscode-button-background)';
                toolbarBtn.style.color = 'var(--vscode-button-foreground)';
            }

            // Click on minimap to navigate
            canvas.addEventListener('mousedown', handleMinimapClick);
            canvas.addEventListener('mousemove', handleMinimapDrag);
            canvas.addEventListener('mouseup', () => { minimapDragging = false; });
            canvas.addEventListener('mouseleave', () => { minimapDragging = false; });
        }

        function handleMinimapClick(event) {
            minimapDragging = true;
            navigateFromMinimap(event);
        }

        function handleMinimapDrag(event) {
            if (minimapDragging) {
                navigateFromMinimap(event);
            }
        }

        function navigateFromMinimap(event) {
            const canvas = document.getElementById('minimap-canvas');
            if (!canvas || !svg || !g || !zoom) return;

            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Get the content bounds
            const gNode = g.node();
            if (!gNode) return;
            const bounds = gNode.getBBox();
            if (!bounds || bounds.width === 0 || bounds.height === 0) return;

            // Calculate scale factors
            const padding = 10;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const scaleX = (canvasWidth - 2 * padding) / bounds.width;
            const scaleY = (canvasHeight - 2 * padding) / bounds.height;
            const scale = Math.min(scaleX, scaleY);

            // Calculate the offset used when drawing the minimap
            const offsetX = padding + (canvasWidth - 2 * padding - bounds.width * scale) / 2;
            const offsetY = padding + (canvasHeight - 2 * padding - bounds.height * scale) / 2;

            // Convert click position to content coordinates
            const contentX = bounds.x + (x - offsetX) / scale;
            const contentY = bounds.y + (y - offsetY) / scale;

            // Get current zoom transform
            const currentTransform = d3.zoomTransform(svg.node());
            const svgWidth = +svg.attr('width');
            const svgHeight = +svg.attr('height');

            // Calculate new translation to center on clicked point
            const translateX = svgWidth / 2 - contentX * currentTransform.k;
            const translateY = svgHeight / 2 - contentY * currentTransform.k;

            // Apply the new transform with animation
            svg.transition()
                .duration(300)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(translateX, translateY)
                    .scale(currentTransform.k));
        }

        function updateMinimap() {
            if (!minimapVisible) return;

            const container = document.getElementById('minimap-container');
            const canvas = document.getElementById('minimap-canvas');
            const viewport = document.getElementById('minimap-viewport');

            if (!container || !canvas || !viewport) return;

            // Handle Cytoscape (SysML/Pillar view)
            if (currentView === 'sysml' && cy) {
                updateMinimapCytoscape(canvas, viewport, container);
                container.style.display = 'block';
                return;
            }

            // Handle D3 SVG views
            if (!svg || !g) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'block';

            const gNode = g.node();
            if (!gNode) return;

            const bounds = gNode.getBBox();
            if (!bounds || bounds.width === 0 || bounds.height === 0) return;

            // Set canvas size based on container
            const containerRect = container.getBoundingClientRect();
            canvas.width = containerRect.width;
            canvas.height = containerRect.height - 22; // Subtract header height

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scale to fit content in minimap
            const padding = 10;
            const scaleX = (canvas.width - 2 * padding) / bounds.width;
            const scaleY = (canvas.height - 2 * padding) / bounds.height;
            const scale = Math.min(scaleX, scaleY);

            // Calculate offset to center content
            const offsetX = padding + (canvas.width - 2 * padding - bounds.width * scale) / 2;
            const offsetY = padding + (canvas.height - 2 * padding - bounds.height * scale) / 2;

            // Draw simplified representation of nodes
            ctx.fillStyle = 'rgba(100, 150, 200, 0.6)';
            ctx.strokeStyle = 'rgba(100, 150, 200, 0.8)';
            ctx.lineWidth = 1;

            // Get all node-like elements from the SVG
            const nodes = g.selectAll('rect, circle, ellipse, polygon').nodes();
            nodes.forEach(node => {
                try {
                    const bbox = node.getBBox();
                    if (bbox.width > 5 && bbox.height > 5) {
                        const x = offsetX + (bbox.x - bounds.x) * scale;
                        const y = offsetY + (bbox.y - bounds.y) * scale;
                        const w = bbox.width * scale;
                        const h = bbox.height * scale;

                        if (w > 1 && h > 1) {
                            ctx.fillRect(x, y, Math.max(w, 2), Math.max(h, 2));
                            ctx.strokeRect(x, y, Math.max(w, 2), Math.max(h, 2));
                        }
                    }
                } catch (e) {
                    // Skip elements that can't provide bbox
                }
            });

            // Draw edges/lines
            ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
            ctx.lineWidth = 0.5;
            const paths = g.selectAll('path, line').nodes();
            paths.forEach(path => {
                try {
                    const bbox = path.getBBox();
                    if (bbox.width > 0 || bbox.height > 0) {
                        const x1 = offsetX + (bbox.x - bounds.x) * scale;
                        const y1 = offsetY + (bbox.y - bounds.y) * scale;
                        const x2 = x1 + bbox.width * scale;
                        const y2 = y1 + bbox.height * scale;

                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                } catch (e) {
                    // Skip elements that can't provide bbox
                }
            });

            // Update viewport indicator
            updateMinimapViewport(canvas, viewport, bounds, scale, offsetX, offsetY, container);
        }

        function updateMinimapCytoscape(canvas, viewport, container) {
            if (!cy) return;

            const containerRect = container.getBoundingClientRect();
            canvas.width = containerRect.width;
            canvas.height = containerRect.height - 22;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get the bounding box of all elements
            const bb = cy.elements().boundingBox();
            if (bb.w === 0 || bb.h === 0) return;

            const padding = 10;
            const scaleX = (canvas.width - 2 * padding) / bb.w;
            const scaleY = (canvas.height - 2 * padding) / bb.h;
            const scale = Math.min(scaleX, scaleY);

            const offsetX = padding + (canvas.width - 2 * padding - bb.w * scale) / 2;
            const offsetY = padding + (canvas.height - 2 * padding - bb.h * scale) / 2;

            // Draw nodes
            ctx.fillStyle = 'rgba(100, 150, 200, 0.6)';
            cy.nodes().forEach(node => {
                const pos = node.position();
                const w = node.width() * scale;
                const h = node.height() * scale;
                const x = offsetX + (pos.x - bb.x1 - node.width() / 2) * scale;
                const y = offsetY + (pos.y - bb.y1 - node.height() / 2) * scale;

                ctx.fillRect(x, y, Math.max(w, 2), Math.max(h, 2));
            });

            // Draw edges
            ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
            ctx.lineWidth = 0.5;
            cy.edges().forEach(edge => {
                const source = edge.source().position();
                const target = edge.target().position();
                const x1 = offsetX + (source.x - bb.x1) * scale;
                const y1 = offsetY + (source.y - bb.y1) * scale;
                const x2 = offsetX + (target.x - bb.x1) * scale;
                const y2 = offsetY + (target.y - bb.y1) * scale;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            });

            // Update viewport for Cytoscape
            const cyExtent = cy.extent();
            const cyZoom = cy.zoom();
            const cyPan = cy.pan();

            const viewWidth = (cyExtent.x2 - cyExtent.x1) * scale;
            const viewHeight = (cyExtent.y2 - cyExtent.y1) * scale;
            const viewX = offsetX + (cyExtent.x1 - bb.x1) * scale;
            const viewY = offsetY + (cyExtent.y1 - bb.y1) * scale;

            viewport.style.left = (viewX + container.offsetLeft) + 'px';
            viewport.style.top = (viewY + 22) + 'px'; // 22px for header
            viewport.style.width = Math.max(viewWidth, 10) + 'px';
            viewport.style.height = Math.max(viewHeight, 10) + 'px';
            viewport.style.display = 'block';
        }

        function updateMinimapViewport(canvas, viewport, bounds, scale, offsetX, offsetY, container) {
            if (!svg || !zoom) return;

            try {
                const transform = d3.zoomTransform(svg.node());
                const svgWidth = +svg.attr('width');
                const svgHeight = +svg.attr('height');

                // Calculate what part of the content is visible
                const visibleX = -transform.x / transform.k;
                const visibleY = -transform.y / transform.k;
                const visibleWidth = svgWidth / transform.k;
                const visibleHeight = svgHeight / transform.k;

                // Convert to minimap coordinates
                const vpX = offsetX + (visibleX - bounds.x) * scale;
                const vpY = offsetY + (visibleY - bounds.y) * scale;
                const vpWidth = visibleWidth * scale;
                const vpHeight = visibleHeight * scale;

                // Position the viewport indicator
                viewport.style.left = Math.max(0, vpX) + 'px';
                viewport.style.top = (Math.max(0, vpY) + 22) + 'px'; // 22px for header
                viewport.style.width = Math.min(vpWidth, canvas.width) + 'px';
                viewport.style.height = Math.min(vpHeight, canvas.height) + 'px';
                viewport.style.display = 'block';
            } catch (e) {
                viewport.style.display = 'none';
            }
        }

        // Initialize minimap on load
        document.addEventListener('DOMContentLoaded', initMinimap);
        // ============== END MINIMAP ==============

        function prepareDataForView(data, view) {
            if (!data) {
                return data;
            }

            // Transform generic elements and relationships into view-specific data structures
            const elements = data.elements || [];
            const relationships = data.relationships || [];

            // Helper function to recursively collect all elements with parent tracking
            function collectAllElements(elementList, collected = [], parentElement = null) {
                elementList.forEach(el => {
                    // Add parent reference if not already set (just the name, not the object to avoid circular refs)
                    if (parentElement && !el.parent) {
                        el.parent = parentElement.name;
                    }
                    collected.push(el);
                    if (el.children && el.children.length > 0) {
                        collectAllElements(el.children, collected, el);
                    }
                });
                return collected;
            }

            // Helper function to remove circular references before JSON serialization
            function removeCircularRefs(obj) {
                if (!obj || typeof obj !== 'object') return obj;

                // Remove parentElement property that creates circular references
                if (obj.parentElement) {
                    delete obj.parentElement;
                }

                // Recursively clean children
                if (obj.children && Array.isArray(obj.children)) {
                    obj.children.forEach(child => removeCircularRefs(child));
                }

                return obj;
            }

            const allElements = collectAllElements(elements);

            // Transform based on view type
            switch (view) {
                case 'ibd':
                    // Internal Block Diagram View needs parts, ports, and connectors

                    // For IBD, we need to find parts that are INSIDE other parts
                    // These are the internal parts that form the internal block diagram
                    const ibdParts = [];
                    const seenParts = new Set(); // Prevent duplicates

                    // Helper to recursively extract nested parts
                    const extractNestedParts = (element, parentPath = '') => {
                        if (!element || !element.children) return;

                        element.children.forEach(child => {
                            if (!child || !child.type) return;
                            const childTypeLower = child.type.toLowerCase();

                            // Is this a part (usage or nested)?
                            if ((childTypeLower === 'part' || childTypeLower === 'part usage' ||
                                (childTypeLower.includes('part') && !childTypeLower.includes('def'))) &&
                                !seenParts.has(child.name)) {

                                const qualifiedName = parentPath ? parentPath + '.' + child.name : child.name;
                                ibdParts.push({
                                    ...child,
                                    containerId: element.name,
                                    containerType: element.type,
                                    qualifiedName: qualifiedName
                                });
                                seenParts.add(child.name);

                                // Recurse into this part to find deeper nested parts
                                extractNestedParts(child, qualifiedName);
                            }
                        });
                    };

                    // Strategy 1: Find top-level part usages
                    allElements.forEach(el => {
                        if (!el.type) return;
                        const typeLower = el.type.toLowerCase();

                        // Look for part usages
                        if ((typeLower === 'part' || typeLower === 'part usage' ||
                            (typeLower.includes('part') && !typeLower.includes('def'))) &&
                            !seenParts.has(el.name)) {
                            ibdParts.push({
                                ...el,
                                qualifiedName: el.name
                            });
                            seenParts.add(el.name);

                            // Also extract nested parts from this part usage
                            extractNestedParts(el, el.name);
                        }
                    });

                    // Strategy 2: Look inside part definitions for their children
                    const partDefs = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        return typeLower === 'part def' || typeLower === 'part definition';
                    });

                    partDefs.forEach(partDef => {
                        extractNestedParts(partDef, '');
                    });

                    // Extract ports and link to parent parts
                    const ibdPorts = [];
                    const processPortsFromPart = (part, partId) => {
                        // Check if part has port children
                        if (part.children) {
                            part.children.forEach(child => {
                                if (child.type && child.type.toLowerCase().includes('port')) {
                                    ibdPorts.push({
                                        ...child,
                                        id: child.id || child.name,
                                        parentId: partId,
                                        direction: child.direction ||
                                            (child.type.toLowerCase().includes('in') ? 'in' :
                                             child.type.toLowerCase().includes('out') ? 'out' : 'inout')
                                    });
                                }
                            });
                        }
                    };

                    // Process ports for each part
                    ibdParts.forEach(part => {
                        const partId = part.id || part.name;
                        processPortsFromPart(part, partId);
                    });

                    // Also check root elements for standalone ports
                    allElements.forEach(el => {
                        if (el.type && el.type.toLowerCase().includes('port')) {
                            // Find which part this port belongs to by checking parent hierarchy
                            const existingPort = ibdPorts.find(p => p.name === el.name);
                            if (!existingPort) {
                                ibdPorts.push({
                                    ...el,
                                    id: el.id || el.name,
                                    parentId: el.parentId || 'root',
                                    direction: el.direction || 'inout'
                                });
                            }
                        }
                    });

                    // Build connectors from multiple sources:
                    // 1. Explicit connection/flow/interface/binding relationships
                    // 2. Part typing relationships (part usage -> part def)
                    // 3. Attribute/property relationships
                    const ibdConnectors = [];

                    // 1. Explicit connections, flows, interfaces, and bindings
                    const explicitConnectors = relationships.filter(rel => rel.type && (
                        rel.type.includes('connection') ||
                        rel.type.includes('flow') ||
                        rel.type.includes('binding') ||
                        rel.type.includes('interface') ||
                        rel.type.includes('allocation') ||
                        rel.type.includes('dependency')
                    ));

                    explicitConnectors.forEach(rel => {
                        ibdConnectors.push({
                            ...rel,
                            sourceId: rel.source,
                            targetId: rel.target
                        });
                    });

                    // 2. Create connectors from part typing relationships
                    // When a part has a typing attribute, show connection to that type
                    ibdParts.forEach(part => {
                        if (part.typing && part.typing !== part.name) {
                            // Find the typed element
                            const typedElement = allElements.find(el =>
                                el.name === part.typing || el.id === part.typing
                            );

                            if (typedElement) {
                                ibdConnectors.push({
                                    source: part.name,
                                    target: typedElement.name,
                                    sourceId: part.name,
                                    targetId: typedElement.name,
                                    type: 'typing',
                                    name: 'type'
                                });
                            }
                        }
                    });

                    // 3. Look for attribute/property relationships
                    relationships
                        .filter(rel => rel.type && (
                            rel.type.includes('attribute') ||
                            rel.type.includes('property') ||
                            rel.type.includes('reference')
                        ))
                        .forEach(rel => {
                            // Only include if both source and target are in ibdParts
                            const sourceInParts = ibdParts.some(p => p.name === rel.source || p.id === rel.source);
                            const targetInParts = ibdParts.some(p => p.name === rel.target || p.id === rel.target);

                            if (sourceInParts && targetInParts) {
                                ibdConnectors.push({
                                    ...rel,
                                    sourceId: rel.source,
                                    targetId: rel.target
                                });
                            }
                        });

                    // IBD Focus Strategy: Find the most relevant "container" part to show
                    // IBD Focus Strategy: Show ONE container part with its direct children + attributes
                    let focusPart = null;
                    let focusedParts = ibdParts;

                    // Find part definitions OR part usages with children that are parts
                    // This handles both part defs and part usages like "part vehicle_b : Vehicle { ... }"
                    const partsWithChildren = allElements.filter(el => {
                        if (!el.type || !el.children || el.children.length === 0) return false;
                        const typeLower = el.type.toLowerCase();
                        const isPartDef = typeLower.includes('part def');
                        const isPartUsage = (typeLower === 'part' || typeLower === 'part usage' ||
                            (typeLower.includes('part') && !typeLower.includes('def')));
                        if (!isPartDef && !isPartUsage) return false;
                        // Must have part children
                        return el.children.some(c => c.type && c.type.toLowerCase().includes('part'));
                    });

                    if (partsWithChildren.length > 0) {
                        // Show ALL parts with children, not just the one with the most
                        // Sort by number of part children (descending) for consistent ordering
                        partsWithChildren.sort((a, b) => {
                            const aPartCount = a.children.filter(c => c.type && c.type.toLowerCase().includes('part')).length;
                            const bPartCount = b.children.filter(c => c.type && c.type.toLowerCase().includes('part')).length;
                            return bPartCount - aPartCount;
                        });

                        // Process each part with children as a focus part
                        focusedParts = [];
                        const processedPartNames = new Set();

                        for (const currentFocusPart of partsWithChildren) {
                            if (processedPartNames.has(currentFocusPart.name)) continue;
                            processedPartNames.add(currentFocusPart.name);

                            focusPart = currentFocusPart; // Track for connector extraction
                            const partChildren = currentFocusPart.children.filter(c => c.type && c.type.toLowerCase().includes('part'));

                            // Add the focus part itself with ALL its children (including attributes)
                            focusedParts.push({
                                name: currentFocusPart.name,
                                type: currentFocusPart.type,
                                id: currentFocusPart.id || currentFocusPart.name,
                                attributes: currentFocusPart.attributes || {},
                                children: currentFocusPart.children || []
                            });

                            // Add direct part children of this focus part
                            for (const child of partChildren) {
                                if (processedPartNames.has(child.name)) continue;
                                processedPartNames.add(child.name);

                                // Find enriched version in ibdParts or use child directly
                                let enrichedChild = ibdParts.find(p => p.name === child.name);
                                if (!enrichedChild) {
                                    enrichedChild = { ...child, qualifiedName: child.name };
                                }

                                // Enrich with part definition children if available
                                try {
                                    if (enrichedChild && enrichedChild.name) {
                                        const partDef = allElements.find(el =>
                                            el && el.type && el.name &&
                                            el.type.toLowerCase().includes('part def') &&
                                            el.name === (enrichedChild.typing || child.typing)
                                        );
                                        if (partDef && partDef.children) {
                                            enrichedChild = { ...enrichedChild, children: partDef.children };
                                        }
                                    }
                                } catch (error) {
                                    // Skip enrichment on error
                                }

                                focusedParts.push(enrichedChild);

                                // Create composition connector from container to child
                                ibdConnectors.push({
                                    source: currentFocusPart.name,
                                    target: child.name,
                                    sourceId: currentFocusPart.name,
                                    targetId: child.name,
                                    type: 'composition',
                                    name: 'contains'
                                });
                            }

                            // Extract connection/bind children from this focus part and add as connectors
                            if (currentFocusPart.children) {
                                currentFocusPart.children.forEach(child => {
                                    if (!child || !child.type) return;
                                    const childType = child.type.toLowerCase();
                                    if (childType === 'connection' || childType === 'connect' || childType === 'bind' || childType === 'binding') {
                                        const from = child.attributes?.get?.('from') || child.attributes?.from;
                                        const to = child.attributes?.get?.('to') || child.attributes?.to;
                                        if (from && to) {
                                            ibdConnectors.push({
                                                source: from,
                                                target: to,
                                                sourceId: from,
                                                targetId: to,
                                                type: childType === 'bind' || childType === 'binding' ? 'binding' : 'connection',
                                                name: child.name || childType
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }

                    return {
                        ...data,
                        elements: focusedParts,  // For buildIbdViewModel
                        parts: focusedParts,     // For renderIbdView
                        ports: ibdPorts,
                        connectors: ibdConnectors
                    };

                case 'activity':
                    // Activity Diagram View - use pre-extracted activity diagrams if available

                    if (data.activityDiagrams && data.activityDiagrams.length > 0) {
                        // Use pre-extracted activity diagrams from parser
                        return {
                            ...data,
                            diagrams: data.activityDiagrams.map(diagram => {
                                // Merge decisions into actions as decision nodes
                                const decisionsAsActions = (diagram.decisions || []).map(d => ({
                                    ...d,
                                    id: d.id || d.name,
                                    type: 'decision',
                                    kind: 'decision'
                                }));

                                const allActions = [
                                    ...(diagram.actions || []).map(a => ({
                                        ...a,
                                        id: a.id || a.name
                                    })),
                                    ...decisionsAsActions
                                ];

                                return {
                                    name: diagram.name,
                                    actions: allActions,
                                    flows: diagram.flows || [],
                                    decisions: diagram.decisions || [],
                                    states: diagram.states || []
                                };
                            })
                        };
                    }

                    // Fallback: Create activity diagrams from action elements
                    const actionDefs = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        return typeLower === 'action' || typeLower === 'action def' || typeLower === 'action definition';
                    });

                    // Filter to only actions with children (activity content)
                    const activityActionDefs = actionDefs.filter(a => a.children && a.children.length > 0);

                    return {
                        ...data,
                        diagrams: activityActionDefs.map(actionDef => {
                            // Extract child actions
                            const childActions = actionDef.children
                                .filter(c => c.type && c.type.toLowerCase().includes('action'))
                                .map(c => ({
                                    name: c.name,
                                    type: 'action',
                                    kind: 'action',
                                    id: c.name
                                }));

                            // Create flows from sequential actions
                            const flows = [];
                            for (let i = 0; i < childActions.length - 1; i++) {
                                flows.push({
                                    from: childActions[i].name,
                                    to: childActions[i + 1].name
                                });
                            }

                            // Add start/done nodes
                            if (childActions.length > 0) {
                                flows.unshift({ from: 'start', to: childActions[0].name });
                                flows.push({ from: childActions[childActions.length - 1].name, to: 'done' });
                                childActions.unshift({ name: 'start', type: 'initial', kind: 'initial', id: 'start' });
                                childActions.push({ name: 'done', type: 'final', kind: 'final', id: 'done' });
                            }

                            return {
                                name: actionDef.name,
                                actions: childActions,
                                flows: flows,
                                decisions: [],
                                states: []
                            };
                        })
                    };

                case 'state':
                    // State Machine View needs states and transitions
                    const stateElements = allElements.filter(el => el.type && (
                        el.type.includes('state') ||
                        el.type.includes('State')
                    ));
                    return {
                        ...data,
                        states: stateElements,
                        transitions: relationships.filter(rel =>
                            rel.type && rel.type.includes('transition')
                        )
                    };

                case 'sequence':
                    // Sequence Diagram View needs sequence diagrams
                    return {
                        ...data,
                        sequenceDiagrams: data.sequenceDiagrams || []
                    };

                case 'usecase':
                    // Use Case View needs actors and use cases
                    // Only get actor DEFINITIONS (type='actor def'), not usages (type='actor usage')

                    const allActors = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        // Only include actor definitions (actor def), not actor usages
                        return typeLower === 'actor def' || typeLower === 'actor definition';
                    });

                    // Deduplicate actors by name (case-insensitive)
                    const actorsByName = new Map();
                    allActors.forEach(actor => {
                        const lowerName = actor.name.toLowerCase();
                        if (!actorsByName.has(lowerName)) {
                            actorsByName.set(lowerName, actor);
                        }
                    });

                    const actors = Array.from(actorsByName.values());

                    // Filter use cases - prefer definitions over usages to avoid duplicates
                    const allUseCases = allElements.filter(el => el.type && (
                        el.type.includes('use case') ||
                        el.type.includes('usecase') ||
                        el.type.includes('UseCase')
                    ));

                    // Group use cases by name (case-insensitive) and prefer definitions
                    const useCasesByName = new Map();
                    allUseCases.forEach(uc => {
                        const lowerName = uc.name.toLowerCase();
                        const existing = useCasesByName.get(lowerName);
                        const isDefinition = uc.type.toLowerCase().includes('def');

                        if (!existing) {
                            useCasesByName.set(lowerName, uc);
                        } else {
                            // Prefer definition over usage
                            const existingIsDefinition = existing.type.toLowerCase().includes('def');
                            if (isDefinition && !existingIsDefinition) {
                                useCasesByName.set(lowerName, uc);
                            }
                        }
                    });

                    const useCases = Array.from(useCasesByName.values());

                    // Build a map of actor types to actor names for lookup
                    const actorTypeToName = new Map();
                    actors.forEach(actor => {
                        actorTypeToName.set(actor.name, actor.name);
                    });

                    // Helper function to extract objective text from use case
                    function getObjectiveText(useCase) {
                        if (!useCase.children) return '';
                        for (const child of useCase.children) {
                            if (child.type === 'objective') {
                                // Look for doc content in objective's children
                                if (child.children) {
                                    for (const docChild of child.children) {
                                        if (docChild.type === 'doc' && docChild.name && docChild.name !== 'unnamed') {
                                            return docChild.name;
                                        }
                                    }
                                }
                                // If no doc child, return objective name if meaningful
                                if (child.name && child.name !== 'unnamed') {
                                    return child.name;
                                }
                            }
                        }
                        return '';
                    }

                    // Build relationships from subjects/actors inside use cases
                    const useCaseRelationships = [];
                    useCases.forEach(useCase => {
                        const objectiveText = getObjectiveText(useCase);

                        // Check children for subject or actor usages
                        if (useCase.children) {
                            useCase.children.forEach(child => {
                                const childType = child.type ? child.type.toLowerCase() : '';
                                const isActorUsage = childType === 'actor usage' || childType === 'actor';

                                // Only create relationships for actors, not subjects
                                // Subjects represent the system being described, not external actors
                                if (isActorUsage) {
                                    // The typing attribute gives us the actor type
                                    const actorType = child.typing || child.name;
                                    // Find matching actor definition or create relationship anyway
                                    useCaseRelationships.push({
                                        source: actorType,
                                        target: useCase.name,
                                        type: 'association',
                                        label: objectiveText
                                    });
                                }
                            });
                        }
                    });

                    // If no explicit actor-to-use-case relationships were found,
                    // create inferred relationships from actors to all use cases in the same scope
                    // This handles models where actors and use cases are siblings
                    if (useCaseRelationships.length === 0 && actors.length > 0 && useCases.length > 0) {
                        // Find the primary actor (usually the human actor)
                        // Use the first actor as the primary by default
                        const primaryActor = actors[0];

                        useCases.forEach(useCase => {
                            const objectiveText = getObjectiveText(useCase);
                            useCaseRelationships.push({
                                source: primaryActor.name,
                                target: useCase.name,
                                type: 'association',
                                label: objectiveText
                            });
                        });
                    }

                    // Find actions that specialize (implement) use cases
                    const useCaseNames = new Set(useCases.map(uc => uc.name));

                    // Find all action elements
                    const allActions = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        return typeLower === 'action' || typeLower.includes('action');
                    });

                    const relatedActions = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        if (typeLower !== 'action' && !typeLower.includes('action')) return false;

                        // Check if this action specializes a use case
                        const specialization = el.attributes?.get?.('specialization') ||
                            (el.attributes instanceof Map ? el.attributes.get('specialization') : el.attributes?.specialization);
                        if (specialization) {
                            // Clean up specialization string (remove :> prefix and quotes if present)
                            // Note: Double-escaped for template literal
                            let specName = specialization.replace(/^:>\s*/, '').trim();
                            // Remove surrounding quotes if present
                            if ((specName.startsWith("'") && specName.endsWith("'")) ||
                                (specName.startsWith('"') && specName.endsWith('"'))) {
                                specName = specName.slice(1, -1);
                            }
                            return useCaseNames.has(specName);
                        }
                        return false;
                    });

                    // Collect all child actions from related actions (nested actions)
                    const collectChildActions = (actions) => {
                        const childActions = [];
                        const collectRecursive = (elements, parentAction) => {
                            for (const el of elements) {
                                if (el.type) {
                                    const typeLower = el.type.toLowerCase();
                                    if (typeLower === 'action' || typeLower.includes('action')) {
                                        el.parentAction = parentAction;
                                        childActions.push(el);
                                        // Recursively collect nested actions
                                        if (el.children && el.children.length > 0) {
                                            collectRecursive(el.children, el.name);
                                        }
                                    }
                                }
                            }
                        };
                        for (const action of actions) {
                            if (action.children && action.children.length > 0) {
                                collectRecursive(action.children, action.name);
                            }
                        }
                        return childActions;
                    };

                    const nestedActions = collectChildActions(relatedActions);

                    // Create relationships from use cases to their implementing actions
                    relatedActions.forEach(action => {
                        const specialization = action.attributes?.get?.('specialization') ||
                            (action.attributes instanceof Map ? action.attributes.get('specialization') : action.attributes?.specialization);
                        if (specialization) {
                            // Note: Double-escaped for template literal
                            let specName = specialization.replace(/^:>\s*/, '').trim();
                            // Remove surrounding quotes if present
                            if ((specName.startsWith("'") && specName.endsWith("'")) ||
                                (specName.startsWith('"') && specName.endsWith('"'))) {
                                specName = specName.slice(1, -1);
                            }
                            useCaseRelationships.push({
                                source: specName,
                                target: action.name,
                                type: 'realize',
                                label: ''
                            });

                            // Also create relationships from the main action to its child actions
                            const directChildren = nestedActions.filter(na => na.parentAction === action.name);
                            directChildren.forEach(child => {
                                useCaseRelationships.push({
                                    source: action.name,
                                    target: child.name,
                                    type: 'include',
                                    label: ''
                                });
                            });
                        }
                    });

                    // Create relationships for nested actions (child-to-grandchild)
                    nestedActions.forEach(action => {
                        const children = nestedActions.filter(na => na.parentAction === action.name);
                        children.forEach(child => {
                            useCaseRelationships.push({
                                source: action.name,
                                target: child.name,
                                type: 'include',
                                label: ''
                            });
                        });
                    });

                    // Add nested actions to the relatedActions array
                    relatedActions.push(...nestedActions);

                    // Also add the actor usages to the actors list if they reference undefined actors
                    // This ensures we show all actors even if they're only defined as usages
                    const actorUsages = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        return typeLower === 'actor usage';
                    });

                    // Add unique actor usages that don't have matching definitions
                    // Use case-insensitive comparison for deduplication
                    const seenActorNames = new Set(actors.map(a => a.name.toLowerCase()));
                    actorUsages.forEach(usage => {
                        const actorType = usage.typing || usage.name;
                        const actorTypeLower = actorType.toLowerCase();
                        if (!seenActorNames.has(actorTypeLower)) {
                            // Create a synthetic actor from the usage
                            actors.push({
                                name: actorType,
                                type: 'actor def',
                                children: [],
                                attributes: new Map(),
                                relationships: []
                            });
                            seenActorNames.add(actorTypeLower);
                            actorTypeToName.set(actorType, actorType);
                        }
                    });

                    // Also add actors from relationships that aren't in the actors list yet
                    // This handles cases where actors are defined as usages inside use cases
                    // Only add from 'association' relationships (not 'realize' or 'subject')
                    useCaseRelationships.forEach(rel => {
                        const relSourceLower = rel.source.toLowerCase();
                        if (rel.type === 'association' && !seenActorNames.has(relSourceLower)) {
                            actors.push({
                                name: rel.source,
                                type: 'actor def',
                                children: [],
                                attributes: new Map(),
                                relationships: []
                            });
                            seenActorNames.add(relSourceLower);
                            actorTypeToName.set(rel.source, rel.source);
                        }
                    });

                    // Find requirements and their stakeholder relationships
                    const requirements = allElements.filter(el => {
                        if (!el.type) return false;
                        const typeLower = el.type.toLowerCase();
                        return typeLower.includes('requirement');
                    });

                    // Build requirement-to-stakeholder relationships
                    const requirementRelationships = [];
                    requirements.forEach(req => {
                        if (!req.children) return;

                        req.children.forEach(child => {
                            const childType = (child.type || '').toLowerCase().trim();
                            if (childType === 'stakeholder') {
                                // The typing gives us the stakeholder type (which is like an actor)
                                const stakeholderType = child.typing || child.name;
                                const stakeholderTypeLower = stakeholderType.toLowerCase();

                                // Create relationship from requirement to stakeholder
                                requirementRelationships.push({
                                    source: req.name,
                                    target: stakeholderType,
                                    type: 'stakeholder',
                                    label: ''
                                });

                                // Add stakeholder as an actor if not already present
                                if (!seenActorNames.has(stakeholderTypeLower)) {
                                    actors.push({
                                        name: stakeholderType,
                                        type: 'actor def',
                                        children: [],
                                        attributes: new Map(),
                                        relationships: [],
                                        isStakeholder: true
                                    });
                                    seenActorNames.add(stakeholderTypeLower);
                                    actorTypeToName.set(stakeholderType, stakeholderType);
                                }
                            }
                        });
                    });

                    // Merge requirement relationships into useCaseRelationships
                    useCaseRelationships.push(...requirementRelationships);

                    return {
                        ...data,
                        actors: actors,
                        useCases: useCases,
                        actions: relatedActions,
                        requirements: requirements,
                        relationships: useCaseRelationships
                    };

                case 'package':
                    // Package View needs packages as nodes with element counts
                    const packageNodes = allElements.filter(el => el.type && (
                        el.type.toLowerCase() === 'package' ||
                        el.type.toLowerCase().includes('package')
                    ));

                    // Enrich package nodes with element counts and child info
                    const enrichedPackages = packageNodes.map(pkg => {
                        const childCount = pkg.children ? pkg.children.length : 0;
                        const childPackages = (pkg.children || []).filter(c =>
                            c.type && c.type.toLowerCase().includes('package')
                        );

                        return {
                            ...pkg,
                            id: pkg.id || pkg.name,
                            elementCount: childCount,
                            childPackageIds: childPackages.map(c => c.id || c.name)
                        };
                    });

                    return {
                        ...data,
                        nodes: enrichedPackages,
                        dependencies: [] // Import/use relationships not yet extracted
                    };

                default:
                    // For other views (elk, graph, tree, hierarchy, sysml), keep original data
                    return data;
            }
        }

        function cloneElements(elements) {
            if (!elements) {
                return [];
            }
            try {
                return JSON.parse(JSON.stringify(elements));
            } catch (error) {
                console.warn('Failed to clone elements, falling back to reference copy', error);
                return elements;
            }
        }

        function normalizeAttributes(attributes) {
            const properties = {};
            if (!attributes) {
                return properties;
            }

            if (typeof attributes.forEach === 'function') {
                attributes.forEach((value, key) => {
                    properties[key] = value;
                });
            } else {
                Object.assign(properties, attributes);
            }
            return properties;
        }

        function getElementProperties(element) {
            if (element.properties) {
                return element.properties;
            }
            return normalizeAttributes(element.attributes);
        }

        function formatStereotype(type) {
            if (!type) {
                return '';
            }
            return '<<' + String(type).trim() + '>>';
        }

        function normalizeTypeForDisplay(type) {
            if (!type) {
                return '';
            }
            const normalized = String(type).trim().toLowerCase();
            if (!normalized) {
                return '';
            }

            const suffixReplacements = [' def', ' definition'];
            for (const suffix of suffixReplacements) {
                if (normalized.endsWith(suffix)) {
                    const stripped = normalized.slice(0, -suffix.length).trim();
                    if (stripped.length > 0) {
                        return stripped;
                    }
                }
            }

            return normalized;
        }

        function buildElementDisplayLabel(element) {
            if (!element) {
                return '';
            }
            const normalizedType = normalizeTypeForDisplay(element.type);
            const stereotype = normalizedType ? formatStereotype(normalizedType) : '';
            const displayName = element.name || 'Unnamed';
            return stereotype ? stereotype + ' ' + displayName : displayName;
        }

        /**
         * Build an enhanced label that includes attributes and ports for Pillar View
         */
        function buildEnhancedElementLabel(element) {
            if (!element) {
                return '';
            }

            const baseLabel = buildElementDisplayLabel(element);
            const lines = [baseLabel];

            // Collect attributes and ports from children
            if (element.children && element.children.length > 0) {
                const attributes = [];
                const ports = [];

                element.children.forEach(child => {
                    if (!child || !child.type) return;
                    const typeLower = child.type.toLowerCase();

                    if (typeLower === 'attribute' || typeLower.includes('attribute')) {
                        const attrName = child.name || 'unnamed';
                        const attrType = child.typing || '';
                        attributes.push(attrType ? attrName + ': ' + attrType : attrName);
                    } else if (typeLower.includes('port')) {
                        const portName = child.name || 'unnamed';
                        const portType = child.typing || '';
                        const direction = typeLower.includes('in') ? '→' : typeLower.includes('out') ? '←' : '↔';
                        ports.push(direction + ' ' + portName + (portType ? ': ' + portType : ''));
                    }
                });

                // Add attribute summary (limit to first 3)
                if (attributes.length > 0) {
                    const shown = attributes.slice(0, 3);
                    lines.push('');
                    lines.push('Attributes:');
                    shown.forEach(a => lines.push('  • ' + a));
                    if (attributes.length > 3) {
                        lines.push('  +' + (attributes.length - 3) + ' more');
                    }
                }

                // Add port summary (limit to first 3)
                if (ports.length > 0) {
                    lines.push('');
                    lines.push('Ports:');
                    const shown = ports.slice(0, 3);
                    shown.forEach(p => lines.push('  ' + p));
                    if (ports.length > 3) {
                        lines.push('  +' + (ports.length - 3) + ' more');
                    }
                }
            }

            return lines.join('\\n');
        }

        /**
         * Check if element has library validation information
         */
        function isLibraryValidated(element) {
            if (!element || !element.attributes) {
                return false;
            }
            const attrs = element.attributes;
            if (typeof attrs.get === 'function') {
                // Map
                return attrs.get('isStandardType') === true || attrs.get('isStandardElement') === true;
            } else {
                // Plain object
                return attrs.isStandardType === true || attrs.isStandardElement === true;
            }
        }

        /**
         * Get library specialization chain for element
         */
        function getLibraryChain(element) {
            if (!element || !element.attributes) {
                return null;
            }
            const attrs = element.attributes;
            if (typeof attrs.get === 'function') {
                return attrs.get('specializationChain');
            } else {
                return attrs.specializationChain;
            }
        }

        /**
         * Get library kind for element
         */
        function getLibraryKind(element) {
            if (!element || !element.attributes) {
                return null;
            }
            const attrs = element.attributes;
            if (typeof attrs.get === 'function') {
                return attrs.get('libraryKind');
            } else {
                return attrs.libraryKind;
            }
        }

        /**
         * Get enhanced color for element based on library validation
         */
        function getNodeColor(element) {
            // Standard library elements get a distinct green tint
            if (isLibraryValidated(element)) {
                return 'var(--vscode-charts-green)';
            }
            // Custom elements get the default blue
            return 'var(--vscode-charts-blue)';
        }

        /**
         * Get border style for element based on library validation
         */
        function getNodeBorderStyle(element) {
            // Standard library elements get a solid border
            if (isLibraryValidated(element)) {
                return '2px';
            }
            // Custom elements get a thinner border
            return '1px';
        }

        /**
         * Type colors - SysML v2 compliant color scheme (shared across all views)
         */
        const typeColors = {
            'part def': '#4EC9B0',      // Teal for definitions
            'part': '#4EC9B0',          // Teal for parts
            'port def': '#C586C0',      // Purple for port defs
            'port': '#C586C0',          // Purple for ports
            'attribute def': '#9CDCFE', // Light blue for attr defs
            'attribute': '#9CDCFE',     // Light blue for attributes
            'action def': '#DCDCAA',    // Yellow for action defs
            'action': '#DCDCAA',        // Yellow for actions
            'state def': '#CE9178',     // Orange for state defs
            'state': '#CE9178',         // Orange for states
            'interface def': '#D7BA7D', // Gold for interface defs
            'interface': '#D7BA7D',     // Gold for interfaces
            'requirement def': '#B5CEA8', // Green for req defs
            'requirement': '#B5CEA8',   // Green for requirements
            'use case def': '#569CD6',  // Blue for use case defs
            'use case': '#569CD6',      // Blue for use cases
            'verification': '#C586C0',  // Purple for verification
            'analysis': '#DCDCAA',      // Yellow for analysis
            'allocation': '#D4D4D4',    // Gray for allocations
            'item def': '#6A9955',      // Dim green for item defs
            'item': '#6A9955',          // Dim green for items
            'calc def': '#DCDCAA',      // Yellow for calc defs
            'calc': '#DCDCAA',          // Yellow for calcs
            'constraint def': '#F14C4C', // Red for constraint defs
            'constraint': '#F14C4C',    // Red for constraints
            'default': 'var(--vscode-panel-border)'
        };

        /**
         * Get color for element type - SysML v2 compliant
         */
        function getTypeColor(type) {
            const t = (type || '').toLowerCase();
            // Check for exact matches first (more specific)
            if (typeColors[t]) return typeColors[t];
            // Then check for partial matches
            for (const key in typeColors) {
                if (key !== 'default' && t.includes(key)) return typeColors[key];
            }
            return typeColors['default'];
        }

        function isActorElement(elementOrType) {
            const typeValue = typeof elementOrType === 'string'
                ? elementOrType
                : (elementOrType && elementOrType.type);
            if (!typeValue) {
                return false;
            }
            return String(typeValue).toLowerCase().includes('actor');
        }

        function renderActorGlyph(container, clickHandler, dblClickHandler) {
            const actorGroup = container.append('g')
                .attr('class', 'actor-icon')
                .attr('transform', 'translate(0,-4)');

            actorGroup.append('circle')
                .attr('cx', 0)
                .attr('cy', -6)
                .attr('r', 6)
                .style('fill', 'none')
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', 2);

            actorGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', 18)
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', 2);

            actorGroup.append('line')
                .attr('x1', -10)
                .attr('y1', 4)
                .attr('x2', 10)
                .attr('y2', 4)
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', 2);

            actorGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 18)
                .attr('x2', -10)
                .attr('y2', 32)
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', 2);

            actorGroup.append('line')
                .attr('x1', 0)
                .attr('y1', 18)
                .attr('x2', 10)
                .attr('y2', 32)
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', 2);

            if (clickHandler) {
                actorGroup.on('click', clickHandler);
            }
            if (dblClickHandler) {
                actorGroup.on('dblclick', dblClickHandler);
            }

            return actorGroup;
        }

        if (window.cytoscape && window.cytoscapeElk) {
            window.cytoscape.use(window.cytoscapeElk);
        }
        if (window.cytoscape && window.cytoscapeSvg) {
            window.cytoscape.use(window.cytoscapeSvg);
        }

        // Track manual zoom interactions to preserve user's zoom state
        window.userHasManuallyZoomed = false;

        // Global error handler to catch any JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error?.message || e.message);
        });

        // Track last rendered data to avoid unnecessary re-renders
        let lastDataHash = '';
        function quickHash(obj) {
            const str = JSON.stringify(obj);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString(16);
        }

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'update':
                    // Quick hash check - skip render if data unchanged
                    const newHash = quickHash({
                        elements: message.elements,
                        relationships: message.relationships
                    });

                    if (newHash === lastDataHash && currentData) {
                        // Data unchanged, skip expensive re-render
                        hideLoading();
                        return;
                    }
                    lastDataHash = newHash;

                    // Update loading message - parsing is done, now rendering
                    showLoading('Rendering diagram...');

                    // Reset diagram/package selector when new data arrives
                    selectedDiagramIndex = 0;

                    currentData = message;
                    filteredData = null; // Reset filter when new data arrives

                    // Use the view state from the message if provided, otherwise keep current
                    if (message.currentView) {
                        currentView = message.currentView;
                    }

                    updateActiveViewButton(currentView); // Highlight current view
                    try {
                        renderVisualization(currentView);
                    } catch (e) {
                        console.error('Error in renderVisualization:', e);
                    }
                    break;
                case 'changeView':
                    // Handle view change request from extension
                    if (message.view) {
                        changeView(message.view);
                    }
                    break;
                case 'export':
                    if (message.format === 'png') {
                        exportPNG();
                    } else if (message.format === 'svg') {
                        exportSVG();
                    }
                    break;
                case 'highlightElement':
                    highlightElementInVisualization(message.elementName);
                    break;
                case 'requestCurrentView':
                    // Send back the current view state
                    vscode.postMessage({
                        command: 'currentViewResponse',
                        view: currentView
                    });
                    break;
            }
        });

        // Update panel dimensions display
        function updateDimensionsDisplay() {
            const vizElement = document.getElementById('visualization');
            if (vizElement) {
                const width = Math.round(vizElement.clientWidth);
                const height = Math.round(vizElement.clientHeight);
                const statusText = document.getElementById('status-text');
                statusText.innerHTML = 'Panel: ' + width + ' x ' + height + 'px - Resize via VS Code panel';
                document.getElementById('status-bar').style.display = 'flex';

                // Auto-reset status text after 3 seconds (but keep bar visible for filter)
                setTimeout(() => {
                    if (statusText.innerHTML.includes('Panel:')) {
                        statusText.textContent = 'Ready • Use filter to search elements';
                    }
                }, 3000);
            }
        }

        // Resize handler - only triggers after user stops dragging
        let resizeTimeout;
        let lastRenderedWidth = 0;
        let lastRenderedHeight = 0;

        function handleResize() {
            const vizElement = document.getElementById('visualization');
            if (!vizElement) return;

            const currentWidth = vizElement.clientWidth;
            const currentHeight = vizElement.clientHeight;

            // Clear any pending resize
            clearTimeout(resizeTimeout);

            // Update dimensions display immediately during drag
            updateDimensionsDisplay();

            // If we have a Cytoscape instance and we're in sysml view, just resize it (no debounce needed)
            if (cy && currentView === 'sysml') {
                cy.resize();
                if (!window.userHasManuallyZoomed) {
                    cy.fit(cy.elements(), 50);
                }
                lastRenderedWidth = currentWidth;
                lastRenderedHeight = currentHeight;
                return;
            }

            // For all other views, wait until resize stops before re-rendering
            resizeTimeout = setTimeout(() => {
                if (currentWidth !== lastRenderedWidth || currentHeight !== lastRenderedHeight) {
                    lastRenderedWidth = currentWidth;
                    lastRenderedHeight = currentHeight;

                    if (currentData && !isRendering) {
                        renderVisualization(currentView, null, true);
                    }
                }
            }, 500);
        }

        // Add keyboard shortcut to show dimensions (Ctrl+D)
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'd') {
                event.preventDefault();
                updateDimensionsDisplay();
            }
        });

        // Use ResizeObserver for container size changes (more reliable than window resize)
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                // Use requestAnimationFrame to avoid layout thrashing
                requestAnimationFrame(() => {
                    for (let entry of entries) {
                        if (entry.target.id === 'visualization') {
                            handleResize();
                            break;
                        }
                    }
                });
            });

            // Start observing when DOM is ready
            setTimeout(() => {
                const visualizationElement = document.getElementById('visualization');
                if (visualizationElement) {
                    // Initialize lastRenderedWidth/Height to prevent spurious re-render on first observe
                    lastRenderedWidth = visualizationElement.clientWidth;
                    lastRenderedHeight = visualizationElement.clientHeight;
                    resizeObserver.observe(visualizationElement);
                }
            }, 100);
        }

        // Also listen to window resize events as a fallback
        // This catches cases where the VS Code panel is resized
        window.addEventListener('resize', () => {
            requestAnimationFrame(() => {
                handleResize();
            });
        });

        function clearVisualHighlights() {
            // Remove visual highlights without refreshing the view
            d3.selectAll('.highlighted-element').classed('highlighted-element', false);
            d3.selectAll('.selected').classed('selected', false);

            // Clear any selection styling
            d3.selectAll('.node-group').style('opacity', null);
            d3.selectAll('.graph-node-group').style('opacity', null);
            d3.selectAll('.hierarchy-cell').style('opacity', null);
            if (cy) {
                cy.elements().removeClass('highlighted-sysml');
            }
        }

        function initializeSysMLToolbar() {
            if (sysmlToolbarInitialized) {
                return;
            }
            updateSysMLModeButtons();
            const toolbar = document.getElementById('sysml-toolbar');
            if (!toolbar) {
                return;
            }

            toolbar.querySelectorAll('[data-sysml-mode]').forEach(button => {
                button.addEventListener('click', () => {
                    const nextMode = button.getAttribute('data-sysml-mode');
                    if (!nextMode || nextMode === sysmlMode) {
                        return;
                    }
                    sysmlMode = nextMode;
                    updateSysMLModeButtons();
                    if (currentView === 'sysml') {
                        // Re-render the visualization to properly switch modes
                        // This ensures all elements and edges are correctly shown/hidden
                        renderVisualization('sysml');
                    }
                });
            });

            const orientationToggle = document.getElementById('orientation-toggle');
            if (orientationToggle) {
                orientationToggle.addEventListener('click', togglePillarOrientation);
                updateOrientationButton();
            }

            const metadataCheckbox = document.getElementById('metadata-checkbox');
            if (metadataCheckbox) {
                metadataCheckbox.addEventListener('change', toggleMetadataDisplay);
                updateMetadataCheckbox();
            }

            sysmlToolbarInitialized = true;
        }

        function setSysMLToolbarVisible(isVisible) {
            const toolbar = document.getElementById('sysml-toolbar');
            if (!toolbar) {
                return;
            }
            if (isVisible) {
                toolbar.classList.add('visible');
                initializeSysMLToolbar();
            } else {
                toolbar.classList.remove('visible');
            }
        }

        function updateSysMLModeButtons() {
            document.querySelectorAll('[data-sysml-mode]').forEach(button => {
                const isActive = button.getAttribute('data-sysml-mode') === sysmlMode;
                button.classList.toggle('active', isActive);
            });

            // Show Layout button only in hierarchy mode
            const layoutButton = document.getElementById('orientation-toggle');
            if (layoutButton) {
                layoutButton.style.display = sysmlMode === 'hierarchy' ? 'inline-block' : 'none';
            }
        }

        function togglePillarOrientation() {
            pillarOrientation = pillarOrientation === 'horizontal' ? 'linear' : 'horizontal';
            updateOrientationButton();
            if (currentView === 'sysml') {
                if (pillarOrientation === 'horizontal') {
                    document.getElementById('status-text').textContent = 'SysML Pillar View • Horizontal layout';
                } else {
                    document.getElementById('status-text').textContent = 'SysML Pillar View • Linear top-down layout';
                }
                runSysMLLayout(true);
            }
        }

        function updateOrientationButton() {
            const button = document.getElementById('orientation-toggle');
            if (!button) {
                return;
            }
            const isLinear = pillarOrientation === 'linear';
            button.classList.toggle('active', isLinear);
            button.textContent = 'Layout: ' + ORIENTATION_LABELS[pillarOrientation];
            button.setAttribute('aria-pressed', isLinear ? 'true' : 'false');
            button.title = isLinear
                ? 'Switch to horizontal layout'
                : 'Switch to linear (top-down) layout';
        }

        function toggleMetadataDisplay() {
            showMetadata = !showMetadata;
            updateMetadataCheckbox();
            updateNodeLabels();
        }

        function updateMetadataCheckbox() {
            const checkbox = document.getElementById('metadata-checkbox');
            if (!checkbox) {
                return;
            }
            checkbox.checked = showMetadata;
        }

        function updateNodeLabels() {
            if (!cy) {
                return;
            }

            cy.batch(function() {
                cy.nodes('[type = "element"]').forEach(function(node) {
                    const baseLabel = node.data('baseLabel');
                    const metadata = node.data('metadata');

                    if (showMetadata && metadata) {
                        // Build SysML-style label with metadata
                        const parts = [baseLabel];

                        // Add documentation if available
                        if (metadata.documentation) {
                            const docText = String(metadata.documentation);
                            const docShort = docText.length > 50
                                ? docText.substring(0, 47) + '...'
                                : docText;
                            // Escape quotes in documentation
                            const escapedDoc = docShort.replace(/"/g, '\\"');
                            parts.push('doc: "' + escapedDoc + '"');
                        }

                        // Add key properties
                        if (metadata.properties && Object.keys(metadata.properties).length > 0) {
                            const propEntries = Object.entries(metadata.properties).slice(0, 3);
                            propEntries.forEach(function(entry) {
                                const key = entry[0];
                                const value = entry[1];
                                const valStr = String(value);
                                const shortVal = valStr.length > 20 ? valStr.substring(0, 17) + '...' : valStr;
                                parts.push(key + ': ' + shortVal);
                            });
                        }

                        node.data('label', parts.join('\\n'));
                        // Increase text-max-width and padding to accommodate more content
                        node.style({
                            'text-max-width': 300,
                            'padding': '24px',
                            'width': 'label',
                            'height': 'label',
                            'min-width': '160px',
                            'min-height': '90px',
                            'line-height': 1.6
                        });
                    } else {
                        // Show only base label
                        node.data('label', baseLabel);
                        // Reset to default size
                        node.style({
                            'text-max-width': 180,
                            'padding': '20px',
                            'width': 'label',
                            'height': 'label',
                            'min-width': '100px',
                            'min-height': '60px',
                            'line-height': 1.5
                        });
                    }
                });
            });

            // Re-run layout to accommodate new node sizes and prevent overlaps
            // Use fit=true to ensure all nodes are repositioned properly
            if (currentView === 'sysml') {
                // Force Cytoscape to recalculate and render before layout
                cy.forceRender();
                // Give Cytoscape time to recalculate node dimensions with new content
                setTimeout(() => {
                    runSysMLLayout(true);
                }, 150);
            }
        }

        function renderPillarChips(stats = lastPillarStats) {
            const container = document.getElementById('pillar-chips');
            if (!container) {
                return;
            }
            container.innerHTML = '';

            SYSML_PILLARS.forEach(pillar => {
                const chip = document.createElement('button');
                chip.className = 'pillar-chip' + (expandedPillars.has(pillar.id) ? '' : ' collapsed');
                chip.style.borderColor = PILLAR_COLOR_MAP[pillar.id];
                chip.style.color = PILLAR_COLOR_MAP[pillar.id];
                chip.dataset.pillar = pillar.id;

                const label = document.createElement('span');
                label.textContent = pillar.label;
                chip.appendChild(label);

                const badge = document.createElement('span');
                badge.className = 'count-badge';
                badge.textContent = (stats && stats[pillar.id]) ? stats[pillar.id] : 0;
                chip.appendChild(badge);

                chip.addEventListener('click', () => {
                    togglePillarExpansion(pillar.id);
                });

                container.appendChild(chip);
            });
        }

        // General View type filter state
        const GENERAL_VIEW_CATEGORIES = [
            { id: 'parts', label: 'Parts', keywords: ['part'], color: '#4EC9B0' },
            { id: 'attributes', label: 'Attributes', keywords: ['attribute', 'attr'], color: '#9CDCFE' },
            { id: 'ports', label: 'Ports', keywords: ['port'], color: '#C586C0' },
            { id: 'actions', label: 'Actions', keywords: ['action'], color: '#DCDCAA' },
            { id: 'states', label: 'States', keywords: ['state'], color: '#CE9178' },
            { id: 'requirements', label: 'Requirements', keywords: ['requirement', 'req'], color: '#B5CEA8' },
            { id: 'interfaces', label: 'Interfaces', keywords: ['interface'], color: '#D7BA7D' },
            { id: 'usecases', label: 'Use Cases', keywords: ['use case', 'usecase'], color: '#569CD6' },
            { id: 'concerns', label: 'Concerns', keywords: ['concern', 'viewpoint', 'stakeholder', 'frame'], color: '#E5C07B' },
            { id: 'items', label: 'Items', keywords: ['item'], color: '#6A9955' },
            { id: 'other', label: 'Other', keywords: [], color: '#808080' }
        ];
        const expandedGeneralCategories = new Set(GENERAL_VIEW_CATEGORIES.map(c => c.id));

        function renderGeneralChips(typeStats) {
            const container = document.getElementById('general-chips');
            if (!container) return;
            container.innerHTML = '';

            GENERAL_VIEW_CATEGORIES.forEach(cat => {
                const count = typeStats && typeStats[cat.id] ? typeStats[cat.id] : 0;
                if (count === 0 && cat.id !== 'other') return; // Skip empty categories except 'other'

                const chip = document.createElement('button');
                chip.className = 'pillar-chip' + (expandedGeneralCategories.has(cat.id) ? '' : ' collapsed');
                chip.style.borderColor = cat.color;
                chip.style.color = cat.color;
                chip.dataset.category = cat.id;

                const label = document.createElement('span');
                label.textContent = cat.label;
                chip.appendChild(label);

                const badge = document.createElement('span');
                badge.className = 'count-badge';
                badge.textContent = count;
                chip.appendChild(badge);

                chip.addEventListener('click', () => {
                    if (expandedGeneralCategories.has(cat.id)) {
                        expandedGeneralCategories.delete(cat.id);
                    } else {
                        expandedGeneralCategories.add(cat.id);
                    }
                    renderGeneralChips(typeStats);
                    // Re-render with filter applied
                    renderVisualization('elk');
                });

                container.appendChild(chip);
            });
        }

        function getCategoryForType(typeLower) {
            for (const cat of GENERAL_VIEW_CATEGORIES) {
                if (cat.keywords.some(kw => typeLower.includes(kw))) {
                    return cat.id;
                }
            }
            return 'other';
        }

        function togglePillarExpansion(pillarId) {
            if (expandedPillars.has(pillarId)) {
                expandedPillars.delete(pillarId);
            } else {
                expandedPillars.add(pillarId);
            }
            updatePillarVisibility();
            renderPillarChips(lastPillarStats);
        }

        function updatePillarVisibility() {
            if (!cy) {
                return;
            }
            cy.batch(() => {
                // In orthogonal/relationships mode, we still respect pillar expansion
                // but show relationship edges between any visible nodes
                const isOrthogonalMode = sysmlMode === 'relationships';

                // Hide/show pillar nodes based on whether they are expanded
                cy.nodes('[type = "pillar"]').forEach(node => {
                    const pillarId = node.data('pillar');
                    const show = expandedPillars.has(pillarId);
                    node.style('display', show ? 'element' : 'none');
                });

                // Hide/show element nodes based on whether their pillar is expanded
                cy.nodes('[type = "element"]').forEach(node => {
                    const show = expandedPillars.has(node.data('pillar'));
                    node.style('display', show ? 'element' : 'none');
                });

                // Membership edges removed - pillar containers are now hidden

                // Hide/show relationship and hierarchy edges based on source and target visibility
                const relationshipEdges = cy.edges('[type = "relationship"]');

                cy.edges('[type = "relationship"], [type = "hierarchy"]').forEach(edge => {
                    const sourceVisible = edge.source().style('display') !== 'none';
                    const targetVisible = edge.target().style('display') !== 'none';
                    const show = sourceVisible && targetVisible;
                    edge.style('display', show ? 'element' : 'none');
                });
            });
        }

        function getPillarForElement(element) {
            if (element && element.pillar) {
                return element.pillar;
            }
            const type = (element.type || '').toLowerCase();
            for (const pillar of SYSML_PILLARS) {
                if (pillar.keywords.some(keyword => type.includes(keyword))) {
                    return pillar.id;
                }
            }
            if (element.type && element.type.toLowerCase().includes('require')) {
                return 'requirement';
            }
            if (element.type && element.type.toLowerCase().includes('use')) {
                return 'usecases';
            }
            return 'structure';
        }

        function propagatePillarAssignments(elements, parentPillar = null) {
            if (!elements) {
                return;
            }

            elements.forEach(element => {
                if (!element) {
                    return;
                }

                const inferred = (element.type ? getPillarForElement({
                    type: element.type
                }) : 'structure');
                const effective = inferred !== 'structure'
                    ? inferred
                    : (parentPillar || inferred);

                element.pillar = effective || 'structure';

                if (element.children && element.children.length > 0) {
                    propagatePillarAssignments(element.children, element.pillar);
                }
            });
        }

        function slugify(value) {
            if (!value) {
                return 'unknown';
            }
            return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        function resolveElementIdByName(name) {
            if (!name) {
                return null;
            }
            const key = name.toLowerCase();
            const matches = sysmlElementLookup.get(key);
            if (matches && matches.length > 0) {
                return matches[0];
            }
            for (const [stored, ids] of sysmlElementLookup.entries()) {
                if (stored === key && ids.length > 0) {
                    return ids[0];
                }
            }
            return null;
        }

        function buildSysMLGraph(elements, relationships = [], useHierarchicalNesting = false) {
            sysmlElementLookup.clear();
            const cyElements = [];
            const stats = {};

            propagatePillarAssignments(elements || []);

            SYSML_PILLARS.forEach(pillar => {
                stats[pillar.id] = 0;
                cyElements.push({
                    group: 'nodes',
                    data: {
                        id: 'pillar-' + pillar.id,
                        label: pillar.label,
                        type: 'pillar',
                        pillar: pillar.id,
                        color: PILLAR_COLOR_MAP[pillar.id]
                    }
                });
            });

            // Use hierarchical nesting for hierarchy mode
            if (useHierarchicalNesting) {
                buildHierarchicalNodes(elements || [], null, cyElements, stats, null);
            } else {
                // Flatten everything for other modes
                const flattened = flattenElements(elements || [], []);
                flattened.forEach((element, index) => {
                    const pillarId = element.pillar || getPillarForElement(element);
                    stats[pillarId] = (stats[pillarId] || 0) + 1;
                    const nodeId = 'element-' + pillarId + '-' + slugify(element.name) + '-' + stats[pillarId];
                    const lookupKey = element.name ? element.name.toLowerCase() : nodeId;
                    const existing = sysmlElementLookup.get(lookupKey) || [];
                    existing.push(nodeId);
                    sysmlElementLookup.set(lookupKey, existing);
                    // Use enhanced label that shows attributes and ports
                    const baseLabel = buildEnhancedElementLabel(element);

                    // Extract metadata from element
                    const metadata = {
                        documentation: null,
                        properties: {}
                    };

                    // Get documentation from doc/comment children or the element itself
                    metadata.documentation = extractDocumentation(element);

                    // Get other properties from attributes
                    if (element.attributes) {
                        if (element.attributes instanceof Map) {
                            // Convert Map to plain object for properties
                            element.attributes.forEach(function(value, key) {
                                if (key !== 'documentation') {
                                    metadata.properties[key] = value;
                                }
                            });
                        } else if (typeof element.attributes === 'object') {
                            // Copy other properties from plain object
                            Object.entries(element.attributes).forEach(function(entry) {
                                const key = entry[0];
                                const value = entry[1];
                                if (key !== 'documentation') {
                                    metadata.properties[key] = value;
                                }
                            });
                        }
                    }

                    // Also add properties from element.properties if available
                    if (element.properties) {
                        Object.entries(element.properties).forEach(function(entry) {
                            const key = entry[0];
                            const value = entry[1];
                            if (key !== 'documentation') {
                                metadata.properties[key] = value;
                            }
                        });
                    }

                    cyElements.push({
                        group: 'nodes',
                        data: {
                            id: nodeId,
                            label: baseLabel,
                            baseLabel: baseLabel,
                            type: 'element',
                            pillar: pillarId,
                            color: PILLAR_COLOR_MAP[pillarId],
                            sysmlType: element.type,
                            elementName: element.name,
                            metadata: metadata
                        }
                    });

                    // Membership edges removed - pillar containers are now hidden
                });
            }

            // Create hierarchy edges - in hierarchy mode for visual nesting,
            // in orthogonal mode to show structural relationships
            const hierarchyLinks = createLinksFromHierarchy(elements || []);
            const hierarchyEdgeIds = new Set();

            // Build a set of valid node IDs for quick lookup
            const validNodeIds = new Set();
            cyElements.forEach(el => {
                if (el.group === 'nodes') {
                    validNodeIds.add(el.data.id);
                }
            });

            hierarchyLinks.forEach(link => {
                const sourceId = resolveElementIdByName(link.source);
                const targetId = resolveElementIdByName(link.target);

                // Only create edge if both nodes exist in the graph and are different
                if (sourceId && targetId && sourceId !== targetId &&
                    validNodeIds.has(sourceId) && validNodeIds.has(targetId)) {
                    const edgeId = 'hier-' + sourceId + '-' + targetId;
                    if (!hierarchyEdgeIds.has(edgeId)) {
                        hierarchyEdgeIds.add(edgeId);
                        cyElements.push({
                            group: 'edges',
                            data: {
                                id: edgeId,
                                source: sourceId,
                                target: targetId,
                                type: 'hierarchy',
                                label: ''
                            }
                        });
                    }
                }
            });

            const relationshipEdgeIds = new Set();
            (relationships || []).forEach(rel => {
                const sourceId = resolveElementIdByName(rel.source);
                const targetId = resolveElementIdByName(rel.target);

                // Validate that both nodes exist and are different
                if (!sourceId || !targetId || sourceId === targetId ||
                    !validNodeIds.has(sourceId) || !validNodeIds.has(targetId)) {
                    return;
                }

                const edgeId = 'rel-' + slugify(rel.type || 'rel') + '-' + slugify(rel.source) + '-' + slugify(rel.target);
                if (relationshipEdgeIds.has(edgeId)) {
                    return;
                }
                relationshipEdgeIds.add(edgeId);
                cyElements.push({
                    group: 'edges',
                    data: {
                        id: edgeId,
                        source: sourceId,
                        target: targetId,
                        type: 'relationship',
                        label: rel.type
                    }
                });
            });

            return { elements: cyElements, stats: stats };
        }

        // Helper function to get computed CSS variable values
        function getCSSVariable(varName) {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#cccccc';
        }

        function getSysMLStyles() {
            // Resolve CSS variables to actual colors
            const editorFg = getCSSVariable('--vscode-editor-foreground');
            const editorBg = getCSSVariable('--vscode-editor-background');
            const chartOrange = getCSSVariable('--vscode-charts-orange');
            const chartBlue = getCSSVariable('--vscode-charts-blue');
            const chartRed = getCSSVariable('--vscode-charts-red');
            const panelBorder = getCSSVariable('--vscode-panel-border');

            return [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'color': editorFg,
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'font-size': 12,
                        'font-weight': 600,
                        'background-color': editorBg,
                        'border-width': 2,
                        'border-color': 'rgba(255,255,255,0.08)',
                        'padding': '20px',
                        'shape': 'round-rectangle',
                        'text-wrap': 'wrap',
                        'text-max-width': 180,
                        'width': 'label',
                        'height': 'label',
                        'min-width': '100px',
                        'min-height': '60px',
                        'compound-sizing-wrt-labels': 'include',
                        'text-margin-x': '5px',
                        'text-margin-y': '5px',
                        'line-height': 1.5
                    }
                },
                {
                    selector: 'node[type = "pillar"]',
                    style: {
                        'background-color': 'transparent',
                        'color': 'transparent',
                        'font-size': 0,
                        'font-weight': 0,
                        'width': 1,
                        'height': 1,
                        'border-color': 'transparent',
                        'border-width': 0,
                        'padding': '0px',
                        'opacity': 0,
                        'visibility': 'hidden'
                    }
                },
                {
                    selector: 'node[type = "element"]',
                    style: {
                        'background-color': 'rgba(255,255,255,0.02)',
                        'border-color': 'data(color)',
                        'border-width': 2,
                        'color': editorFg,
                        'font-size': 11,
                        'text-wrap': 'wrap',
                        'text-max-width': 200,
                        'text-justification': 'left',
                        'text-halign': 'center',
                        'text-valign': 'center',
                        'padding': '18px',
                        'width': 'label',
                        'height': 'label',
                        'min-width': '120px',
                        'min-height': '60px',
                        'line-height': 1.5
                    }
                },
                {
                    selector: '$node > node',
                    style: {
                        'padding-top': '35px',
                        'padding-left': '10px',
                        'padding-bottom': '10px',
                        'padding-right': '10px',
                        'text-valign': 'top',
                        'text-halign': 'center',
                        'text-margin-y': '12px',
                        'background-color': 'rgba(255,255,255,0.01)',
                        'border-width': 2,
                        'border-style': 'dashed',
                        'border-color': 'rgba(255,255,255,0.15)',
                        'line-height': 1.5
                    }
                },
                {
                    selector: 'node:parent',
                    style: {
                        'background-opacity': 0.2,
                        'background-color': 'data(color)',
                        'border-color': 'data(color)',
                        'border-width': 2,
                        'border-style': 'solid',
                        'font-weight': 700,
                        'compound-sizing-wrt-labels': 'include',
                        'min-width': '140px',
                        'min-height': '90px',
                        'line-height': 1.5
                    }
                },
                {
                    selector: 'node.sequential-node',
                    style: {
                        'background-color': 'rgba(255, 214, 153, 0.12)',
                        'border-color': chartOrange,
                        'border-width': 3
                    }
                },
                {
                    selector: '.highlighted-sysml',
                    style: {
                        'border-color': '#FFD700',
                        'border-width': 4
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': panelBorder,
                        'target-arrow-color': panelBorder,
                        'curve-style': 'taxi',
                        'taxi-direction': 'rightward',
                        'taxi-turn': '20px',
                        'arrow-scale': 1,
                        'color': editorFg,
                        'font-size': 9,
                        'text-rotation': 'autorotate',
                        'text-margin-x': 6,
                        'text-margin-y': -8
                    }
                },
                {
                    selector: 'edge[?label]',
                    style: {
                        'label': 'data(label)'
                    }
                },
                {
                    selector: 'edge[type = "relationship"]',
                    style: {
                        'line-color': chartRed,
                        'target-arrow-color': chartRed,
                        'width': 2.5,
                        'line-style': 'solid'
                    }
                },
                {
                    selector: 'edge[type = "hierarchy"]',
                    style: {
                        'line-color': chartBlue,
                        'target-arrow-color': chartBlue,
                        'target-arrow-shape': 'triangle',
                        'line-style': 'dashed',
                        'arrow-scale': 1.2
                    }
                },

                {
                    selector: 'edge[type = "sequence-guide"]',
                    style: {
                        'line-color': 'transparent',
                        'target-arrow-color': 'transparent',
                        'opacity': 0,
                        'width': 0.5,
                        'arrow-scale': 0.1,
                        'curve-style': 'straight'
                    }
                },
                {
                    selector: 'edge[type = "sequence-order"]',
                    style: {
                        'line-color': chartOrange,
                        'target-arrow-color': chartOrange,
                        'width': 3,
                        'line-style': 'dashed',
                        'target-arrow-shape': 'triangle',
                        'arrow-scale': 1.2,
                        'curve-style': 'straight',
                        'label': ''
                    }
                }
            ];
        }

        function getVisibleElementNodes() {
            if (!cy) {
                return [];
            }
            return cy.nodes('node[type = "element"]').filter(node => node.style('display') !== 'none');
        }

        function isSequentialCandidateNode(node) {
            if (!node) {
                return false;
            }
            const type = (node.data('sysmlType') || '').toLowerCase();
            const label = (node.data('label') || '').toLowerCase();
            return type.includes('action') ||
                type.includes('behavior') ||
                type.includes('activity') ||
                type.includes('state') ||
                label.includes('step') ||
                label.includes('sequence');
        }

        function isSequentialBehaviorContext() {
            if (!cy) {
                return false;
            }
            const visibleNodes = getVisibleElementNodes();
            if (visibleNodes.length === 0) {
                return false;
            }
            const behaviorNodes = visibleNodes.filter(node => node.data('pillar') === 'behavior');
            if (behaviorNodes.length === 0) {
                return false;
            }
            const sequentialNodes = behaviorNodes.filter(isSequentialCandidateNode);
            if (sequentialNodes.length === 0) {
                return false;
            }
            const behaviorRatio = behaviorNodes.length / visibleNodes.length;
            return behaviorRatio >= 0.6 || behaviorNodes.length === visibleNodes.length;
        }

        function clearSequentialVisuals() {
            if (!cy) {
                return;
            }
            cy.batch(() => {
                cy.edges('[type = "sequence-order"]').remove();
                cy.nodes('.sequential-node').forEach(node => {
                    node.removeClass('sequential-node');
                    node.data('sequenceIndex', null);
                });
            });
        }

        function clearSequentialGuides() {
            if (!cy) {
                return;
            }
            cy.edges('[type = "sequence-guide"]').remove();
        }

        function getSequentialNodes() {
            if (!cy) {
                return [];
            }
            return getVisibleElementNodes()
                .filter(node => node.data('pillar') === 'behavior')
                .filter(isSequentialCandidateNode)
                .sort((a, b) => {
                    const orderA = typeof a.data('orderIndex') === 'number'
                        ? a.data('orderIndex')
                        : Number.MAX_SAFE_INTEGER;
                    const orderB = typeof b.data('orderIndex') === 'number'
                        ? b.data('orderIndex')
                        : Number.MAX_SAFE_INTEGER;
                    return orderA - orderB;
                });
        }

        function createSequentialGuides(nodes) {
            if (!cy || !nodes || nodes.length < 2) {
                return;
            }
            cy.batch(() => {
                for (let i = 0; i < nodes.length - 1; i++) {
                    const current = nodes[i];
                    const next = nodes[i + 1];
                    cy.add({
                        group: 'edges',
                        data: {
                            id: 'sequence-guide-' + current.id() + '-' + next.id(),
                            source: current.id(),
                            target: next.id(),
                            type: 'sequence-guide'
                        }
                    });
                }
            });
        }

        function applySequentialVisuals(nodes) {
            if (!cy || !nodes || nodes.length === 0) {
                return;
            }
            cy.batch(() => {
                nodes.forEach((node, index) => {
                    const order = index + 1;
                    // Don't modify labels with numbering - just mark as sequential
                    node.data('sequenceIndex', order);
                    node.addClass('sequential-node');

                    if (index < nodes.length - 1) {
                        const nextNode = nodes[index + 1];
                        cy.add({
                            group: 'edges',
                            data: {
                                id: 'sequence-order-' + node.id() + '-' + nextNode.id(),
                                source: node.id(),
                                target: nextNode.id(),
                                type: 'sequence-order'
                            }
                        });
                    }
                });
            });
        }

        function updateSequentialOrdering(applyVisuals, sequentialContextOverride = null) {
            if (!cy) {
                return;
            }

            const sequentialContext = typeof sequentialContextOverride === 'boolean'
                ? sequentialContextOverride
                : isSequentialBehaviorContext();

            clearSequentialVisuals();
            clearSequentialGuides();

            if (!sequentialContext) {
                return;
            }

            const sequentialNodes = getSequentialNodes();
            if (!sequentialNodes || sequentialNodes.length === 0) {
                return;
            }

            if (sequentialNodes.length >= 2) {
                createSequentialGuides(sequentialNodes);
            }

            if (applyVisuals) {
                applySequentialVisuals(sequentialNodes);
            }
        }

        function getSysMLSelectionCollection() {
            if (!cy) {
                return null;
            }

            let collection = cy.elements('.highlighted-sysml');
            if (!collection || collection.length === 0) {
                collection = cy.$(':selected');
            }

            if (!collection || collection.length === 0) {
                return null;
            }

            const neighborhood = collection.closedNeighborhood();
            return neighborhood.length > 0 ? neighborhood : collection;
        }

        function fitSysMLView(padding = 80, options = {}) {
            if (!cy) {
                return;
            }

            const { preferSelection = true } = options;
            if (preferSelection) {
                const selection = getSysMLSelectionCollection();
                if (selection && selection.length > 0) {
                    cy.fit(selection, padding);
                    return;
                }
            }

            const visibleNodes = getVisibleElementNodes();
            let collection = visibleNodes;
            if (collection.length === 0) {
                collection = cy.nodes('node[type = "pillar"]');
            } else {
                const visibleEdges = cy.edges().filter(edge => edge.style('display') !== 'none');
                collection = collection.union(visibleEdges);
            }

            if (collection.length === 0) {
                collection = cy.elements();
            }

            cy.fit(collection, padding);
        }

        function centerOnNode(node, padding = 120) {
            if (!cy || !node || node.length === 0) {
                return;
            }
            cy.animate({
                fit: {
                    eles: node,
                    padding
                }
            }, {
                duration: 500,
                easing: 'ease-in-out'
            });
        }

        function runSysMLLayout(fit = false) {
            if (!cy) {
                return;
            }

            const sequentialContext = isSequentialBehaviorContext();
            updateSequentialOrdering(false, sequentialContext);

            const wantsLinearOrientation = pillarOrientation === 'linear';
            // Use DOWN for linear/default, RIGHT only for explicit horizontal mode
            const elkDirection = pillarOrientation === 'horizontal' ? 'RIGHT' : 'DOWN';

            // Increase spacing when metadata is shown to prevent overlaps
            const spacingMultiplier = showMetadata ? 2.5 : 1.0;

            let layoutOptions;
            if (sequentialContext) {
                layoutOptions = {
                    name: 'elk',
                    nodeDimensionsIncludeLabels: true,
                    elk: {
                        algorithm: 'layered',
                        direction: 'DOWN',
                        'elk.spacing.nodeNode': String(150 * spacingMultiplier),
                        'elk.layered.spacing.nodeNodeBetweenLayers': String(180 * spacingMultiplier),
                        'elk.spacing.edgeNode': String(90 * spacingMultiplier),
                        'elk.spacing.edgeEdge': String(80 * spacingMultiplier),
                        'elk.edgeRouting': 'POLYLINE',
                        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
                        'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
                        'elk.aspectRatio': '1.2',
                        'elk.padding': '[top=100,left=100,bottom=100,right=100]'
                    },
                    fit: fit,
                    padding: 100,
                    animate: true
                };
            } else if (sysmlMode === 'hierarchy') {
                if (wantsLinearOrientation) {
                    layoutOptions = {
                        name: 'elk',
                        nodeDimensionsIncludeLabels: true,
                        elk: {
                            algorithm: 'layered',
                            direction: 'DOWN',
                            'elk.spacing.nodeNode': String(120 * spacingMultiplier),
                            'elk.layered.spacing.nodeNodeBetweenLayers': String(150 * spacingMultiplier),
                            'elk.spacing.edgeNode': String(80 * spacingMultiplier),
                            'elk.spacing.edgeEdge': String(70 * spacingMultiplier),
                            'elk.edgeRouting': 'POLYLINE',
                            'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
                            'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
                            'elk.aspectRatio': '1.0',
                            'elk.padding': '[top=100,left=100,bottom=100,right=100]',
                            'elk.layered.crossingMinimization.semiInteractive': 'true'
                        },
                        fit: fit,
                        padding: 100,
                        animate: true
                    };
                } else {
                    layoutOptions = {
                        name: 'breadthfirst',
                        directed: true,
                        padding: 100,
                        spacingFactor: 1.8 * spacingMultiplier,
                        animate: true,
                        fit: fit,
                        avoidOverlap: true,
                        nodeDimensionsIncludeLabels: true,
                        circle: false,
                        grid: false
                    };
                }
            } else {
                // Orthogonal/relationships mode - use ELK with wider spacing
                layoutOptions = {
                    name: 'elk',
                    nodeDimensionsIncludeLabels: true,
                    elk: {
                        algorithm: 'layered',
                        direction: 'DOWN',
                        'elk.spacing.nodeNode': String(160 * spacingMultiplier),
                        'elk.layered.spacing.nodeNodeBetweenLayers': String(200 * spacingMultiplier),
                        'elk.spacing.edgeNode': String(100 * spacingMultiplier),
                        'elk.spacing.edgeEdge': String(80 * spacingMultiplier),
                        'elk.edgeRouting': 'ORTHOGONAL',
                        'elk.layered.considerModelOrder.strategy': 'NONE',
                        'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
                        'elk.aspectRatio': '1.6',
                        'elk.padding': '[top=100,left=100,bottom=100,right=100]'
                    },
                    fit: fit,
                    padding: 120,
                    animate: true
                };
            }

            const layout = cy.layout(layoutOptions);
            if (sequentialContext || fit) {
                cy.one('layoutstop', () => {
                    if (sequentialContext) {
                        updateSequentialOrdering(true, true);
                        const status = document.getElementById('status-text');
                        if (status) {
                            status.textContent = 'SysML Pillar View • Sequential behaviors arranged top-down';
                        }
                    }
                    if (fit) {
                        fitSysMLView(80);
                    }
                });
            }

            layout.run();

            if (sysmlMode === 'relationships') {
                cy.edges('[type = "relationship"]').style({
                    'opacity': 1.0,
                    'width': 3,
                    'z-index': 999
                });
                // Membership edges removed - pillar containers are now hidden
                // Make hierarchy edges visible in relationships mode to show structure
                cy.edges('[type = "hierarchy"]').style({
                    'opacity': 0.6,
                    'width': 2
                });
            } else {
                cy.edges('[type = "relationship"]').style({
                    'opacity': 0.3,
                    'width': 2.5
                });
                // Membership edges removed - pillar containers are now hidden
                cy.edges('[type = "hierarchy"]').style('opacity', 1.0);
            }
        }

        function disposeSysMLView() {
            if (cy) {
                cy.destroy();
                cy = null;
            }
        }

        function renderSysMLView(width, height, data) {
            setSysMLToolbarVisible(true);
            const container = document.getElementById('visualization');
            if (!container) {
                return;
            }
            container.innerHTML = '';
            const cyContainer = document.createElement('div');
            cyContainer.id = 'sysml-cytoscape';
            // Use 100% dimensions to allow responsive resizing
            cyContainer.style.width = '100%';
            cyContainer.style.height = '100%';
            cyContainer.style.position = 'absolute';
            cyContainer.style.top = '0';
            cyContainer.style.left = '0';
            container.appendChild(cyContainer);

            const useHierarchicalNesting = sysmlMode === 'hierarchy';
            const graph = buildSysMLGraph(data.elements || [], data.relationships || [], useHierarchicalNesting);

            lastPillarStats = graph.stats;
            renderPillarChips(lastPillarStats);

            if (cy) {
                cy.destroy();
            }

            cy = cytoscape({
                container: cyContainer,
                elements: graph.elements,
                style: getSysMLStyles(),
                minZoom: MIN_SYSML_ZOOM,
                maxZoom: MAX_SYSML_ZOOM,
                wheelSensitivity: 0.2,
                boxSelectionEnabled: false,
                autounselectify: true
            });

            cy.on('zoom', () => {
                window.userHasManuallyZoomed = true;
                updateMinimap();
            });

            cy.on('pan', () => {
                updateMinimap();
            });

            let tapTimeout = null;
            let lastTapped = null;

            cy.on('tap', 'node[type = "pillar"]', event => {
                const id = event.target.data('pillar');
                togglePillarExpansion(id);
            });

            cy.on('tap', 'node[type = "element"]', event => {
                const node = event.target;
                cy.elements().removeClass('highlighted-sysml');
                node.addClass('highlighted-sysml');

                const pillarLabel = SYSML_PILLARS.find(p => p.id === node.data('pillar'))?.label || 'Element';
                document.getElementById('status-text').textContent = pillarLabel + ': ' + node.data('label') + ' [' + node.data('sysmlType') + ']';

                centerOnNode(node);

                if (tapTimeout && lastTapped === node.id()) {
                    clearTimeout(tapTimeout);
                    tapTimeout = null;
                    lastTapped = null;
                    const elementNameToJump = node.data('elementName');
                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: elementNameToJump
                    });
                } else {
                    lastTapped = node.id();
                    tapTimeout = setTimeout(() => {
                        tapTimeout = null;
                        lastTapped = null;
                    }, 250);
                }
            });

            updatePillarVisibility();

            // Force complete Cytoscape refresh before layout
            cy.resize();
            cy.forceRender();

            // Defer layout to allow Cytoscape to calculate text dimensions and node sizes
            // This ensures containers properly fit their content on initial render
            setTimeout(() => {
                runSysMLLayout(true);
                if (!isSequentialBehaviorContext()) {
                    document.getElementById('status-text').textContent = 'SysML Pillar View • Tap a pillar to expand/collapse';
                }
            }, 100);
        }

        function highlightElementInVisualization(elementName) {
            // Remove any existing highlights without refreshing
            clearVisualHighlights();

            // Find and highlight the element based on current view
            let targetElement = null;
            let elementData = null;
            let sysmlTarget = null;

            if (currentView === 'tree') {
                // In tree view, find by node data
                d3.selectAll('.node-group').each(function(d) {
                    if (d && d.data && d.data.name === elementName) {
                        targetElement = d3.select(this);
                        elementData = d.data;
                    }
                });
            } else if (currentView === 'graph') {
                // In graph view, find by node data
                d3.selectAll('.graph-node-group').each(function(d) {
                    if (d && d.name === elementName) {
                        targetElement = d3.select(this);
                        elementData = d;
                    }
                });
            } else if (currentView === 'hierarchy') {
                // In hierarchy view, find by cell data
                d3.selectAll('.hierarchy-cell').each(function(d) {
                    if (d && d.data && d.data.name === elementName) {
                        targetElement = d3.select(this);
                        elementData = d.data;
                    }
                });
            } else if (currentView === 'sequence') {
                // In sequence view, find by diagram, participant, or message name
                d3.selectAll('.sequence-diagram text').each(function(d) {
                    const textElement = d3.select(this);
                    if (textElement.text() === elementName) {
                        targetElement = textElement;
                        elementData = { name: elementName, type: 'sequence element' };
                    }
                });

                // Also check for participants and messages
                d3.selectAll('.sequence-participant text, .sequence-message').each(function(d) {
                    const element = d3.select(this);
                    if (element.text && element.text() === elementName) {
                        targetElement = element;
                        elementData = { name: elementName, type: 'sequence element' };
                    }
                });
            } else if (currentView === 'sysml' && cy) {
                const nodeId = resolveElementIdByName(elementName);
                if (nodeId) {
                    const node = cy.getElementById(nodeId);
                    if (node && node.length > 0) {
                        sysmlTarget = node;
                        elementData = {
                            name: node.data('label'),
                            type: node.data('sysmlType') || 'element'
                        };
                    }
                }
            }

            if (sysmlTarget && elementData) {
                cy.elements().removeClass('highlighted-sysml');
                sysmlTarget.addClass('highlighted-sysml');

                const statusBar = document.getElementById('status-bar');
                const statusText = document.getElementById('status-text');
                statusText.textContent = 'Selected: ' + elementData.name + ' [' + elementData.type + ']';
                statusBar.style.display = 'flex';

                centerOnNode(sysmlTarget, 80);
                return;
            }

            if (targetElement && elementData) {
                // Add highlight class for styling
                targetElement.classed('highlighted-element', true);

                // Update status bar
                const statusBar = document.getElementById('status-bar');
                const statusText = document.getElementById('status-text');
                statusText.textContent = 'Selected: ' + elementData.name + ' [' + elementData.type + ']';
                statusBar.style.display = 'flex';

                // Create a pulsing circle animation
                const bbox = targetElement.node().getBBox();
                const centerX = bbox.x + bbox.width / 2;
                const centerY = bbox.y + bbox.height / 2;

                // Add pulsing animation
                const pulse = g.append('circle')
                    .attr('class', 'element-pulse')
                    .attr('cx', centerX)
                    .attr('cy', centerY)
                    .attr('r', 10)
                    .style('fill', 'none')
                    .style('stroke', '#FFD700')
                    .style('stroke-width', '3px')
                    .style('opacity', 1);

                // Animate the pulse
                pulse.transition()
                    .duration(1000)
                    .attr('r', 50)
                    .style('opacity', 0)
                    .on('end', function() {
                        d3.select(this).remove();
                    });

                // Center the view on the highlighted element
                const transform = d3.zoomTransform(svg.node());
                const scale = Math.min(1.5, transform.k); // Don't zoom in too much
                const translateX = (svg.node().clientWidth / 2) - (centerX * scale);
                const translateY = (svg.node().clientHeight / 2) - (centerY * scale);

                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale));
            }
        }

        function clearSelection() {
            // Clear the filter input
            const filterInput = document.getElementById('element-filter');
            if (filterInput) {
                filterInput.value = '';
            }

            // Clear filtered data and re-render with all elements
            filteredData = null;
            document.getElementById('status-text').textContent = 'Ready • Use filter to search elements';

            // Re-render the current view with all data (no filter)
            if (currentView) {
                renderVisualization(currentView);
            }
        }

        function changeView(view) {
            // Clear any existing resize timeout to avoid conflicts
            clearTimeout(resizeTimeout);

            const proceedWithRender = () => {
                currentView = view;

                // Reset diagram selection when switching views
                selectedDiagramIndex = 0;

                // Notify the panel that the view has changed
                vscode.postMessage({
                    command: 'viewChanged',
                    view: view
                });

                // Update button highlighting to show active view
                updateActiveViewButton(view);

                // Small delay to allow UI to update before rendering
                setTimeout(() => {
                    renderVisualization(view);
                }, 50);

                lastView = view;
            };

            if (shouldAnimateStructuralTransition(view)) {
                animateStructuralTransition(proceedWithRender);
            } else {
                proceedWithRender();
            }
        }

        function shouldAnimateStructuralTransition(nextView) {
            return STRUCTURAL_VIEWS.has(lastView) &&
                STRUCTURAL_VIEWS.has(nextView) &&
                nextView !== lastView;
        }

        function animateStructuralTransition(callback) {
            const viz = document.getElementById('visualization');
            if (!viz) {
                callback();
                return;
            }

            viz.classList.add('structural-transition-active', 'fade-out');

            // Allow fade-out to complete before rendering the next view
            setTimeout(() => {
                callback();

                // Trigger fade-in on next frame so DOM has new content
                requestAnimationFrame(() => {
                    viz.classList.remove('fade-out');
                    viz.classList.add('fade-in');

                    setTimeout(() => {
                        viz.classList.remove('fade-in', 'structural-transition-active');
                    }, 350);
                });
            }, 220);
        }

        function updateActiveViewButton(activeView) {
            const pillarButton = document.getElementById('sysml-btn');
            if (pillarButton) {
                pillarButton.classList.toggle('view-btn-active', activeView === 'sysml');
            }

            // Show/hide appropriate chip containers based on active view
            const pillarChips = document.getElementById('pillar-chips');
            const generalChips = document.getElementById('general-chips');
            if (pillarChips) {
                pillarChips.style.display = activeView === 'sysml' ? 'flex' : 'none';
            }
            if (generalChips) {
                generalChips.style.display = activeView === 'elk' ? 'flex' : 'none';
            }

            // Show/hide layout direction button for specific views
            const layoutDirBtn = document.getElementById('layout-direction-btn');
            if (layoutDirBtn) {
                const showLayoutBtn = ['state', 'usecase'].includes(activeView);
                layoutDirBtn.style.display = showLayoutBtn ? 'inline-flex' : 'none';
            }

            // Show/hide category headers button for General View only
            const categoryHeadersBtn = document.getElementById('category-headers-btn');
            if (categoryHeadersBtn) {
                categoryHeadersBtn.style.display = activeView === 'elk' ? 'inline-flex' : 'none';
                categoryHeadersBtn.textContent = showCategoryHeaders ? '☰ Grouped' : '☷ Flat';
            }

            const dropdownButton = document.getElementById('view-dropdown-btn');
            const dropdownConfig = VIEW_OPTIONS[activeView];
            if (dropdownButton) {
                if (dropdownConfig) {
                    dropdownButton.classList.add('view-btn-active');
                    dropdownButton.innerHTML = '<span style="font-size: 9px; margin-right: 2px;">▼</span><span>' + dropdownConfig.label + '</span>';
                } else {
                    dropdownButton.classList.remove('view-btn-active');
                    dropdownButton.innerHTML = '<span style="font-size: 9px; margin-right: 2px;">▼</span><span>Views</span>';
                }
            }

            document.querySelectorAll('.view-dropdown-item').forEach(item => {
                const isMatch = item.getAttribute('data-view') === activeView;
                item.classList.toggle('active', isMatch);
            });

            // Show/hide state layout button based on view
            updateLayoutDirectionButton(activeView);

            // Update diagram selector visibility and content based on view
            updateDiagramSelector(activeView);
        }

        // Update diagram selector for multi-diagram views
        function updateDiagramSelector(activeView) {
            const container = document.getElementById('diagram-selector-container');
            const selector = document.getElementById('diagram-selector');

            if (!container || !selector || !currentData) {
                if (container) container.style.display = 'none';
                return;
            }

            // Determine if this view supports multiple diagrams
            let diagrams = [];
            let labelText = 'Diagram:';

            if (activeView === 'elk') {
                // For General View, extract top-level packages
                const elements = currentData?.elements || [];

                const packagesArray = [];
                const seenPackages = new Set();

                // Always add "All Packages" option first
                diagrams.push({ name: 'All Packages', element: null, isAll: true });

                // Find all packages recursively up to depth 3 (includes nested packages like PartsTree, ActionTree, etc.)
                function findPackages(elementList, depth = 0) {
                    elementList.forEach(el => {
                        const typeLower = (el.type || '').toLowerCase();
                        if (typeLower.includes('package') && depth <= 3 && !seenPackages.has(el.name)) {
                            seenPackages.add(el.name);
                            packagesArray.push({ name: el.name, element: el });
                        }
                        // Recurse into all children to find nested packages (not just packages)
                        if (el.children && el.children.length > 0) {
                            findPackages(el.children, depth + 1);
                        }
                    });
                }

                findPackages(elements);

                // Add packages to diagrams array
                packagesArray.forEach(pkg => {
                    diagrams.push(pkg);
                });

                labelText = 'Package:';
            } else if (activeView === 'activity') {
                // Get activity diagrams
                const preparedData = prepareDataForView(currentData, 'activity');
                diagrams = preparedData?.diagrams || [];
                labelText = 'Action Flow:';
            } else if (activeView === 'state') {
                // For state view, extract state machines from state elements
                const preparedData = prepareDataForView(currentData, 'state');
                const stateElements = preparedData?.states || [];

                // Find state machine containers using recursive search (same logic as renderStateView)
                const stateMachineMap = new Map();

                function findStateMachinesForSelector(stateList) {
                    stateList.forEach(s => {
                        const typeLower = (s.type || '').toLowerCase();
                        const nameLower = (s.name || '').toLowerCase();

                        // State machine containers: exhibit state, or names ending with "States"
                        const isContainer = typeLower.includes('exhibit') ||
                                           nameLower.endsWith('states') ||
                                           (typeLower.includes('state') && s.children && s.children.length > 0 &&
                                            s.children.some(c => (c.type || '').toLowerCase().includes('state')));

                        // Skip definitions
                        if (isContainer && !typeLower.includes('def')) {
                            stateMachineMap.set(s.name, s);
                        }

                        // Recurse into children
                        if (s.children && s.children.length > 0) {
                            findStateMachinesForSelector(s.children);
                        }
                    });
                }

                findStateMachinesForSelector(stateElements);

                diagrams = Array.from(stateMachineMap.entries()).map(([name, element]) => ({
                    name: name,
                    element: element
                }));

                // If no state machines found but there are states, show "All States" as single option
                if (diagrams.length === 0 && stateElements.length > 0) {
                    diagrams = [{ name: 'All States', element: null }];
                }

                labelText = 'State Machine:';
            } else if (activeView === 'sequence') {
                // Get sequence diagrams
                diagrams = currentData?.sequenceDiagrams || [];
                labelText = 'Sequence:';
            } else if (activeView === 'ibd' || activeView === 'usecase' || activeView === 'tree' || activeView === 'graph' || activeView === 'hierarchy') {
                // For these views, extract top-level packages (same as elk/General View)
                const elements = currentData?.elements || [];

                const packagesArray = [];
                const seenPackages = new Set();

                // Always add "All Packages" option first
                diagrams.push({ name: 'All Packages', element: null, isAll: true });

                // Find all packages recursively up to depth 3 (SysML v2 spec allows nested packages)
                function findPackagesForView(elementList, depth = 0) {
                    elementList.forEach(el => {
                        const typeLower = (el.type || '').toLowerCase();
                        if (typeLower.includes('package') && depth <= 3 && !seenPackages.has(el.name)) {
                            seenPackages.add(el.name);
                            packagesArray.push({ name: el.name, element: el });
                        }
                        // Recurse into all children to find nested packages
                        if (el.children && el.children.length > 0) {
                            findPackagesForView(el.children, depth + 1);
                        }
                    });
                }

                findPackagesForView(elements);

                // Add packages to diagrams array
                packagesArray.forEach(pkg => {
                    diagrams.push(pkg);
                });

                labelText = 'Package:';
            }

            // Show/hide selector based on number of diagrams
            if (diagrams.length <= 1) {
                container.style.display = 'none';
                selectedDiagramIndex = 0;
                return;
            }

            container.style.display = 'flex';

            // Update label
            const label = document.getElementById('diagram-selector-label');
            if (label) label.textContent = labelText;

            // Update count
            const countEl = document.getElementById('diagram-count');
            if (countEl) countEl.textContent = '(' + diagrams.length + ' available)';

            // Populate selector
            selector.innerHTML = '';
            diagrams.forEach((d, idx) => {
                const option = document.createElement('option');
                option.value = idx;
                option.textContent = d.name || 'Diagram ' + (idx + 1);
                if (idx === selectedDiagramIndex) option.selected = true;
                selector.appendChild(option);
            });

            // Ensure selected index is valid
            if (selectedDiagramIndex >= diagrams.length) {
                selectedDiagramIndex = 0;
                selector.value = '0';
            }
        }

        // Universal layout direction labels and icons
        const LAYOUT_DIRECTION_LABELS = {
            'horizontal': 'Left → Right',
            'vertical': 'Top → Down',
            'auto': 'Auto Layout'
        };
        const LAYOUT_DIRECTION_ICONS = {
            'horizontal': '→',
            'vertical': '↓',
            'auto': '◎'
        };

        function updateLayoutDirectionButton(activeView) {
            const layoutBtn = document.getElementById('layout-direction-btn');
            if (layoutBtn) {
                // Use activity-specific direction for activity view
                const effectiveDirection = activeView === 'activity' ? activityLayoutDirection : layoutDirection;
                const icon = LAYOUT_DIRECTION_ICONS[effectiveDirection] || '→';
                const label = LAYOUT_DIRECTION_LABELS[effectiveDirection] || 'Left → Right';
                layoutBtn.textContent = icon + ' ' + label;

                // Update tooltip to show next option
                const nextMode = getNextLayoutDirection(effectiveDirection);
                const nextLabel = LAYOUT_DIRECTION_LABELS[nextMode];
                layoutBtn.title = 'Switch to ' + nextLabel;

                // Sync with view-specific orientations for backwards compatibility
                stateLayoutOrientation = layoutDirection === 'auto' ? 'force' : layoutDirection;
                usecaseLayoutOrientation = layoutDirection === 'auto' ? 'force' : layoutDirection;
            }
        }

        function getNextLayoutDirection(current) {
            const modes = ['horizontal', 'vertical', 'auto'];
            const currentIndex = modes.indexOf(current);
            return modes[(currentIndex + 1) % modes.length];
        }

        function toggleLayoutDirection() {
            // Use activity-specific direction for activity view
            if (currentView === 'activity') {
                activityLayoutDirection = getNextLayoutDirection(activityLayoutDirection);
            } else {
                layoutDirection = getNextLayoutDirection(layoutDirection);
            }
            updateLayoutDirectionButton(currentView);
            // Re-render the current view
            renderVisualization(currentView);
        }

        function toggleCategoryHeaders() {
            showCategoryHeaders = !showCategoryHeaders;
            // Update button text
            const btn = document.getElementById('category-headers-btn');
            if (btn) {
                btn.textContent = showCategoryHeaders ? '☰ Grouped' : '☷ Flat';
            }
            // Re-render the General view
            if (currentView === 'elk') {
                renderVisualization('elk');
            }
        }

        function updateStateLayoutButton(activeView) {
            // Legacy function - now handled by updateLayoutDirectionButton
        }

        function updateUsecaseLayoutButton(activeView) {
            // Legacy function - now handled by updateLayoutDirectionButton
        }

        function getNextLayoutMode(current) {
            const modes = ['horizontal', 'vertical', 'force'];
            const currentIndex = modes.indexOf(current);
            return modes[(currentIndex + 1) % modes.length];
        }

        function toggleStateLayout() {
            layoutDirection = getNextLayoutDirection(layoutDirection);
            stateLayoutOrientation = layoutDirection === 'auto' ? 'force' : layoutDirection;
            updateLayoutDirectionButton(currentView);
            // Re-render the state view
            if (currentView === 'state') {
                renderVisualization('state');
            }
        }

        function toggleUsecaseLayout() {
            layoutDirection = getNextLayoutDirection(layoutDirection);
            usecaseLayoutOrientation = layoutDirection === 'auto' ? 'force' : layoutDirection;
            updateLayoutDirectionButton(currentView);
            // Re-render the usecase view
            if (currentView === 'usecase') {
                renderVisualization('usecase');
            }
        }

        // Make functions globally accessible for HTML onclick handlers
        window.changeView = changeView;

        function renderVisualization(view, preserveZoomOverride = null, allowDuringResize = false) {
            if (!currentData) {
                return;
            }

            if (isRendering) {
                // Already rendering, skip
                return;
            }

            // Only reset manual zoom flag when the view type actually changes
            // This preserves zoom state when the same view is re-rendered due to data changes
            const viewChanged = view !== lastView;
            if (viewChanged) {
                window.userHasManuallyZoomed = false;
            }

            // Use filtered data if available, otherwise use original data
            let baseData = filteredData || currentData;

            // Apply package filter for views that support it (excluding elk which handles it internally)
            // Index 0 = "All Packages", Index 1+ = specific packages
            if (selectedDiagramIndex > 0 &&
                (view === 'ibd' || view === 'usecase' || view === 'tree' || view === 'graph' || view === 'hierarchy')) {

                const elements = baseData?.elements || [];
                const packagesArray = [];
                const seenPackages = new Set();

                // Find all packages recursively (SysML v2 spec allows nested packages up to depth 3)
                function findPackagesForRender(elementList, depth = 0) {
                    elementList.forEach(el => {
                        const typeLower = (el.type || '').toLowerCase();
                        if (typeLower.includes('package') && depth <= 3 && !seenPackages.has(el.name)) {
                            seenPackages.add(el.name);
                            packagesArray.push({ name: el.name, element: el });
                        }
                        // Recurse into all children to find nested packages
                        if (el.children && el.children.length > 0) {
                            findPackagesForRender(el.children, depth + 1);
                        }
                    });
                }

                findPackagesForRender(elements);

                // Get the selected package (index 0 is "All Packages", so subtract 1)
                const selectedPackageIdx = selectedDiagramIndex - 1;
                if (selectedPackageIdx >= 0 && selectedPackageIdx < packagesArray.length) {
                    const selectedPackage = packagesArray[selectedPackageIdx];

                    // Create filtered baseData with only this package's contents
                    if (selectedPackage.element) {
                        baseData = {
                            ...baseData,
                            elements: [selectedPackage.element]
                        };
                    }
                }
            }

            const dataToRender = prepareDataForView(baseData, view);

            isRendering = true;

            // Show loading indicator
            showLoading('Rendering ' + (VIEW_OPTIONS[view]?.label || view) + '...');

            // Safety timeout: auto-reset isRendering after 10 seconds to prevent permanent lockup
            const renderSafetyTimeout = setTimeout(() => {
                if (isRendering) {
                    isRendering = false;
                }
            }, 10000);

            // Test basic setup
            const vizElement = document.getElementById('visualization');

            // Add error handling around rendering
            try {

            // Preserve current zoom state before clearing
            let currentTransform = d3.zoomIdentity;
            let shouldPreserveZoom = false;

            if (svg && zoom) {
                try {
                    currentTransform = d3.zoomTransform(svg.node());
                    // Only preserve zoom if user has manually interacted
                    shouldPreserveZoom = window.userHasManuallyZoomed === true;
                } catch (e) {
                    // If there's an error getting transform, don't preserve
                    shouldPreserveZoom = false;
                    currentTransform = d3.zoomIdentity;
                }
            }

            d3.select('#visualization').selectAll('*').remove();

            const width = document.getElementById('visualization').clientWidth;
            const height = document.getElementById('visualization').clientHeight;

            svg = d3.select('#visualization')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            zoom = d3.zoom()
                .scaleExtent([MIN_CANVAS_ZOOM, MAX_CANVAS_ZOOM])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                    // Update minimap viewport when zooming/panning
                    updateMinimap();
                    // Mark as manual interaction if triggered by user (not programmatic)
                    if (event.sourceEvent) {
                        window.userHasManuallyZoomed = true;
                    }
                });

            // Enable mouse-centered zooming by setting the zoom center
            svg.call(zoom)
                .on('dblclick.zoom', null) // Disable default double-click zoom behavior
                .on('wheel.zoom', function(event) {
                    event.preventDefault();

                    // Mark that user has manually zoomed
                    window.userHasManuallyZoomed = true;

                    // Get mouse position relative to SVG
                    const mouse = d3.pointer(event, this);
                    const currentTransform = d3.zoomTransform(this);

                    // Calculate zoom factor
                    const factor = event.deltaY > 0 ? 0.9 : 1.1;
                    const newScale = Math.min(
                        Math.max(currentTransform.k * factor, MIN_CANVAS_ZOOM),
                        MAX_CANVAS_ZOOM
                    );

                    // Calculate new translation to zoom around mouse position
                    const translateX = mouse[0] - (mouse[0] - currentTransform.x) * (newScale / currentTransform.k);
                    const translateY = mouse[1] - (mouse[1] - currentTransform.y) * (newScale / currentTransform.k);

                    // Apply the transform
                    d3.select(this)
                        .transition()
                        .duration(50)
                        .call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(newScale));
                });
            g = svg.append('g');

            // Restore the zoom state after creating new elements, but do it after render
            const restoreZoom = () => {
                if (shouldPreserveZoom && currentTransform) {
                    // Use a slight delay to ensure elements are rendered
                    setTimeout(() => {
                        svg.transition()
                            .duration(0)  // No animation for restore
                            .call(zoom.transform, currentTransform);
                    }, 10);
                }
            };

            // Add global click handler to close expanded details when clicking on empty space
            svg.on('click', (event) => {
                // Only close if clicking on the SVG background (not on nodes or details)
                if (event.target === svg.node() || event.target === g.node()) {
                    g.selectAll('.expanded-details').remove();
                    // Reset both graph and tree view selections
                    g.selectAll('.graph-node-background')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '2px');
                    g.selectAll('.node-background')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '1px');
                    g.selectAll('.node-group').classed('selected', false);
                    g.selectAll('.graph-node-group').classed('selected', false);
                    g.selectAll('.hierarchy-cell').classed('selected', false);
                    g.selectAll('.elk-node').classed('selected', false);
                }
            });

            // Handle async and sync rendering
            if (view === 'elk') {
                renderElkTreeView(width, height, dataToRender).then(() => {
                    // If zoom was previously modified, restore it; otherwise zoom to fit
                    if (shouldPreserveZoom) {
                        restoreZoom();
                    } else {
                        // Delay zoom to fit to ensure ELK layout is complete
                        setTimeout(() => zoomToFit('auto'), 200);
                    }
                    setTimeout(() => {
                        updateDimensionsDisplay();
                        isRendering = false; // Reset rendering flag
                        updateMinimap(); // Update minimap after rendering
                        hideLoading(); // Hide loading indicator
                    }, 300);
                }).catch((error) => {
                    console.error('[General View] Render error:', error);
                    isRendering = false; // Reset flag on error too
                    hideLoading(); // Hide loading indicator on error
                });
            } else {
                // Synchronous rendering
                if (view === 'tree') {
                    renderTreeView(width, height, dataToRender);
                } else if (view === 'graph') {
                    renderGraphView(width, height, dataToRender);
                } else if (view === 'hierarchy') {
                    renderHierarchyView(width, height, dataToRender);
                } else if (view === 'sequence') {
                    renderSequenceView(width, height, dataToRender);
                } else if (view === 'ibd') {
                    renderIbdView(width, height, dataToRender);
                } else if (view === 'package') {
                    renderPackageView(width, height, dataToRender);
                } else if (view === 'activity') {
                    renderActivityView(width, height, dataToRender);
                } else if (view === 'state') {
                    renderStateView(width, height, dataToRender);
                } else if (view === 'usecase') {
                    renderUseCaseView(width, height, dataToRender);
                } else {
                    renderPlaceholderView(width, height, 'Unknown View', 'The selected view is not yet implemented.', dataToRender);
                }

                // If zoom was previously modified, restore it; otherwise zoom to fit
                if (shouldPreserveZoom) {
                    restoreZoom();
                } else {
                    // Delay zoom to fit to ensure rendering is complete
                    setTimeout(() => zoomToFit('auto'), 100);
                }

                // Show initial dimensions briefly
                setTimeout(() => {
                    updateDimensionsDisplay();
                    isRendering = false; // Reset rendering flag
                    updateMinimap(); // Update minimap after rendering
                    hideLoading(); // Hide loading indicator
                }, 200);
            }

            // Update lastView after successful render start
            lastView = view;
            } catch (error) {
                console.error('Error during rendering:', error);
                isRendering = false; // Reset flag on error
                hideLoading(); // Hide loading indicator on error

                // Show error message to user
                const statusText = document.getElementById('status-text');
                if (statusText) {
                    statusText.textContent = 'Error rendering visualization: ' + error.message;
                }
            }
        }

        function renderTreeView(width, height, data = currentData) {
            if (!data || !data.elements || data.elements.length === 0) {
                renderPlaceholderView(width, height, 'Tree View',
                    'No elements found to display.\\n\\nThe parser did not return any elements for visualization.',
                    data);
                return;
            }

            // Determine if horizontal or vertical layout
            const isHorizontal = layoutDirection === 'horizontal' || layoutDirection === 'auto';

            // Dynamic spacing based on tree complexity and children count
            const treeLayout = d3.tree()
                .size(isHorizontal ? [height * 2.5 - 100, width - 200] : [width - 200, height * 2.5 - 100])
                .separation((a, b) => {
                    // Calculate separation based on number of children in parent nodes
                    if (a.parent === b.parent) {
                        // Sibling separation - increase based on parent's child count
                        const parentChildCount = a.parent ? (a.parent.children || []).length : 1;
                        const baseSeparation = Math.max(8, Math.min(20, parentChildCount * 1.5));

                        // Additional spacing if either sibling has many children
                        const aChildCount = (a.children || []).length;
                        const bChildCount = (b.children || []).length;
                        const maxChildCount = Math.max(aChildCount, bChildCount);
                        const childBonus = Math.max(0, maxChildCount * 2);

                        return baseSeparation + childBonus;
                    } else {
                        // Different parent separation - much larger
                        const aParentChildCount = a.parent ? (a.parent.children || []).length : 1;
                        const bParentChildCount = b.parent ? (b.parent.children || []).length : 1;
                        const avgChildCount = (aParentChildCount + bParentChildCount) / 2;

                        return Math.max(15, Math.min(30, avgChildCount * 2));
                    }
                });

            const hierarchyData = convertToHierarchy(data.elements);

            const root = d3.hierarchy(hierarchyData);
            treeLayout(root);

            const links = g.selectAll('.link')
                .data(root.links())
                .enter()
                .append('path')
                .attr('class', 'link')
                .attr('d', isHorizontal
                    ? d3.linkHorizontal().x(d => d.y + 150).y(d => d.x + 50)
                    : d3.linkVertical().x(d => d.x + 150).y(d => d.y + 50));

            const nodes = g.selectAll('.node')
                .data(root.descendants())
                .enter()
                .append('g')
                .attr('class', 'node-group')
                .attr('transform', d => isHorizontal
                    ? 'translate(' + (d.y + 150) + ',' + (d.x + 50) + ')'
                    : 'translate(' + (d.x + 150) + ',' + (d.y + 50) + ')');

            // Create background rectangles for better text readability
            nodes.each(function(d) {
                const node = d3.select(this);
                const nameLength = d.data.name.length;
                const typeLength = d.data.type.length;
                const maxLength = Math.max(nameLength, typeLength);

                // Check library validation status
                const isLibValidated = isLibraryValidated(d.data);
                const borderColor = isLibValidated ? 'var(--vscode-charts-green)' : 'var(--vscode-panel-border)';
                const borderWidth = isLibValidated ? '2px' : '1px';

                // Background rectangle
                node.append('rect')
                    .attr('class', 'node-background')
                    .attr('x', -8)
                    .attr('y', -15)
                    .attr('width', Math.max(85, maxLength * 6.5))
                    .attr('height', 46)
                    .attr('rx', 5)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', borderColor)
                    .style('stroke-width', borderWidth)
                    .style('opacity', 0.9);

                // Circle node - use library color if validated
                const nodeColor = getNodeColor(d.data);
                node.append('circle')
                    .attr('class', 'node')
                    .attr('r', 6)
                    .style('fill', nodeColor)
                    .on('click', (event, d) => {
                        event.stopPropagation();
                        expandTreeNodeDetails(d, node);
                    })
                    .on('dblclick', (event, d) => {
                        event.stopPropagation();
                        event.preventDefault(); // Prevent default browser double-click behavior

                        // Keep the expanded popup open and maintain focus
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: d.data.name
                        });

                        // Don't close the popup on double-click
                        // The popup will remain open for better user experience
                    });

                // Element name (truncate if too long)
                const truncatedName = d.data.name.length > 15
                    ? d.data.name.substring(0, 15) + '...'
                    : d.data.name;

                node.append('text')
                    .attr('class', 'node-label')
                    .attr('dx', 10)
                    .attr('dy', -2)
                    .text(truncatedName)
                    .style('font-weight', 'bold');

                // Element type (smaller and below name)
                node.append('text')
                    .attr('class', 'node-type')
                    .attr('dx', 10)
                    .attr('dy', 12)
                    .text('[' + d.data.type + ']');

                // Add child count indicator if has children
                if (d.children || d._children) {
                    const childCount = (d.children || d._children).length;
                    node.append('text')
                        .attr('class', 'node-children')
                        .attr('dx', 10)
                        .attr('dy', 24)
                        .text('(' + childCount + ' children)')
                        .style('font-size', '9px')
                        .style('font-style', 'italic');
                }
            });

            // renderRelationships(); // Disabled - causing disconnected lines, graph view handles this properly
        }



        function expandTreeNodeDetails(nodeData, nodeGroup) {
            // Remove any existing expanded details
            g.selectAll('.expanded-details').remove();

            // Remove selection styling from all nodes
            g.selectAll('.node-background')
                .style('stroke', 'var(--vscode-panel-border)')
                .style('stroke-width', '1px');
            g.selectAll('.node-group').classed('selected', false);

            // Add selection styling to clicked node
            nodeGroup.select('.node-background')
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', '3px');
            nodeGroup.classed('selected', true);

            // Get the node's transform to position the details panel
            const transform = nodeGroup.attr('transform');
            const matches = transform.match(/translate[(]([^,]+),([^)]+)[)]/);
            const nodeX = parseFloat(matches[1]);
            const nodeY = parseFloat(matches[2]);

            // Calculate dynamic dimensions based on content
            const baseHeight = 85; // Base height for name, type, level
            const lineHeight = 15;
            const sectionSpacing = 10;
            let contentHeight = baseHeight;

            // Calculate documentation height
            const docHeight = nodeData.data.properties?.documentation
                ? Math.min(Math.ceil(String(nodeData.data.properties.documentation).length / 35), 3) * 14 + 30 + sectionSpacing
                : 0;
            contentHeight += docHeight;

            // Calculate attributes height
            const attributes = nodeData.data.attributes || {};
            const displayableAttributes = Object.entries(attributes).filter(([key]) =>
                !key.startsWith('is') && key !== 'visibility'
            );
            const attributesHeight = displayableAttributes.length > 0
                ? Math.min(displayableAttributes.length, 4) * lineHeight + 20 + sectionSpacing
                : 0;
            contentHeight += attributesHeight;

            // Calculate properties height
            const properties = nodeData.data.properties || {};
            const regularProperties = Object.entries(properties).filter(([key]) => key !== 'documentation');
            const propertiesHeight = regularProperties.length > 0
                ? Math.min(regularProperties.length, 3) * lineHeight + 20 + sectionSpacing
                : 0;
            contentHeight += propertiesHeight;

            // Calculate children height (with attributes showing)
            let childrenHeight = 0;
            if (nodeData.children && nodeData.children.length > 0) {
                const maxChildrenToShow = Math.min(nodeData.children.length, 4);
                let childContentHeight = 20 + sectionSpacing; // Header height

                nodeData.children.slice(0, maxChildrenToShow).forEach(child => {
                    childContentHeight += lineHeight; // Child name line

                    // Add height for child attributes
                    if (child.data.attributes && Object.keys(child.data.attributes).length > 0) {
                        const childAttrs = Object.entries(child.data.attributes).filter(([key]) =>
                            !key.startsWith('is') && key !== 'visibility'
                        );
                        childContentHeight += Math.min(childAttrs.length, 3) * 12; // 12px per attribute line
                    }
                    childContentHeight += 5; // Spacing between children
                });

                if (nodeData.children.length > maxChildrenToShow) {
                    childContentHeight += 15; // "... more children" line
                }

                childrenHeight = childContentHeight;
            }
            contentHeight += childrenHeight;

            // Add button height and padding
            const buttonHeight = 25;
            const totalHeight = contentHeight + buttonHeight;

            // Dynamic width based on content
            const maxNameLength = Math.max(
                nodeData.data.name.length,
                nodeData.data.type.length + 6, // "Type: " prefix
                ...(displayableAttributes.slice(0, 4).map(([k, v]) => (k + ': ' + String(v)).length)),
                ...(regularProperties.slice(0, 3).map(([k, v]) => (k + ': ' + String(v)).length)),
                ...(nodeData.children ? nodeData.children.slice(0, 4).map(child => {
                    const childNameLength = ('• ' + child.data.name + ' [' + child.data.type + ']').length;
                    const childAttrs = child.data.attributes ? Object.entries(child.data.attributes).filter(([key]) =>
                        !key.startsWith('is') && key !== 'visibility'
                    ) : [];
                    const maxAttrLength = childAttrs.length > 0 ? Math.max(...childAttrs.map(([k, v]) =>
                        ('    ' + k + ': ' + String(v)).length
                    )) : 0;
                    return Math.max(childNameLength, maxAttrLength);
                }) : [])
            );
            const dynamicWidth = Math.max(250, Math.min(450, maxNameLength * 7 + 60));

            const popupWidth = dynamicWidth;
            const popupHeight = totalHeight;
            const buttonY = popupHeight - 20;

            // Create expanded details panel positioned next to the node
            const detailsGroup = g.append('g')
                .attr('class', 'expanded-details')
                .attr('transform', 'translate(' + (nodeX + 20) + ',' + (nodeY - 50) + ')');

            // Panel background with dynamic dimensions
            detailsGroup.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', popupWidth)
                .attr('height', popupHeight)
                .attr('rx', 8)
                .style('fill', 'var(--vscode-editor-background)')
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', '2px')
                .style('filter', 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))');

            // Close button - adjusted for smaller panel
            detailsGroup.append('circle')
                .attr('cx', 185)
                .attr('cy', 15)
                .attr('r', 10)
                .style('fill', 'var(--vscode-charts-red)')
                .style('cursor', 'pointer')
                .on('click', () => {
                    g.selectAll('.expanded-details').remove();
                    g.selectAll('.node-background')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '1px');
                });

            detailsGroup.append('text')
                .attr('x', 185)
                .attr('y', 19)
                .attr('text-anchor', 'middle')
                .text('×')
                .style('fill', 'white')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('cursor', 'pointer')
                .on('click', () => {
                    g.selectAll('.expanded-details').remove();
                    g.selectAll('.node-background')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '1px');
                });

            // Element name
            detailsGroup.append('text')
                .attr('x', 15)
                .attr('y', 25)
                .text(nodeData.data.name)
                .style('font-weight', 'bold')
                .style('font-size', '16px')
                .style('fill', 'var(--vscode-editor-foreground)');

            // Element type
            detailsGroup.append('text')
                .attr('x', 15)
                .attr('y', 45)
                .text('Type: ' + nodeData.data.type)
                .style('font-size', '12px')
                .style('fill', 'var(--vscode-descriptionForeground)');

            let yOffset = 65;

            // Library validation status
            if (isLibraryValidated(nodeData.data)) {
                const libKind = getLibraryKind(nodeData.data);
                const libChain = getLibraryChain(nodeData.data);

                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', yOffset)
                    .text('✓ Standard Library Type')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .style('fill', 'var(--vscode-charts-green)');

                yOffset += 20;

                if (libKind) {
                    detailsGroup.append('text')
                        .attr('x', 15)
                        .attr('y', yOffset)
                        .text('Library Kind: ' + libKind)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 18;
                }

                if (libChain) {
                    detailsGroup.append('text')
                        .attr('x', 15)
                        .attr('y', yOffset)
                        .text('Specialization: ' + libChain)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 18;
                }
            }

            // Hierarchy level
            detailsGroup.append('text')
                .attr('x', 15)
                .attr('y', yOffset)
                .text('Level: ' + nodeData.depth)
                .style('font-size', '12px')
                .style('fill', 'var(--vscode-descriptionForeground)');

            yOffset += 20;

            // Documentation section
            if (nodeData.data.properties && nodeData.data.properties.documentation) {
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', yOffset)
                    .text('Documentation:')
                    .style('font-weight', 'bold')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                yOffset += 20;
                // Wrap long documentation text
                const docText = String(nodeData.data.properties.documentation);
                const maxLineLength = 35;
                const lines = [];

                if (docText.length > maxLineLength) {
                    let currentLine = '';
                    const words = docText.split(' ');

                    for (const word of words) {
                        if ((currentLine + word).length > maxLineLength && currentLine.length > 0) {
                            lines.push(currentLine.trim());
                            currentLine = word + ' ';
                        } else {
                            currentLine += word + ' ';
                        }
                    }
                    if (currentLine.trim().length > 0) {
                        lines.push(currentLine.trim());
                    }
                } else {
                    lines.push(docText);
                }

                // Show first 3 lines of documentation
                lines.slice(0, 3).forEach(line => {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text(line)
                        .style('font-size', '10px')
                        .style('fill', 'var(--vscode-descriptionForeground)')
                        .style('font-style', 'italic');
                    yOffset += 14;
                });

                if (lines.length > 3) {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text('... (' + (lines.length - 3) + ' more lines)')
                        .style('font-size', '9px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 12;
                }

                yOffset += 10; // Extra spacing after documentation
            }

            // Attributes section - show SysML element attributes
            const nodeAttributes = nodeData.data.attributes || {};
            const displayAttributes = Object.entries(nodeAttributes).filter(([key]) =>
                // Filter out internal attributes that aren't useful for display
                !key.startsWith('is') && key !== 'visibility'
            );

            if (displayAttributes.length > 0) {
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', yOffset)
                    .text('Attributes:')
                    .style('font-weight', 'bold')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                yOffset += 20;
                displayAttributes.slice(0, 4).forEach(([key, value]) => {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text(key + ': ' + (String(value).length > 25 ? String(value).substring(0, 22) + '...' : String(value)))
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-charts-purple)');
                    yOffset += 15;
                });

                if (displayAttributes.length > 4) {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text('... (' + (displayAttributes.length - 4) + ' more attributes)')
                        .style('font-size', '10px')
                        .style('font-style', 'italic')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 15;
                }

                yOffset += 10; // Extra spacing after attributes
            }

            // Properties section (excluding documentation which is shown separately)
            const nodeProperties = nodeData.data.properties || {};
            const displayProperties = Object.entries(nodeProperties).filter(([key]) => key !== 'documentation');

            if (displayProperties.length > 0) {
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', yOffset)
                    .text('Properties:')
                    .style('font-weight', 'bold')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                yOffset += 20;
                displayProperties.slice(0, 3).forEach(([key, value]) => {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text(key + ': ' + (String(value).length > 25 ? String(value).substring(0, 22) + '...' : String(value)))
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 15;
                });
            }

            // Children section - now shows more children with attributes
            if (nodeData.children && nodeData.children.length > 0) {
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', yOffset)
                    .text('Children (' + nodeData.children.length + '):')
                    .style('font-weight', 'bold')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                yOffset += 20;
                const maxChildrenToShow = Math.min(nodeData.children.length, 4); // Show up to 4 children with attributes

                nodeData.children.slice(0, maxChildrenToShow).forEach(child => {
                    // Child name and type
                    const childText = '• ' + child.data.name + ' [' + child.data.type + ']';
                    const truncatedText = childText.length > 40
                        ? childText.substring(0, 37) + '...'
                        : childText;

                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text(truncatedText)
                        .style('font-size', '11px')
                        .style('font-weight', 'bold')
                        .style('fill', 'var(--vscode-editor-foreground)');
                    yOffset += 15;

                    // Show child attributes if they exist
                    if (child.data.attributes && Object.keys(child.data.attributes).length > 0) {
                        const childAttributes = Object.entries(child.data.attributes);
                        const maxAttrsToShow = Math.min(childAttributes.length, 3);

                        childAttributes.slice(0, maxAttrsToShow).forEach(([key, value]) => {
                            // Skip internal attributes that aren't useful for display
                            if (!key.startsWith('is') && key !== 'visibility') {
                                const attrText = '    ' + key + ': ' + String(value);
                                const truncatedAttr = attrText.length > 35
                                    ? attrText.substring(0, 32) + '...'
                                    : attrText;

                                detailsGroup.append('text')
                                    .attr('x', 35)
                                    .attr('y', yOffset)
                                    .text(truncatedAttr)
                                    .style('font-size', '10px')
                                    .style('font-style', 'italic')
                                    .style('fill', 'var(--vscode-charts-purple)');
                                yOffset += 12;
                            }
                        });

                        if (childAttributes.length > maxAttrsToShow) {
                            detailsGroup.append('text')
                                .attr('x', 35)
                                .attr('y', yOffset)
                                .text('    ... (' + (childAttributes.length - maxAttrsToShow) + ' more attrs)')
                                .style('font-size', '9px')
                                .style('font-style', 'italic')
                                .style('fill', 'var(--vscode-descriptionForeground)');
                            yOffset += 12;
                        }
                    }

                    yOffset += 5; // Extra spacing between children
                });

                if (nodeData.children.length > maxChildrenToShow) {
                    detailsGroup.append('text')
                        .attr('x', 25)
                        .attr('y', yOffset)
                        .text('... and ' + (nodeData.children.length - maxChildrenToShow) + ' more children')
                        .style('font-size', '10px')
                        .style('font-style', 'italic')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                    yOffset += 15;
                }
            }

            // Action buttons - adjusted for smaller panel
            // const buttonY = 108; // Moved up to fit in smaller panel

            // Navigate button
            detailsGroup.append('rect')
                .attr('x', 15)
                .attr('y', buttonY)
                .attr('width', 70)
                .attr('height', 18)
                .attr('rx', 4)
                .style('fill', 'var(--vscode-button-background)')
                .style('stroke', 'var(--vscode-button-border)')
                .style('cursor', 'pointer')
                .on('click', () => {
                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: nodeData.data.name
                    });
                });

            detailsGroup.append('text')
                .attr('x', 50)
                .attr('y', buttonY + 13)
                .attr('text-anchor', 'middle')
                .text('Navigate')
                .style('fill', 'var(--vscode-button-foreground)')
                .style('font-size', '10px')
                .style('cursor', 'pointer')
                .on('click', () => {
                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: nodeData.data.name
                    });
                });
        }

        function renderGraphView(width, height, data = currentData) {
            // Safety check for data and elements
            if (!data || !data.elements || data.elements.length === 0) {
                renderPlaceholderView(width, height, 'Graph View',
                    'No elements found to display.\\n\\nThe parser did not return any elements for visualization.',
                    data);
                return;
            }

            const nodes = flattenElements(data.elements);
            const links = createLinksFromHierarchy(data.elements);

            // Use relationships from data or fall back to currentData
            const relationships = data.relationships || currentData?.relationships || [];
            relationships.forEach(rel => {
                const source = nodes.find(n => n.name === rel.source);
                const target = nodes.find(n => n.name === rel.target);
                if (source && target) {
                    links.push({ source: source, target: target, type: rel.type });
                }
            });

            // Enhanced force simulation with better spacing and positioning
            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id(d => d.name).distance(250))  // Increased from 120
                .force('charge', d3.forceManyBody().strength(-1000))  // Increased repulsion from -400
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collision', d3.forceCollide().radius(120))  // Increased from 60
                .force('x', d3.forceX(width / 2).strength(0.05))  // Gentle centering on x-axis
                .force('y', d3.forceY(height / 2).strength(0.05)); // Gentle centering on y-axis

            // Add arrowhead marker for relationships
            g.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 13)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 8)
                .attr('markerHeight', 8)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', 'var(--vscode-charts-purple)')
                .style('stroke','none');

            const link = g.append('g')
                .selectAll('line')
                .data(links)
                .enter()
                .append('line')
                .attr('class', d => d.type ? 'relationship-link' : 'link')
                .style('stroke', d => d.type ? 'var(--vscode-charts-purple)' : 'var(--vscode-panel-border)')
                .style('stroke-width', d => d.type ? 3 : 2)
                .style('opacity', 0.7)
                .style('marker-end', d => d.type ? 'url(#arrowhead)' : 'none');

            const node = g.append('g')
                .selectAll('g')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class', 'graph-node-group')
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended));

            // Simplified node rendering with minimal data
            node.each(function(d) {
                const nodeGroup = d3.select(this);

                // Calculate compact dimensions
                const displayName = d.name.length > 16 ? d.name.substring(0, 13) + '...' : d.name;
                const nameWidth = displayName.length * 8;
                const maxWidth = Math.max(nameWidth + 20, 100); // Minimum 100px
                const nodeHeight = 50; // Reduced height

                // Check library validation
                const isLibValidated = isLibraryValidated(d);
                const borderColor = isLibValidated ? 'var(--vscode-charts-green)' : 'var(--vscode-panel-border)';
                const borderWidth = isLibValidated ? '3px' : '2px';

                // Simple background card
                nodeGroup.append('rect')
                    .attr('class', 'graph-node-background')
                    .attr('x', -maxWidth / 2)
                    .attr('y', -nodeHeight / 2)
                    .attr('width', maxWidth)
                    .attr('height', nodeHeight)
                    .attr('rx', 8)
                    .attr('ry', 8)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', borderColor)
                    .style('stroke-width', borderWidth)
                    .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))')
                    .on('click', (event, d) => {
                        event.stopPropagation();
                        expandNodeDetails(d, nodeGroup);
                    })
                    .on('dblclick', (event, d) => {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: d.name
                        });
                    });

                // Just the element name (main content)
                nodeGroup.append('text')
                    .attr('class', 'node-label')
                    .attr('text-anchor', 'middle')
                    .attr('dy', -3)
                    .text(displayName)
                    .style('font-weight', '600')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                // Just the type (smaller, below name)
                nodeGroup.append('text')
                    .attr('class', 'node-type')
                    .attr('text-anchor', 'middle')
                    .attr('dy', 12)
                    .text(d.type)
                    .style('font-size', '10px')
                    .style('fill', 'var(--vscode-descriptionForeground)')
                    .style('font-style', 'italic');
            });

            simulation.on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');
            });

            function expandNodeDetails(nodeData, nodeGroup) {
                // Remove any existing expanded details
                g.selectAll('.expanded-details').remove();

                // Remove selection styling from all nodes
                g.selectAll('.graph-node-background')
                    .style('stroke', 'var(--vscode-panel-border)')
                    .style('stroke-width', '2px');
                g.selectAll('.graph-node-group').classed('selected', false);

                // Add selection styling to clicked node
                nodeGroup.select('.graph-node-background')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '3px');
                nodeGroup.classed('selected', true);

                // Create expanded details panel positioned next to the node
                const detailsGroup = g.append('g')
                    .attr('class', 'expanded-details')
                    .attr('transform', 'translate(' + (nodeData.x + 80) + ',' + (nodeData.y - 50) + ')');

                // Calculate dynamic panel height based on content
                let panelHeight = 160; // Base height
                if (nodeData.element && nodeData.element.attributes && nodeData.element.attributes.size > 0) {
                    const attributeEntries = Array.from(nodeData.element.attributes.entries())
                        .filter(([key, value]) => !key.startsWith('is') && key !== 'visibility' && value);
                    if (attributeEntries.length > 0) {
                        panelHeight += Math.min(attributeEntries.length, 3) * 15 + 30; // Space for attributes
                        if (attributeEntries.length > 3) panelHeight += 15; // Space for "more" text
                    }
                }

                // Add space for ports if they exist
                if (nodeData.children) {
                    const ports = nodeData.children.filter(child =>
                        child.type && (child.type.toLowerCase().includes('port') ||
                                      child.type.toLowerCase().includes('interface')));
                    if (ports.length > 0) {
                        panelHeight += Math.min(ports.length, 3) * 15 + 30; // Space for ports
                        if (ports.length > 3) panelHeight += 15; // Space for "more" text
                    }
                }

                // Panel background - dynamic size
                detailsGroup.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 280)
                    .attr('height', panelHeight)
                    .attr('rx', 8)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '2px')
                    .style('filter', 'drop-shadow(3px 3px 6px rgba(0,0,0,0.4))');

                // Close button - positioned relative to panel width
                detailsGroup.append('circle')
                    .attr('cx', 265)
                    .attr('cy', 15)
                    .attr('r', 10)
                    .style('fill', 'var(--vscode-charts-red)')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        g.selectAll('.expanded-details').remove();
                        g.selectAll('.graph-node-background')
                            .style('stroke', 'var(--vscode-panel-border)')
                            .style('stroke-width', '2px');
                    });

                detailsGroup.append('text')
                    .attr('x', 265)
                    .attr('y', 19)
                    .attr('text-anchor', 'middle')
                    .text('×')
                    .style('fill', 'white')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        g.selectAll('.expanded-details').remove();
                        g.selectAll('.graph-node-background')
                            .style('stroke', 'var(--vscode-panel-border)')
                            .style('stroke-width', '2px');
                    });

                // Element name
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', 25)
                    .text(nodeData.name)
                    .style('font-weight', 'bold')
                    .style('font-size', '16px')
                    .style('fill', 'var(--vscode-editor-foreground)');

                // Element type
                detailsGroup.append('text')
                    .attr('x', 15)
                    .attr('y', 45)
                    .text('Type: ' + nodeData.type)
                    .style('font-size', '12px')
                    .style('fill', 'var(--vscode-descriptionForeground)');

                let yOffset = 65;

                // Attributes section - show attributes for the element
                if (nodeData.element && nodeData.element.attributes && nodeData.element.attributes.size > 0) {
                    // Filter out internal attributes
                    const attributeEntries = Array.from(nodeData.element.attributes.entries())
                        .filter(([key, value]) => !key.startsWith('is') && key !== 'visibility' && value);

                    if (attributeEntries.length > 0) {
                        detailsGroup.append('text')
                            .attr('x', 15)
                            .attr('y', yOffset)
                            .text('Attributes:')
                            .style('font-weight', 'bold')
                            .style('font-size', '13px')
                            .style('fill', 'var(--vscode-charts-purple)');

                        yOffset += 20;
                        attributeEntries.slice(0, 3).forEach(([key, value]) => {
                            const displayValue = String(value).length > 25 ? String(value).substring(0, 22) + '...' : String(value);
                            detailsGroup.append('text')
                                .attr('x', 25)
                                .attr('y', yOffset)
                                .text(key + ': ' + displayValue)
                                .style('font-size', '11px')
                                .style('fill', 'var(--vscode-charts-purple)')
                                .style('opacity', '0.9');
                            yOffset += 15;
                        });

                        if (attributeEntries.length > 3) {
                            detailsGroup.append('text')
                                .attr('x', 25)
                                .attr('y', yOffset)
                                .text('... and ' + (attributeEntries.length - 3) + ' more attributes')
                                .style('font-size', '10px')
                                .style('font-style', 'italic')
                                .style('fill', 'var(--vscode-charts-purple)')
                                .style('opacity', '0.7');
                            yOffset += 15;
                        }

                        yOffset += 10; // Extra spacing after attributes
                    }
                }

                // Ports section disabled - base visualization verified working

                // Documentation section
                if (nodeData.properties && nodeData.properties.documentation) {
                    detailsGroup.append('text')
                        .attr('x', 15)
                        .attr('y', yOffset)
                        .text('Documentation:')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .style('fill', 'var(--vscode-editor-foreground)');

                    yOffset += 20;
                    // Wrap long documentation text for graph view (slightly wider)
                    const docText = String(nodeData.properties.documentation);
                    const maxLineLength = 40;
                    const lines = [];

                    if (docText.length > maxLineLength) {
                        let currentLine = '';
                        const words = docText.split(' ');

                        for (const word of words) {
                            if ((currentLine + word).length > maxLineLength && currentLine.length > 0) {
                                lines.push(currentLine.trim());
                                currentLine = word + ' ';
                            } else {
                                currentLine += word + ' ';
                            }
                        }
                        if (currentLine.trim().length > 0) {
                            lines.push(currentLine.trim());
                        }
                    } else {
                        lines.push(docText);
                    }

                    // Show first 3 lines of documentation
                    lines.slice(0, 3).forEach(line => {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text(line)
                            .style('font-size', '10px')
                            .style('fill', 'var(--vscode-descriptionForeground)')
                            .style('font-style', 'italic');
                        yOffset += 14;
                    });

                    if (lines.length > 3) {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text('... (' + (lines.length - 3) + ' more lines)')
                            .style('font-size', '9px')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                        yOffset += 12;
                    }

                    yOffset += 10; // Extra spacing after documentation
                }

                // Properties section (excluding documentation which is shown separately)
                const properties = nodeData.properties || {};
                const regularProperties = Object.entries(properties).filter(([key]) => key !== 'documentation');

                if (regularProperties.length > 0) {
                    detailsGroup.append('text')
                        .attr('x', 15)
                        .attr('y', yOffset)
                        .text('Properties:')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .style('fill', 'var(--vscode-editor-foreground)');

                    yOffset += 20;
                    regularProperties.slice(0, 4).forEach(([key, value]) => {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text(key + ': ' + (String(value).length > 30 ? String(value).substring(0, 27) + '...' : String(value)))
                            .style('font-size', '11px')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                        yOffset += 15;
                    });

                    if (regularProperties.length > 4) {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text('... and ' + (regularProperties.length - 4) + ' more')
                            .style('font-size', '10px')
                            .style('font-style', 'italic')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                        yOffset += 15;
                    }
                }

                // Children section
                if (nodeData.children && nodeData.children.length > 0) {
                    detailsGroup.append('text')
                        .attr('x', 15)
                        .attr('y', yOffset)
                        .text('Children (' + nodeData.children.length + '):')
                        .style('font-weight', 'bold')
                        .style('font-size', '13px')
                        .style('fill', 'var(--vscode-editor-foreground)');

                    yOffset += 20;
                    nodeData.children.slice(0, 3).forEach(child => {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text('• ' + child.name + ' [' + child.type + ']')
                            .style('font-size', '11px')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                        yOffset += 15;
                    });

                    if (nodeData.children.length > 3) {
                        detailsGroup.append('text')
                            .attr('x', 25)
                            .attr('y', yOffset)
                            .text('... and ' + (nodeData.children.length - 3) + ' more')
                            .style('font-size', '10px')
                            .style('font-style', 'italic')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                    }
                }

                // Action buttons - positioned relative to panel height
                const buttonY = panelHeight - 25;

                // Navigate button
                detailsGroup.append('rect')
                    .attr('x', 15)
                    .attr('y', buttonY)
                    .attr('width', 80)
                    .attr('height', 20)
                    .attr('rx', 4)
                    .style('fill', 'var(--vscode-button-background)')
                    .style('stroke', 'var(--vscode-button-border)')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: nodeData.name
                        });
                    });

                detailsGroup.append('text')
                    .attr('x', 55)
                    .attr('y', buttonY + 14)
                    .attr('text-anchor', 'middle')
                    .text('Navigate')
                    .style('fill', 'var(--vscode-button-foreground)')
                    .style('font-size', '11px')
                    .style('cursor', 'pointer')
                    .on('click', () => {
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: nodeData.name
                        });
                    });
            }

            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
        }

        function renderHierarchyView(width, height, data = currentData) {
            // Safety check for data and elements
            if (!data || !data.elements || data.elements.length === 0) {
                renderPlaceholderView(width, height, 'Hierarchy View',
                    'No elements found to display.\\n\\nThe parser did not return any elements for visualization.',
                    data);
                return;
            }

            // Determine if horizontal or vertical layout
            const isHorizontal = layoutDirection === 'horizontal' || layoutDirection === 'auto';

            const partition = d3.partition()
                .size(isHorizontal ? [height - 100, width - 100] : [width - 100, height - 100])
                .padding(1); // Minimal padding to maximize space usage

            const hierarchyData = convertToHierarchy(data.elements);

            // Validate hierarchy data has proper structure
            if (!hierarchyData || !hierarchyData.name || !hierarchyData.type) {
                return;
            }

            const root = d3.hierarchy(hierarchyData)
                .sum(d => {
                    // Ensure all nodes have a meaningful value for partitioning
                    if (!d || !d.name || !d.type) {
                        return 0; // Skip invalid nodes completely
                    }
                    // For partition layout, we need consistent values
                    // Leaf nodes should have value 1, parent nodes sum their children
                    return d.children && d.children.length > 0 ? 0 : 1;
                })
                .sort((a, b) => b.value - a.value);

            partition(root);

            // Get all descendants and filter for valid ones with meaningful dimensions
            const allDescendants = root.descendants();
            const validDescendants = allDescendants.filter(d => {
                // Check for valid data
                const hasValidData = d.data && d.data.name && d.data.type;

                // Check for meaningful dimensions (more lenient)
                const hasValidDimensions = d.x1 > d.x0 && d.y1 > d.y0 &&
                    (d.x1 - d.x0) > 0.1 && (d.y1 - d.y0) > 0.1;

                // More lenient value check
                const hasValidValue = d.value !== undefined && d.value >= 0;

                const isValid = hasValidData && hasValidDimensions && hasValidValue;

                return isValid;
            });

            const cells = g.selectAll('.hierarchy-cell')
                .data(validDescendants)
                .enter()
                .append('g')
                .attr('class', 'hierarchy-cell')
                .attr('transform', d => isHorizontal
                    ? 'translate(' + (d.y0 + 50) + ',' + (d.x0 + 50) + ')'
                    : 'translate(' + (d.x0 + 50) + ',' + (d.y0 + 50) + ')');

            // Add gradient definitions for modern look
            const defs = svg.selectAll('defs').data([0]).enter().append('defs');

            const gradient = defs.selectAll('#hierarchy-gradient').data([0]).enter()
                .append('linearGradient')
                .attr('id', 'hierarchy-gradient')
                .attr('gradientUnits', 'objectBoundingBox')
                .attr('x1', 0).attr('y1', 0)
                .attr('x2', 0).attr('y2', 1);

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', 'var(--vscode-button-background)')
                .attr('stop-opacity', 0.8);

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', 'var(--vscode-button-background)')
                .attr('stop-opacity', 0.6);

            cells.append('rect')
                .attr('class', 'node hierarchy-rect')
                .attr('width', d => {
                    const w = isHorizontal ? (d.y1 - d.y0) : (d.x1 - d.x0);
                    return Math.max(8, w); // Minimum 8px
                })
                .attr('height', d => {
                    const h = isHorizontal ? (d.x1 - d.x0) : (d.y1 - d.y0);
                    return Math.max(8, h); // Minimum 8px
                })
                .attr('rx', 3) // Rounded corners for modern look
                .attr('ry', 3)
                .style('fill', 'url(#hierarchy-gradient)')
                .style('stroke', d => {
                    // Use library-aware border color
                    return isLibraryValidated(d.data) ? 'var(--vscode-charts-green)' : 'var(--vscode-panel-border)';
                })
                .style('stroke-width', d => {
                    // Thicker border for library types
                    return isLibraryValidated(d.data) ? '2px' : '1px';
                })
                .style('cursor', 'pointer')
                .on('click', (event, d) => {
                    event.stopPropagation();

                    // Clear previous selections
                    g.selectAll('.hierarchy-cell rect')
                        .style('stroke', 'var(--vscode-charts-blue)')
                        .style('stroke-width', '1px')
                        .style('stroke-opacity', 0.6)
                        .style('filter', 'none');
                    g.selectAll('.hierarchy-cell').classed('selected', false);

                    const cellGroup = event.currentTarget && event.currentTarget.parentNode
                        ? d3.select(event.currentTarget.parentNode)
                        : d3.select(event.target);
                    cellGroup.classed('selected', true);

                    // Highlight clicked cell with modern glow effect
                    d3.select(event.target)
                        .style('stroke', 'var(--vscode-charts-orange)')
                        .style('stroke-width', '3px')
                        .style('stroke-opacity', 1)
                        .style('filter', 'drop-shadow(0 0 6px var(--vscode-charts-orange))');

                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: d.data.name
                    });
                });

            // Render nested details or compact labels depending on available space
            cells.each(function(d) {
                const cell = d3.select(this);
                const cellWidth = d.y1 - d.y0;
                const cellHeight = d.x1 - d.x0;

                renderHierarchyCellContent(cell, d, cellWidth, cellHeight);
            });
        }

        function renderHierarchyCellContent(cell, node, width, height) {
            const hasSpaceForDetails = width > 140 && height > 90;
            if (hasSpaceForDetails) {
                renderHierarchyDetailCard(cell, node, width, height);
            } else {
                renderCompactHierarchyCell(cell, node, width, height);
            }
        }

        function renderHierarchyDetailCard(cell, node, width, height) {
            const padding = 8;
            const availableWidth = Math.max(16, width - padding * 2);
            const availableHeight = Math.max(16, height - padding * 2);
            const content = cell.append('g')
                .attr('class', 'hierarchy-card-content')
                .attr('transform', 'translate(' + padding + ',' + padding + ')');

            // Allow more characters for title - use 4.5px per char for better fit
            const maxTitleChars = Math.max(25, Math.floor(availableWidth / 4.5));
            const truncatedName = truncateLabel(node.data.name, maxTitleChars);
            let cursorY = 0;

            const titleText = content.append('text')
                .attr('class', 'hierarchy-card-title')
                .attr('x', 0)
                .attr('y', cursorY + 12)
                .text(truncatedName);

            // Add tooltip for full name
            titleText.append('title').text(node.data.name);

            cursorY += 24;

            const truncatedType = truncateLabel(node.data.type || '', maxTitleChars);
            const typeText = content.append('text')
                .attr('class', 'hierarchy-card-type')
                .attr('x', 0)
                .attr('y', cursorY)
                .text('[' + truncatedType + ']');

            // Add tooltip for full type
            typeText.append('title').text(node.data.type || '');

            cursorY += 10;

            const childNodes = node.children || [];
            const descendantLeafCount = node.value || 0;
            const stats = [
                { label: 'Children', value: childNodes.length },
                { label: 'Leaves', value: descendantLeafCount },
                { label: 'Depth', value: node.depth || 0 }
            ];

            const statsRow = content.append('g')
                .attr('class', 'hierarchy-stat-row')
                .attr('transform', 'translate(0,' + (cursorY + 8) + ')');

            stats.forEach((stat, index) => {
                const group = statsRow.append('g')
                    .attr('class', 'hierarchy-stat-pill')
                    .attr('transform', 'translate(' + (index * 70) + ',0)');

                group.append('rect')
                    .attr('class', 'hierarchy-stat-pill-bg')
                    .attr('x', 0)
                    .attr('y', -10)
                    .attr('width', 62)
                    .attr('height', 22)
                    .attr('rx', 11)
                    .attr('ry', 11);

                group.append('text')
                    .attr('class', 'hierarchy-stat-pill-label')
                    .attr('x', 31)
                    .attr('y', 4)
                    .attr('text-anchor', 'middle')
                    .text(stat.label + ': ' + stat.value);
            });

            cursorY += 40;

            const documentation = node.data.properties ? node.data.properties.documentation : null;
            if (documentation && cursorY + 30 < availableHeight) {
                content.append('text')
                    .attr('class', 'hierarchy-section-title')
                    .attr('x', 0)
                    .attr('y', cursorY)
                    .text('Documentation');

                cursorY += 12;

                const docLines = wrapTextToLines(documentation, Math.floor(availableWidth / 7), 3);
                docLines.forEach((line, index) => {
                    content.append('text')
                        .attr('class', 'hierarchy-detail-text')
                        .attr('x', 0)
                        .attr('y', cursorY + index * 12)
                        .text(line);
                });

                cursorY += docLines.length * 12 + 10;
            }

            const properties = Object.entries(node.data.properties || {})
                .filter(function(entry) {
                    return entry[0] !== 'documentation';
                });
            if (properties.length > 0 && cursorY + 24 < availableHeight) {
                content.append('text')
                    .attr('class', 'hierarchy-section-title')
                    .attr('x', 0)
                    .attr('y', cursorY)
                    .text('Properties');

                cursorY += 12;

                const propLineHeight = 12;
                const linesAvailable = Math.max(1, Math.floor((availableHeight - cursorY - 20) / propLineHeight));
                properties.slice(0, linesAvailable).forEach((entry, index) => {
                    const key = truncateLabel(entry[0], 12);
                    const value = truncateLabel(String(entry[1]), Math.floor(availableWidth / 8));
                    content.append('text')
                        .attr('class', 'hierarchy-detail-text')
                        .attr('x', 0)
                        .attr('y', cursorY + index * propLineHeight)
                        .text(key + ': ' + value);
                });

                cursorY += linesAvailable * propLineHeight + 8;

                if (properties.length > linesAvailable) {
                    content.append('text')
                        .attr('class', 'hierarchy-detail-text')
                        .attr('x', 0)
                        .attr('y', cursorY)
                        .style('font-style', 'italic')
                        .text('+' + (properties.length - linesAvailable) + ' more properties');

                    cursorY += 12;
                }
            }

            if (childNodes.length > 0 && cursorY + 24 < availableHeight) {
                content.append('text')
                    .attr('class', 'hierarchy-section-title')
                    .attr('x', 0)
                    .attr('y', cursorY)
                    .text('Nested');

                cursorY += 14;

                const childRowHeight = 18;
                const rowsAvailable = Math.max(1, Math.floor((availableHeight - cursorY - 6) / childRowHeight));
                const visibleChildren = childNodes.slice(0, rowsAvailable);

                visibleChildren.forEach((child, index) => {
                    const childGroup = content.append('g')
                        .attr('class', 'hierarchy-child-card')
                        .attr('transform', 'translate(0,' + (cursorY + index * childRowHeight) + ')');

                    childGroup.append('rect')
                        .attr('x', 0)
                        .attr('y', -12)
                        .attr('width', availableWidth - 4)
                        .attr('height', 16);

                    const childName = truncateLabel(child.data.name, Math.floor((availableWidth - 20) / 7));
                    const childType = truncateLabel(child.data.type || '', 12);
                    childGroup.append('text')
                        .attr('x', 6)
                        .attr('y', 0)
                        .text('• ' + childName + ' [' + childType + ']');
                });

                cursorY += visibleChildren.length * childRowHeight;

                if (childNodes.length > visibleChildren.length) {
                    content.append('text')
                        .attr('class', 'hierarchy-detail-text')
                        .attr('x', 0)
                        .attr('y', cursorY + 10)
                        .style('font-style', 'italic')
                        .text('+' + (childNodes.length - visibleChildren.length) + ' more nested items');
                }
            }
        }

        function renderCompactHierarchyCell(cell, node, width, height) {
            if (width <= 8 || height <= 8) {
                return;
            }

            if (width > 20 && height > 8 && node.data.name && node.data.type) {
                // Use more generous character calculation - 5px per char average
                const maxChars = Math.max(8, Math.floor(width / 5));
                const truncatedName = truncateLabel(node.data.name, maxChars);

                if (truncatedName) {
                    const labelText = cell.append('text')
                        .attr('class', 'node-label')
                        .attr('x', 2)
                        .attr('y', Math.min(12, height / 2 + 2))
                        .text(truncatedName)
                        .style('font-size', Math.max(10, Math.min(14, height / 1.8)) + 'px')
                        .style('font-weight', '600')
                        .style('pointer-events', 'none');

                    // Add tooltip for full name on hover
                    labelText.append('title').text(node.data.name);
                }

                if (height > 20 && node.data.type) {
                    const truncatedType = truncateLabel(node.data.type, maxChars);
                    const typeText = cell.append('text')
                        .attr('class', 'node-type')
                        .attr('x', 2)
                        .attr('y', Math.min(height - 3, height / 2 + 12))
                        .text('[' + truncatedType + ']')
                        .style('font-size', Math.max(9, Math.min(12, height / 2.8)) + 'px')
                        .style('font-weight', '500')
                        .style('opacity', 0.8)
                        .style('pointer-events', 'none');

                    // Add tooltip for full type on hover
                    typeText.append('title').text(node.data.type);
                }
            } else {
                const initial = node.data.name ? node.data.name.charAt(0).toUpperCase() : '?';
                const initialText = cell.append('text')
                    .attr('class', 'node-label')
                    .attr('x', width / 2)
                    .attr('y', height / 2 + 2)
                    .attr('text-anchor', 'middle')
                    .text(initial)
                    .style('font-size', Math.min(12, height / 1.2) + 'px')
                    .style('font-weight', 'bold')
                    .style('pointer-events', 'none');

                // Add tooltip for full name on hover
                initialText.append('title').text(node.data.name + ' [' + node.data.type + ']');
            }
        }

        function wrapTextToLines(text, maxCharsPerLine, maxLines) {
            if (maxLines === void 0) { maxLines = 3; }
            if (!text) {
                return [];
            }

            // Note: Double-escaped for template literal
            const words = String(text).split(/\s+/);
            const lines = [];
            let currentLine = '';

            words.forEach(word => {
                const tentative = currentLine.length === 0 ? word : currentLine + ' ' + word;
                if (tentative.length > maxCharsPerLine && currentLine.length > 0) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = tentative;
                }
            });

            if (currentLine.length > 0) {
                lines.push(currentLine);
            }

            if (lines.length > maxLines) {
                const trimmed = lines.slice(0, maxLines);
                const lastIndex = trimmed.length - 1;
                trimmed[lastIndex] = trimmed[lastIndex] + '…';
                return trimmed;
            }

            return lines;
        }

        function truncateLabel(text, maxChars) {
            if (!text) {
                return '';
            }
            if (text.length <= maxChars) {
                return text;
            }
            return text.substring(0, Math.max(1, maxChars - 1)) + '…';
        }

        function renderRelationships() {
            // Only render relationships in tree view and only if we have valid data
            if (currentView !== 'tree' || !currentData.relationships || currentData.relationships.length === 0) {
                return;
            }

            // Get all tree nodes with their positions
            const allNodes = [];
            g.selectAll('.node-group').each(function(d) {
                if (d && d.data) {
                    const transform = d3.select(this).attr('transform');
                    const matches = transform.match(/translate[(]([^,]+),([^)]+)[)]/);
                    if (matches) {
                        allNodes.push({
                            name: d.data.name,
                            x: parseFloat(matches[0]),
                            y: parseFloat(matches[1]),
                            element: this
                        });
                    }
                }
            });

            // Only draw relationships if we have valid node positions
            currentData.relationships.forEach(rel => {
                const sourceNode = allNodes.find(n => n.name === rel.source);
                const targetNode = allNodes.find(n => n.name === rel.target);

                if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
                    g.append('line')
                        .attr('class', 'relationship-link')
                        .attr('x1', sourceNode.x)
                        .attr('y1', sourceNode.y)
                        .attr('x2', targetNode.x)
                        .attr('y2', targetNode.y);
                }
            });
        }

        function convertToHierarchy(elements) {
            // Recursive function to convert elements with properties
            function convertElement(el) {
                // Skip elements without proper name or type
                if (!el || !el.name || !el.type) {
                    console.warn('Skipping invalid element:', el);
                    return null;
                }

                const properties = normalizeAttributes(el.attributes);

                const documentation = extractDocumentation(el);
                if (documentation) {
                    properties['documentation'] = documentation;
                }

                // Recursively convert children, filtering out null results
                const validChildren = el.children ?
                    el.children.map(convertElement).filter(child => child !== null) : [];

                return {
                    name: el.name,
                    type: el.type,
                    properties: properties,
                    children: validChildren,
                    element: el
                };
            }

            // Filter out invalid elements from top level
            const validElements = elements.map(convertElement).filter(el => el !== null);

            if (validElements.length === 1) {
                return validElements[0];
            }
            return {
                name: 'Model Root',
                type: 'root',
                properties: {},
                children: validElements
            };
        }

        // Helper to identify metadata element types that shouldn't be visualized as nodes
        function isMetadataElement(type) {
            return type === 'doc' ||
                   type === 'comment' ||
                   type === 'metadata' ||
                   type === 'metadata def';
        }

        function flattenElements(elements, result = []) {
            elements.forEach(el => {
                // Skip metadata elements - they provide context but aren't structural elements
                if (isMetadataElement(el.type)) {
                    return;
                }

                // Convert Map to regular object for easier access in visualization
                const properties = normalizeAttributes(el.attributes);

                // Add documentation if available
                const documentation = extractDocumentation(el);
                if (documentation) {
                    properties['documentation'] = documentation;
                }

                result.push({
                    name: el.name,
                    type: el.type,
                    properties: properties,
                    pillar: el.pillar,
                    element: el // Keep reference to original element
                });
                if (el.children && el.children.length > 0) {
                    flattenElements(el.children, result);
                }
            });
            return result;
        }

        function extractDocumentation(element) {
            // Look for doc/comment/metadata children with documentation content
            if (element.children) {
                const docElements = element.children.filter(child => isMetadataElement(child.type));
                if (docElements.length > 0) {
                    return docElements.map(doc => doc.name || 'Documentation').join(' ');
                }
            }

            // Check if this element itself is a metadata element
            if (isMetadataElement(element.type)) {
                return element.name || 'Documentation';
            }

            return null;
        }

        function buildHierarchicalNodes(elements, parentId = null, cyElements = [], stats = {}, parentPillarId = null) {
            elements.forEach(el => {
                const pillarId = el.pillar || parentPillarId || getPillarForElement(el);
                stats[pillarId] = (stats[pillarId] || 0) + 1;
                const nodeId = 'element-' + pillarId + '-' + slugify(el.name) + '-' + stats[pillarId];
                const lookupKey = el.name ? el.name.toLowerCase() : nodeId;
                const existing = sysmlElementLookup.get(lookupKey) || [];
                existing.push(nodeId);
                sysmlElementLookup.set(lookupKey, existing);

                const properties = normalizeAttributes(el.attributes);
                const documentation = extractDocumentation(el);
                if (documentation) {
                    properties['documentation'] = documentation;
                }

                // Build label with stereotype notation
                const baseLabel = buildElementDisplayLabel(el);

                // Extract metadata from element
                const metadata = {
                    documentation: documentation || null,
                    properties: {}
                };

                // Copy other properties (excluding documentation)
                Object.entries(properties).forEach(function(entry) {
                    const key = entry[0];
                    const value = entry[1];
                    if (key !== 'documentation') {
                        metadata.properties[key] = value;
                    }
                });

                const nodeData = {
                    id: nodeId,
                    label: baseLabel,
                    baseLabel: baseLabel,
                    type: 'element',
                    pillar: pillarId,
                    color: PILLAR_COLOR_MAP[pillarId],
                    sysmlType: el.type,
                    elementName: el.name,
                    metadata: metadata
                };

                // Set parent for compound nodes in hierarchy mode
                if (parentId) {
                    nodeData.parent = parentId;
                }

                cyElements.push({
                    group: 'nodes',
                    data: nodeData
                });

                // Membership edges removed - pillar containers are now hidden

                // Recursively add children (excluding metadata elements)
                if (el.children && el.children.length > 0) {
                    const nonMetadataChildren = el.children.filter(child =>
                        !isMetadataElement(child.type)
                    );
                    if (nonMetadataChildren.length > 0) {
                        buildHierarchicalNodes(nonMetadataChildren, nodeId, cyElements, stats, pillarId);
                    }
                }
            });

            return cyElements;
        }

        function createLinksFromHierarchy(elements, parent = null, links = []) {
            elements.forEach(el => {
                if (parent) {
                    links.push({ source: parent.name, target: el.name });
                }
                if (el.children && el.children.length > 0) {
                    createLinksFromHierarchy(el.children, el, links);
                }
            });
            return links;
        }
        function filterElements(query) {
            if (!currentData || (!currentData.elements && !currentData.pillarElements)) return;

            const searchTerm = query.toLowerCase().trim();

            if (searchTerm === '') {
                // Reset to show all elements
                filteredData = null;
                document.getElementById('status-text').textContent = 'Ready • Use filter to search elements';
            } else {
                // Filter elements based on name, type, or properties
                const filteredDiagramElements = currentData.elements
                    ? filterElementsRecursive(cloneElements(currentData.elements), searchTerm)
                    : [];

                filteredData = {
                    ...currentData,
                    elements: filteredDiagramElements
                };

                // Update status to show filter results
                const activeSource = currentData.elements;
                const activeFiltered = filteredDiagramElements;
                const totalElements = countAllElements(activeSource || []);
                const filteredCount = countAllElements(activeFiltered || []);
                document.getElementById('status-text').textContent =
                    'Filtering: ' + filteredCount + ' of ' + totalElements + ' elements match "' + searchTerm + '"';
            }

            // Re-render the current view with filtered/unfiltered data
            if (currentView) {
                renderVisualization(currentView);
            }
        }

        function countAllElements(elements) {
            if (!elements) {
                return 0;
            }
            let count = elements.length;
            elements.forEach(element => {
                if (element.children && element.children.length > 0) {
                    count += countAllElements(element.children);
                }
            });
            return count;
        }

        function filterElementsRecursive(elements, searchTerm) {
            return elements.filter(element => {
                // Check if element matches search term
                const nameMatch = element.name.toLowerCase().includes(searchTerm);
                const typeMatch = element.type.toLowerCase().includes(searchTerm);

                // Check properties
                let propertyMatch = false;
                if (element.properties) {
                    for (const [key, value] of Object.entries(element.properties)) {
                        if (key.toLowerCase().includes(searchTerm) ||
                            String(value).toLowerCase().includes(searchTerm)) {
                            propertyMatch = true;
                            break;
                        }
                    }
                }

                // Check children recursively
                let hasMatchingChildren = false;
                if (element.children && element.children.length > 0) {
                    const filteredChildren = filterElementsRecursive(element.children, searchTerm);
                    if (filteredChildren.length > 0) {
                        element.children = filteredChildren; // Update children to filtered ones
                        hasMatchingChildren = true;
                    }
                }

                return nameMatch || typeMatch || propertyMatch || hasMatchingChildren;
            });
        }

        function getHighlightedSvgBounds() {
            if (!g) {
                return null;
            }

            const highlighted = Array.from(g.node().querySelectorAll('.highlighted-element, .selected'));
            if (highlighted.length === 0) {
                return null;
            }

            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            highlighted.forEach(element => {
                if (!element || typeof element.getBBox !== 'function') {
                    return;
                }
                try {
                    const bbox = element.getBBox();
                    if (!bbox || (bbox.width === 0 && bbox.height === 0)) {
                        return;
                    }
                    minX = Math.min(minX, bbox.x);
                    minY = Math.min(minY, bbox.y);
                    maxX = Math.max(maxX, bbox.x + bbox.width);
                    maxY = Math.max(maxY, bbox.y + bbox.height);
                } catch (e) {
                    // Some elements might not support getBBox
                    return;
                }
            });

            if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
                return null;
            }

            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }

        function resetZoom() {
            if (currentView === 'sysml' && cy) {
                cy.reset();
                fitSysMLView(80, { preferSelection: false });
                return;
            }
            window.userHasManuallyZoomed = true; // Mark as manual interaction
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        }

        function zoomToFit(trigger = 'user') {
            const isAuto = trigger === 'auto';
            if (currentView === 'sysml' && cy) {
                fitSysMLView(80, { preferSelection: true });
                return;
            }
            if (!g || !svg) return;

            try {
                if (!isAuto) {
                    window.userHasManuallyZoomed = true;
                }

                const selectionBounds = getHighlightedSvgBounds();
                const bounds = selectionBounds || g.node().getBBox();
                if (!bounds || bounds.width === 0 || bounds.height === 0) return;

                const svgWidth = +svg.attr('width');
                const svgHeight = +svg.attr('height');

                // Use tighter padding for selections, default padding otherwise
                const basePadding = selectionBounds ? 0.06 : 0.08;
                const padding = Math.min(svgWidth, svgHeight) * basePadding;

                const scaleX = (svgWidth - 2 * padding) / bounds.width;
                const scaleY = (svgHeight - 2 * padding) / bounds.height;
                const scale = Math.min(scaleX, scaleY);

                // For selections, allow zooming in more; for full view, cap at 1x
                const maxScale = selectionBounds ? 3 : 1;
                const finalScale = Math.max(Math.min(scale, maxScale), MIN_CANVAS_ZOOM);

                const centerX = svgWidth / 2;
                const centerY = svgHeight / 2;
                const boundsX = bounds.x + bounds.width / 2;
                const boundsY = bounds.y + bounds.height / 2;

                const translateX = centerX - boundsX * finalScale;
                const translateY = centerY - boundsY * finalScale;

                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity
                        .translate(translateX, translateY)
                        .scale(finalScale));
            } catch (error) {
                console.warn('Error in zoomToFit:', error);
                resetZoom();
            }
        }




        async function renderElkTreeView(width, height, data) {
            try {
                // Use provided data (which may be filtered) or fall back to currentData
                var elementsData = (data && data.elements) ? data.elements : (currentData ? currentData.elements : null);

                // Apply package filter if a specific package is selected
                if (selectedDiagramIndex > 0 && elementsData) {
                    // Find the selected package (same logic as updateDiagramSelector)
                    const packagesArray = [];
                    const seenPackages = new Set();

                // Find all packages recursively up to depth 3 (SysML v2 spec allows nested packages)
                function findPackagesForFilter(elementList, depth = 0) {
                    elementList.forEach(el => {
                        const typeLower = (el.type || '').toLowerCase();
                        if (typeLower.includes('package') && depth <= 3 && !seenPackages.has(el.name)) {
                            seenPackages.add(el.name);
                            packagesArray.push({ name: el.name, element: el });
                        }
                        // Recurse into all children to find nested packages
                        if (el.children && el.children.length > 0) {
                            findPackagesForFilter(el.children, depth + 1);
                        }
                    });
                }

                findPackagesForFilter(elementsData);

                // Get the selected package (index 0 is "All Packages", so subtract 1)
                const selectedPackageIdx = selectedDiagramIndex - 1;
                if (selectedPackageIdx >= 0 && selectedPackageIdx < packagesArray.length) {
                    const selectedPackage = packagesArray[selectedPackageIdx];

                    // Use only this package's contents
                    if (selectedPackage.element) {
                        elementsData = [selectedPackage.element];
                    }
                }
            }

                if (!elementsData || elementsData.length === 0) {
                    renderPlaceholderView(width, height, 'General View',
                        'No elements to display.\\n\\nThe parser did not return any elements.',
                        currentData);
                    return;
                }

                // Types to skip at top level (packages only - show their children)
                var PACKAGE_TYPES = new Set(['package', 'library package', 'standard library package']);

                // Collect top-level elements (skip packages, show their immediate children)
                var topLevelElements = [];
                var elementMap = new Map();
                var portToOwner = new Map();
                var defElements = new Map(); // Track part defs separately
                var partToDefLinks = []; // Track part to part def relationships

                // Track which attributes/ports are children of other elements
                var childAttributeNames = new Set();
                var childPortNames = new Set();

                function collectChildAttributesAndPorts(elements) {
                    if (!elements || !Array.isArray(elements)) return;
                    elements.forEach(function(el) {
                        if (!el) return;
                        if (el.children && el.children.length > 0) {
                            el.children.forEach(function(child) {
                                if (!child || !child.name) return;
                                var cType = (child.type || '').toLowerCase();
                                if (cType === 'attribute' || cType.includes('attribute')) {
                                    childAttributeNames.add(child.name);
                                }
                                if (cType === 'port' || cType.includes('port')) {
                                    childPortNames.add(child.name);
                                }
                            });
                        }
                        if (el.children) collectChildAttributesAndPorts(el.children);
                    });
                }

                function findTopLevelElements(elements, depth) {
                    if (!elements || !Array.isArray(elements)) return;
                    elements.forEach(function(el) {
                        if (!el || !el.name) return;
                        var typeLower = (el.type || '').toLowerCase().trim();

                        // Skip packages - look at their children
                        if (PACKAGE_TYPES.has(typeLower) || typeLower.includes('package')) {
                            if (el.children) findTopLevelElements(el.children, depth);
                            return;
                        }

                        // Skip attributes/ports that are already shown as children of other nodes
                        if ((typeLower === 'attribute' || typeLower.includes('attribute')) && childAttributeNames.has(el.name)) {
                            return;
                        }
                        if ((typeLower === 'port' || typeLower.includes('port')) && childPortNames.has(el.name)) {
                            return;
                        }

                        // Apply category filter for top-level display
                        var category = getCategoryForType(typeLower);
                        if (!expandedGeneralCategories.has(category)) {
                            // Even if category not expanded, still recurse into children to find nested elements
                            if (el.children) findTopLevelElements(el.children, depth + 1);
                            return;
                        }

                        // Add all elements that match the category filter, regardless of depth
                        // This allows nested parts like camera.optics, camera.imaging to be shown
                        topLevelElements.push(el);
                        elementMap.set(el.name, el);

                        // Track definitions separately
                        if (typeLower.includes('def')) {
                            defElements.set(el.name, el);
                        }

                        // Recursively find nested elements (parts within parts)
                        if (el.children) findTopLevelElements(el.children, depth + 1);
                    });
                }

                // Collect part-to-def relationships from all elements
                function collectPartToDefLinks(elements, parentElement) {
                    if (!elements) return;
                    elements.forEach(function(el) {
                        if (!el || !el.name) return;
                        var typeLower = (el.type || '').toLowerCase().trim();

                        // Skip packages
                        if (PACKAGE_TYPES.has(typeLower) || typeLower.includes('package')) {
                            if (el.children) collectPartToDefLinks(el.children, null);
                            return;
                        }

                        // Track if this element is a part def or part usage
                        var isPartDef = typeLower.includes('part') && typeLower.includes('def');
                        var isPartUsage = typeLower.includes('part') && !typeLower.includes('def');

                        // If we have a parent element and this is a part, add containment relationship
                        // This captures both def→part and part→part containment
                        if (parentElement && isPartUsage) {
                            partToDefLinks.push({
                                source: parentElement,
                                target: el.name,
                                type: 'contains'
                            });
                        }

                        // Check for specialization relationships (:>)
                        if (el.relationships) {
                            el.relationships.forEach(function(rel) {
                                if (rel.type === 'specializes' && rel.target) {
                                    partToDefLinks.push({
                                        source: el.name,
                                        target: rel.target,
                                        type: 'specializes'
                                    });
                                }
                            });
                        }

                        // Check for type reference (part x:TypeName) - check multiple possible locations
                        var partType = null;
                        if (el.attributes && el.attributes.get) {
                            partType = el.attributes.get('partType') || el.attributes.get('type') || el.attributes.get('typedBy');
                        }
                        // Also check direct property
                        if (!partType && el.partType) {
                            partType = el.partType;
                        }
                        // Also check typing property (set by parser for typed parts)
                        if (!partType && el.typing) {
                            partType = el.typing;
                        }
                        // Check if the element has a colon-separated type in its full definition
                        if (!partType && el.fullText) {
                            // Note: Double-escaped for template literal
                            var typeMatch = el.fullText.match(/:\\s*([A-Z][a-zA-Z0-9_]*)/);
                            if (typeMatch) partType = typeMatch[1];
                        }

                        if (partType && !typeLower.includes('def')) {
                            partToDefLinks.push({
                                source: el.name,
                                target: partType,
                                type: 'typed by'
                            });
                        }

                        // Recurse with current element as parent if it's a part def or part usage
                        // This allows tracking containment for nested parts (e.g., camera.optics)
                        var nextParent = (isPartDef || isPartUsage) ? el.name : parentElement;
                        if (el.children) collectPartToDefLinks(el.children, nextParent);
                    });
                }

                // Calculate type stats for filter chips
                var typeStats = {};
                function calculateTypeStats(elements) {
                    if (!elements) return;
                    elements.forEach(function(el) {
                        if (!el || !el.type) return;
                        var typeLower = (el.type || '').toLowerCase().trim();
                        if (PACKAGE_TYPES.has(typeLower) || typeLower.includes('package')) {
                            if (el.children) calculateTypeStats(el.children);
                            return;
                        }
                        var category = getCategoryForType(typeLower);
                        typeStats[category] = (typeStats[category] || 0) + 1;
                        if (el.children) calculateTypeStats(el.children);
                    });
                }
                calculateTypeStats(elementsData);
                renderGeneralChips(typeStats);
                // First collect all attributes/ports that are children of other elements
                collectChildAttributesAndPorts(elementsData);
                findTopLevelElements(elementsData, 0);
                collectPartToDefLinks(elementsData, null);

                if (topLevelElements.length === 0) {
                    renderPlaceholderView(width, height, 'General View',
                        'No matching elements to display.\\n\\nTry enabling more categories using the filter chips above.',
                        currentData);
                    return;
                }

                // Layout settings
                var nodeWidth = 150;
                var nodeBaseHeight = 44;
                var lineHeight = 13;
                var sectionGap = 5;
                var padding = 20;
                var hSpacing = 30;
                var vSpacing = 30;
                var maxTextWidth = nodeWidth - 16;

                // Helper to truncate text to fit width
                function truncateText(text, maxChars) {
                    if (!text) return '';
                    if (text.length <= maxChars) return text;
                    return text.substring(0, maxChars - 2) + '..';
                }

                // Helper to collect content for a node
                function collectNodeContent(el) {
                    var sections = [];
                    var attrLines = [];
                    var portLines = [];
                    var partLines = [];
                    var actionLines = [];
                    var otherLines = [];
                    var docLines = [];
                    var subjectLines = [];
                    var stakeholderLines = [];
                    var constraintLines = [];

                    var typeLower = (el.type || '').toLowerCase();
                    var isRequirement = typeLower.includes('requirement');

                    // Extract doc/documentation from attributes or direct property
                    var doc = null;
                    // Note: attributes is serialized as a plain object, not a Map
                    if (el.attributes) {
                        if (typeof el.attributes.get === 'function') {
                            doc = el.attributes.get('doc') || el.attributes.get('documentation') || el.attributes.get('text');
                        } else {
                            doc = el.attributes.doc || el.attributes.documentation || el.attributes.text;
                        }
                    }
                    if (!doc && el.documentation) doc = el.documentation;
                    if (!doc && el.text) doc = el.text;

                    // Also check for doc children (SysML doc elements are child nodes)
                    if (!doc && el.children && el.children.length > 0) {
                        for (var i = 0; i < el.children.length; i++) {
                            var child = el.children[i];
                            if (child && child.type && child.type.toLowerCase() === 'doc') {
                                // First check the 'content' attribute which contains the extracted doc text
                                if (child.attributes) {
                                    if (typeof child.attributes.get === 'function') {
                                        doc = child.attributes.get('content');
                                    } else {
                                        doc = child.attributes.content;
                                    }
                                }
                                // Fallback to fullText or name
                                if (!doc) {
                                    doc = child.fullText || child.name || '';
                                    // Try to get the doc comment content from fullText
                                    if (doc && doc.includes('/*')) {
                                        var startIdx = doc.indexOf('/*');
                                        var endIdx = doc.indexOf('*/');
                                        if (startIdx >= 0 && endIdx > startIdx) {
                                            doc = doc.substring(startIdx + 2, endIdx).trim();
                                        }
                                    }
                                }
                                if (doc) break;
                            }
                        }
                    }

                    if (doc && typeof doc === 'string') {
                        // Clean up doc string (remove /* */ and extra whitespace)
                        // Use string split/join to avoid regex escaping issues in template literals
                        var cleanDoc = doc.split('/*').join('').split('*/').join('').trim();
                        if (cleanDoc.length > 0) {
                            // Store full doc text - wrapping will be done at render time based on actual node width
                            // Mark as raw doc so renderer knows to wrap it
                            docLines.push({ type: 'doc', text: cleanDoc, rawDoc: true });
                        }
                    }

                    // Collect from children array - this is where SysML attributes/ports/parts are
                    if (el.children && el.children.length > 0) {
                        el.children.forEach(function(child) {
                            if (!child || !child.name) return;
                            var cType = (child.type || '').toLowerCase();

                            // Skip states, packages, and doc elements (doc already processed above)
                            if (cType.includes('state') || cType.includes('package') || cType === 'doc') return;

                            // For requirements, collect subject, stakeholder, constraint, and require constraint
                            if (isRequirement) {
                                if (cType === 'subject' || child.name === 'subject' || (child.attributes && child.attributes.get && child.attributes.get('isSubject'))) {
                                    var subjectType = child.typing || (child.attributes && child.attributes.get ? child.attributes.get('type') || child.attributes.get('typedBy') : '');
                                    subjectLines.push({ type: 'subject', text: '👤 ' + child.name + (subjectType ? ' : ' + subjectType : '') });
                                    return;
                                }
                                if (cType === 'stakeholder') {
                                    var stakeholderType = child.typing || (child.attributes && child.attributes.get ? child.attributes.get('type') || child.attributes.get('typedBy') : '');
                                    stakeholderLines.push({ type: 'stakeholder', text: '🏢 ' + child.name + (stakeholderType ? ' : ' + stakeholderType : ''), stakeholderType: stakeholderType });
                                    return;
                                }
                                if (cType.includes('constraint') || cType === 'require constraint' || cType === 'assume constraint') {
                                    var constraintExpr = child.attributes && child.attributes.get ? child.attributes.get('expression') || child.attributes.get('constraint') : '';
                                    var constraintText = child.name || constraintExpr || 'constraint';
                                    constraintLines.push({ type: 'constraint', text: '⚙ ' + constraintText });
                                    return;
                                }
                            }

                            // Collect SysML attributes
                            if (cType === 'attribute' || cType.includes('attribute')) {
                                var dataType = child.attributes && child.attributes.get ? child.attributes.get('dataType') : null;
                                var typeStr = dataType ? ' : ' + dataType.split('::').pop() : '';
                                attrLines.push({ type: 'attr', text: '◆ ' + child.name + typeStr });
                            }
                            // Collect ports
                            else if (cType === 'port' || cType.includes('port')) {
                                var portType = child.attributes && child.attributes.get ? child.attributes.get('portType') : null;
                                var pTypeStr = portType ? ' : ' + portType : '';
                                portLines.push({ type: 'port', name: child.name, text: '▢ ' + child.name + pTypeStr });
                                portToOwner.set(child.name, el.name);
                            }
                            // Collect parts
                            else if (cType.includes('part')) {
                                var partType = child.type ? child.type.split(' ').pop() : '';
                                partLines.push({ type: 'part', text: '■ ' + child.name + (partType ? ' : ' + partType : '') });
                            }
                            // Collect actions
                            else if (cType.includes('action')) {
                                actionLines.push({ type: 'action', text: '▶ ' + child.name });
                            }
                            // Collect nested requirements
                            else if (cType.includes('requirement')) {
                                otherLines.push({ type: 'req', text: '✓ ' + child.name });
                            }
                            // Collect interfaces/connections
                            else if (cType.includes('interface') || cType.includes('connect')) {
                                otherLines.push({ type: 'conn', text: '↔ ' + child.name });
                            }
                            // Collect constraints (for non-requirements)
                            else if (cType.includes('constraint')) {
                                constraintLines.push({ type: 'constraint', text: '⚙ ' + child.name });
                            }
                        });
                    }

                    // Also collect from dedicated ports array if present
                    if (el.ports && el.ports.length > 0) {
                        el.ports.forEach(function(p) {
                            var pName = typeof p === 'string' ? p : (p.name || 'port');
                            // Avoid duplicates
                            if (!portLines.some(function(pl) { return pl.name === pName; })) {
                                var pType = (typeof p === 'object' && p.portType) ? ' : ' + p.portType : '';
                                portLines.push({ type: 'port', name: pName, text: '▢ ' + pName + pType });
                                portToOwner.set(pName, el.name);
                            }
                        });
                    }

                    // Build sections - requirements get special ordering
                    if (isRequirement) {
                        if (docLines.length > 0) sections.push({ title: 'Documentation', lines: docLines.slice(0, 6) }); // More doc lines
                        if (subjectLines.length > 0) sections.push({ title: 'Subject', lines: subjectLines.slice(0, 3) });
                        if (stakeholderLines.length > 0) sections.push({ title: 'Stakeholder', lines: stakeholderLines.slice(0, 3) });
                        if (attrLines.length > 0) sections.push({ title: 'Attributes', lines: attrLines.slice(0, 8) });
                        if (constraintLines.length > 0) sections.push({ title: 'Constraints', lines: constraintLines.slice(0, 4) });
                        if (otherLines.length > 0) sections.push({ title: 'Nested Reqs', lines: otherLines.slice(0, 4) });
                    } else {
                        if (docLines.length > 0) {
                            sections.push({ title: 'Doc', lines: docLines.slice(0, 4) }); // More doc lines
                        }
                        if (attrLines.length > 0) sections.push({ title: 'Attributes', lines: attrLines.slice(0, 12) });
                        // Ports are now shown as boundary icons, not in compartment list
                        if (partLines.length > 0) sections.push({ title: 'Parts', lines: partLines.slice(0, 10) });
                        if (actionLines.length > 0) sections.push({ title: 'Actions', lines: actionLines.slice(0, 6) });
                        if (constraintLines.length > 0) sections.push({ title: 'Constraints', lines: constraintLines.slice(0, 3) });
                        if (otherLines.length > 0) sections.push({ title: 'Other', lines: otherLines.slice(0, 4) });
                    }

                    return sections;
                }

                // Calculate positions with proper grid layout (no overlapping)
                var nodePositions = new Map();
                var portPositions = new Map();

                // Calculate columns: minimum 4, scales up with window width
                var availableWidth = width - padding * 2;
                var maxColsByWidth = Math.max(4, Math.floor((availableWidth + hSpacing) / (nodeWidth + hSpacing)));
                var cols = Math.max(4, Math.min(maxColsByWidth, topLevelElements.length));

                // First pass: calculate all node heights and assign categories
                var nodeData = topLevelElements.map(function(el, index) {
                    var sections = collectNodeContent(el);
                    var totalLines = 0;
                    var lineMaxChars = Math.floor((nodeWidth - 20) / 5);
                    sections.forEach(function(s) {
                        totalLines += 1;
                        s.lines.forEach(function(line) {
                            if (line.rawDoc && line.type === 'doc') {
                                var estimatedLines = Math.ceil(line.text.length / (lineMaxChars - 3));
                                var maxDocLines = s.title === 'Documentation' ? 6 : 4;
                                totalLines += Math.min(estimatedLines, maxDocLines);
                            } else {
                                totalLines += 1;
                            }
                        });
                    });
                    var nodeHeight = Math.max(60, nodeBaseHeight + totalLines * lineHeight + sections.length * sectionGap);
                    var typeLower = (el.type || '').toLowerCase();
                    var category = getCategoryForType(typeLower);
                    return { el: el, sections: sections, height: nodeHeight, index: index, category: category };
                });

                // Group nodes by category, maintaining category order from GENERAL_VIEW_CATEGORIES
                var categoryOrder = GENERAL_VIEW_CATEGORIES.map(function(c) { return c.id; });
                var groupedNodes = {};
                categoryOrder.forEach(function(catId) {
                    groupedNodes[catId] = [];
                });
                nodeData.forEach(function(nd) {
                    if (!groupedNodes[nd.category]) {
                        groupedNodes[nd.category] = [];
                    }
                    groupedNodes[nd.category].push(nd);
                });

                // Flatten groups back into ordered array with category separators
                var orderedNodeData = [];
                var categoryStartPositions = new Map();
                var currentY = padding;
                var groupSpacing = showCategoryHeaders ? 40 : 0; // Extra space between category groups (only if headers shown)
                var categoryLabelHeight = showCategoryHeaders ? 25 : 0; // Height for category label (only if headers shown)

                categoryOrder.forEach(function(catId) {
                    var group = groupedNodes[catId];
                    if (!group || group.length === 0) return;

                    // Record start position for this category
                    categoryStartPositions.set(catId, { y: currentY, count: group.length });

                    // Add space for category label (only if headers shown)
                    currentY += categoryLabelHeight;

                    // Calculate row heights for this group
                    var groupRowHeights = [];
                    for (var i = 0; i < group.length; i += cols) {
                        var rowNodes = group.slice(i, Math.min(i + cols, group.length));
                        var maxHeight = Math.max.apply(null, rowNodes.map(function(n) { return n.height; }));
                        groupRowHeights.push(maxHeight);
                    }

                    // Assign positions within this group
                    group.forEach(function(nd, idx) {
                        var col = idx % cols;
                        var row = Math.floor(idx / cols);

                        var y = currentY;
                        for (var r = 0; r < row; r++) {
                            y += groupRowHeights[r] + vSpacing;
                        }

                        nodePositions.set(nd.el.name, {
                            x: padding + col * (nodeWidth + hSpacing),
                            y: y,
                            width: nodeWidth,
                            height: nd.height,
                            element: nd.el,
                            sections: nd.sections,
                            category: nd.category
                        });
                    });

                    // Update currentY for next group
                    var totalGroupHeight = 0;
                    groupRowHeights.forEach(function(h) { totalGroupHeight += h + vSpacing; });
                    currentY += totalGroupHeight + groupSpacing;
                });

                // Arrow marker
                var defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
                defs.selectAll('#general-arrow').remove();
                defs.append('marker')
                    .attr('id', 'general-arrow')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 8)
                    .attr('refY', 0)
                    .attr('markerWidth', 5)
                    .attr('markerHeight', 5)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-4L10,0L0,4')
                    .style('fill', 'var(--vscode-charts-blue)');

                // Draw category headers (only if enabled)
                if (showCategoryHeaders) {
                    var headerGroup = g.append('g').attr('class', 'category-headers');
                    categoryStartPositions.forEach(function(info, catId) {
                        var category = GENERAL_VIEW_CATEGORIES.find(function(c) { return c.id === catId; });
                        if (!category) return;

                        var headerG = headerGroup.append('g')
                            .attr('transform', 'translate(' + padding + ',' + info.y + ')');

                        // Category label with colored underline
                        headerG.append('text')
                            .attr('x', 0)
                            .attr('y', 16)
                            .style('font-size', '13px')
                            .style('font-weight', 'bold')
                            .style('fill', category.color)
                            .text(category.label + ' (' + info.count + ')');

                        // Underline spanning the width
                        headerG.append('line')
                            .attr('x1', 0)
                            .attr('y1', 22)
                            .attr('x2', availableWidth)
                            .attr('y2', 22)
                            .style('stroke', category.color)
                            .style('stroke-width', '2px')
                            .style('opacity', 0.5);
                    });
                }

                // Draw nodes
                var nodeGroup = g.append('g').attr('class', 'general-nodes');

                nodePositions.forEach(function(pos, name) {
                    var el = pos.element;
                    var typeLower = (el.type || '').toLowerCase();
                    var typeColor = getTypeColor(el.type);
                    var isLibValidated = isLibraryValidated(el);
                    var isDefinition = typeLower.includes('def');
                    var isUsage = !isDefinition && (typeLower.includes('part') || typeLower.includes('action') || typeLower.includes('port'));

                    // Get the typed-by reference for usages (e.g., "part x : Vehicle")
                    var typedByName = null;
                    if (el.attributes && el.attributes.get) {
                        typedByName = el.attributes.get('partType') || el.attributes.get('type') || el.attributes.get('typedBy');
                    }
                    if (!typedByName && el.partType) typedByName = el.partType;

                    var nodeG = nodeGroup.append('g')
                        .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                        .attr('class', 'general-node' + (isDefinition ? ' definition-node' : ' usage-node'))
                        .style('cursor', 'pointer');

                    // Background - definitions have dashed border, usages have solid bold border
                    nodeG.append('rect')
                        .attr('class', 'node-background')
                        .attr('width', pos.width)
                        .attr('height', pos.height)
                        .attr('rx', isDefinition ? 4 : 8)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', isLibValidated ? '#4EC9B0' : typeColor)
                        .style('stroke-width', isUsage ? '3px' : '2px')
                        .style('stroke-dasharray', isDefinition ? '6,3' : 'none');

                    // Type color bar at top
                    nodeG.append('rect')
                        .attr('width', pos.width)
                        .attr('height', 5)
                        .attr('rx', 2)
                        .style('fill', typeColor);

                    // Header background
                    nodeG.append('rect')
                        .attr('y', 5)
                        .attr('width', pos.width)
                        .attr('height', typedByName ? 36 : 28)
                        .style('fill', 'var(--vscode-button-secondaryBackground)');

                    // Stereotype - format according to SysML v2
                    var stereotype = (el.type || 'element');
                    // Simplify stereotype display
                    var stereoDisplay = stereotype;
                    if (typeLower.includes('part def')) stereoDisplay = 'part def';
                    else if (typeLower.includes('part')) stereoDisplay = 'part';
                    else if (typeLower.includes('port def')) stereoDisplay = 'port def';
                    else if (typeLower.includes('action def')) stereoDisplay = 'action def';
                    else if (typeLower.includes('action')) stereoDisplay = 'action';
                    else if (typeLower.includes('requirement def')) stereoDisplay = 'requirement def';
                    else if (typeLower.includes('requirement')) stereoDisplay = 'requirement';
                    else if (typeLower.includes('use case def')) stereoDisplay = 'use case def';
                    else if (typeLower.includes('use case')) stereoDisplay = 'use case';
                    else if (typeLower.includes('interface def')) stereoDisplay = 'interface def';
                    else if (typeLower.includes('interface')) stereoDisplay = 'interface';
                    else if (typeLower.includes('state def')) stereoDisplay = 'state def';
                    else if (typeLower.includes('state')) stereoDisplay = 'state';
                    else if (typeLower.includes('attribute def')) stereoDisplay = 'attribute def';
                    else if (typeLower.includes('attribute')) stereoDisplay = 'attribute';

                    nodeG.append('text')
                        .attr('x', pos.width / 2)
                        .attr('y', 17)
                        .attr('text-anchor', 'middle')
                        .text('\\u00AB' + stereoDisplay + '\\u00BB')
                        .style('font-size', '9px')
                        .style('fill', typeColor);

                    // Name - show with type if it's a usage (e.g., "partName : PartType")
                    var displayName = truncateText(name, 26);
                    nodeG.append('text')
                        .attr('x', pos.width / 2)
                        .attr('y', 31)
                        .attr('text-anchor', 'middle')
                        .text(displayName)
                        .style('font-size', '11px')
                        .style('font-weight', 'bold')
                        .style('fill', 'var(--vscode-editor-foreground)');

                    // Show typed-by reference below name for usages (e.g., ": Vehicle")
                    if (typedByName) {
                        nodeG.append('text')
                            .attr('x', pos.width / 2)
                            .attr('y', 43)
                            .attr('text-anchor', 'middle')
                            .text(': ' + truncateText(typedByName, 24))
                            .style('font-size', '10px')
                            .style('font-style', 'italic')
                            .style('fill', '#569CD6');
                    }

                    // Content start offset depends on whether we have typed-by
                    var contentStartY = typedByName ? 50 : 38;

                    // Clip path for content
                    var clipId = 'clip-' + name.replace(/[^a-zA-Z0-9]/g, '_');
                    defs.append('clipPath')
                        .attr('id', clipId)
                        .append('rect')
                        .attr('x', 4)
                        .attr('y', contentStartY)
                        .attr('width', pos.width - 8)
                        .attr('height', pos.height - contentStartY - 4);

                    var contentGroup = nodeG.append('g')
                        .attr('clip-path', 'url(#' + clipId + ')');

                    // Content sections
                    var yOffset = contentStartY + 8;
                    pos.sections.forEach(function(section) {
                        // Section title
                        contentGroup.append('text')
                            .attr('x', 8)
                            .attr('y', yOffset)
                            .text('─ ' + section.title + ' ─')
                            .style('font-size', '9px')
                            .style('font-weight', 'bold')
                            .style('fill', 'var(--vscode-descriptionForeground)');
                        yOffset += lineHeight;

                        // Section lines
                        section.lines.forEach(function(line) {
                            // Track port positions
                            if (line.type === 'port' && line.name) {
                                portPositions.set(line.name, {
                                    ownerName: name,
                                    x: pos.x,
                                    y: pos.y + yOffset,
                                    nodeWidth: pos.width
                                });
                            }

                            var fillColor = 'var(--vscode-descriptionForeground)';
                            if (line.type === 'port') fillColor = 'var(--vscode-charts-yellow)';
                            else if (line.type === 'part') fillColor = 'var(--vscode-charts-green)';
                            else if (line.type === 'action') fillColor = 'var(--vscode-charts-orange)';
                            else if (line.type === 'req') fillColor = 'var(--vscode-charts-blue)';
                            else if (line.type === 'attr') fillColor = 'var(--vscode-charts-lines)';
                            else if (line.type === 'doc') fillColor = 'var(--vscode-foreground)';
                            else if (line.type === 'subject') fillColor = 'var(--vscode-charts-purple)';
                            else if (line.type === 'constraint') fillColor = 'var(--vscode-charts-red)';

                            // Calculate max chars based on node width (approx 5px per char at 10px font for proportional text)
                            var lineMaxChars = Math.floor((pos.width - 20) / 5);

                            // Handle raw doc text - wrap into multiple lines at render time
                            if (line.rawDoc && line.type === 'doc') {
                                var docText = line.text;
                                var words = docText.split(/\\s+/);
                                var docLineTexts = [];
                                var currentDocLine = '';
                                var isFirst = true;
                                words.forEach(function(word) {
                                    var limit = isFirst ? lineMaxChars - 3 : lineMaxChars; // Account for emoji on first line
                                    if ((currentDocLine + ' ' + word).length > limit) {
                                        if (currentDocLine) {
                                            docLineTexts.push((isFirst ? '📄 ' : '') + currentDocLine);
                                            isFirst = false;
                                        }
                                        currentDocLine = word;
                                    } else {
                                        currentDocLine = currentDocLine ? currentDocLine + ' ' + word : word;
                                    }
                                });
                                if (currentDocLine) {
                                    docLineTexts.push((isFirst ? '📄 ' : '') + currentDocLine);
                                }
                                // Render each wrapped doc line (limit to 4 lines for non-req, 6 for req)
                                var maxDocLines = section.title === 'Documentation' ? 6 : 4;
                                docLineTexts.slice(0, maxDocLines).forEach(function(docLine) {
                                    contentGroup.append('text')
                                        .attr('x', 12)
                                        .attr('y', yOffset)
                                        .text(docLine)
                                        .style('font-size', '10px')
                                        .style('fill', fillColor);
                                    yOffset += lineHeight;
                                });
                            } else {
                                var lineText = truncateText(line.text, lineMaxChars);
                                contentGroup.append('text')
                                    .attr('x', 12)
                                    .attr('y', yOffset)
                                    .text(lineText)
                                    .style('font-size', '10px')
                                    .style('fill', fillColor);
                                yOffset += lineHeight;
                            }
                        });

                        yOffset += sectionGap;
                    });

                    // Click handlers
                    nodeG.on('click', function(event) {
                        event.stopPropagation();
                    }).on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({ command: 'jumpToElement', elementName: name });
                    });

                    // Draw ports on node boundary (SysML v2 notation)
                    var portSize = 10;
                    var portSpacing = 16;
                    var nodePorts = [];

                    // Collect ports for this node
                    if (el.children) {
                        el.children.forEach(function(child) {
                            if (!child || !child.name) return;
                            var cType = (child.type || '').toLowerCase();
                            if (cType === 'port' || cType.includes('port')) {
                                nodePorts.push({
                                    name: child.name,
                                    type: child.type,
                                    direction: child.attributes && child.attributes.get ?
                                        (child.attributes.get('direction') || 'inout') : 'inout'
                                });
                            }
                        });
                    }
                    if (el.ports) {
                        el.ports.forEach(function(p) {
                            var pName = typeof p === 'string' ? p : (p.name || 'port');
                            if (!nodePorts.some(function(np) { return np.name === pName; })) {
                                nodePorts.push({
                                    name: pName,
                                    type: 'port',
                                    direction: (typeof p === 'object' && p.direction) ? p.direction : 'inout'
                                });
                            }
                        });
                    }

                    // Draw ports on left and right edges
                    var leftPorts = [];
                    var rightPorts = [];
                    nodePorts.forEach(function(p, i) {
                        if (i % 2 === 0) leftPorts.push(p);
                        else rightPorts.push(p);
                    });

                    // Calculate port starting position - after header but with offset to avoid content overlap
                    var portStartY = Math.max(55, contentStartY + 10);

                    // Left side ports - draw port icons outside the content area (on node edge)
                    leftPorts.forEach(function(port, i) {
                        var py = portStartY + i * portSpacing;
                        if (py > pos.height - 20) return; // Don't draw if outside node

                        // Port square on boundary (positioned at edge)
                        nodeG.append('rect')
                            .attr('class', 'port-icon')
                            .attr('x', -portSize / 2)
                            .attr('y', py - portSize / 2)
                            .attr('width', portSize)
                            .attr('height', portSize)
                            .style('fill', port.direction === 'in' ? '#C586C0' :
                                          (port.direction === 'out' ? '#4EC9B0' : '#9CDCFE'))
                            .style('stroke', 'var(--vscode-editor-background)')
                            .style('stroke-width', '1px');

                        // Port label - positioned outside node to the left
                        nodeG.append('text')
                            .attr('x', -portSize - 3)
                            .attr('y', py + 3)
                            .attr('text-anchor', 'end')
                            .text(port.name)
                            .style('font-size', '8px')
                            .style('fill', '#C586C0');

                        // Store port position for connection routing
                        portPositions.set(port.name, {
                            ownerName: name,
                            x: pos.x,
                            y: pos.y + py,
                            side: 'left'
                        });
                    });

                    // Right side ports
                    rightPorts.forEach(function(port, i) {
                        var py = portStartY + i * portSpacing;
                        if (py > pos.height - 20) return;

                        nodeG.append('rect')
                            .attr('class', 'port-icon')
                            .attr('x', pos.width - portSize / 2)
                            .attr('y', py - portSize / 2)
                            .attr('width', portSize)
                            .attr('height', portSize)
                            .style('fill', port.direction === 'in' ? '#C586C0' :
                                          (port.direction === 'out' ? '#4EC9B0' : '#9CDCFE'))
                            .style('stroke', 'var(--vscode-editor-background)')
                            .style('stroke-width', '1px');

                        // Port label - positioned outside node to the right
                        nodeG.append('text')
                            .attr('x', pos.width + portSize + 3)
                            .attr('y', py + 3)
                            .attr('text-anchor', 'start')
                            .text(port.name)
                            .style('font-size', '8px')
                            .style('fill', '#C586C0');

                        portPositions.set(port.name, {
                            ownerName: name,
                            x: pos.x + pos.width,
                            y: pos.y + py,
                            side: 'right'
                        });
                    });
                });

                // Draw edges
                var edgeGroup = g.insert('g', ':first-child').attr('class', 'general-edges');
                var connections = [];

                // Add specialization arrow marker (hollow triangle for :>)
                defs.selectAll('#general-specializes').remove();
                defs.append('marker')
                    .attr('id', 'general-specializes')
                    .attr('viewBox', '0 -6 12 12')
                    .attr('refX', 11)
                    .attr('refY', 0)
                    .attr('markerWidth', 8)
                    .attr('markerHeight', 8)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-5L10,0L0,5Z')
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', '#C586C0')
                    .style('stroke-width', '1.5px');

                // Add typed-by arrow marker (solid filled for :)
                defs.selectAll('#general-typed-by').remove();
                defs.append('marker')
                    .attr('id', 'general-typed-by')
                    .attr('viewBox', '0 -5 10 10')
                    .attr('refX', 9)
                    .attr('refY', 0)
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M0,-4L10,0L0,4Z')
                    .style('fill', '#569CD6');

                // Add contains marker (filled diamond for composition)
                defs.selectAll('#general-contains').remove();
                defs.append('marker')
                    .attr('id', 'general-contains')
                    .attr('viewBox', '-6 -6 12 12')
                    .attr('refX', 0)
                    .attr('refY', 0)
                    .attr('markerWidth', 8)
                    .attr('markerHeight', 8)
                    .attr('orient', 'auto')
                    .append('path')
                    .attr('d', 'M-5,0L0,-4L5,0L0,4Z')
                    .style('fill', '#4EC9B0');

                // Add connect marker (no arrow, just line end)
                defs.selectAll('#general-connect').remove();
                defs.append('marker')
                    .attr('id', 'general-connect')
                    .attr('viewBox', '0 -4 8 8')
                    .attr('refX', 4)
                    .attr('refY', 0)
                    .attr('markerWidth', 6)
                    .attr('markerHeight', 6)
                    .attr('orient', 'auto')
                    .append('circle')
                    .attr('cx', 4)
                    .attr('cy', 0)
                    .attr('r', 3)
                    .style('fill', '#D7BA7D');

                // Collect relationships
                function collectRelationships(elements) {
                    if (!elements) return;
                    elements.forEach(function(el) {
                        if (el.relationships) {
                            el.relationships.forEach(function(rel) {
                                var tgt = rel.target || rel.relatedElement;
                                if (elementMap.has(el.name) && elementMap.has(tgt)) {
                                    connections.push({
                                        source: el.name,
                                        target: tgt,
                                        type: rel.type || 'relates'
                                    });
                                }
                            });
                        }
                        if (el.children) collectRelationships(el.children);
                    });
                }
                collectRelationships(elementsData);

                // Add part-to-def links (specialization / typed-by / contains relationships)
                partToDefLinks.forEach(function(link) {
                    if (elementMap.has(link.source) && elementMap.has(link.target)) {
                        connections.push({
                            source: link.source,
                            target: link.target,
                            type: link.type,
                            isSpecialization: link.type === 'specializes',
                            isTypedBy: link.type === 'typed by',
                            isContains: link.type === 'contains'
                        });
                    }
                });

                // Draw connections with orthogonal routing
                var drawnEdges = new Set();
                var edgeOffsets = {}; // Track offsets for parallel edges

                connections.forEach(function(conn) {
                    var srcPos = nodePositions.get(conn.source);
                    var tgtPos = nodePositions.get(conn.target);
                    if (!srcPos || !tgtPos || conn.source === conn.target) return;

                    var edgeKey = conn.source + '->' + conn.target;
                    var reverseKey = conn.target + '->' + conn.source;
                    if (drawnEdges.has(edgeKey)) return;
                    drawnEdges.add(edgeKey);

                    // Calculate edge offset for parallel edges
                    var pairKey = [conn.source, conn.target].sort().join('--');
                    edgeOffsets[pairKey] = (edgeOffsets[pairKey] || 0) + 1;
                    var offset = (edgeOffsets[pairKey] - 1) * 15;

                    var srcCx = srcPos.x + srcPos.width / 2;
                    var srcCy = srcPos.y + srcPos.height / 2;
                    var tgtCx = tgtPos.x + tgtPos.width / 2;
                    var tgtCy = tgtPos.y + tgtPos.height / 2;
                    var dx = tgtCx - srcCx;
                    var dy = tgtCy - srcCy;

                    // Determine exit/entry points based on relative positions
                    var x1, y1, x2, y2;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        // Horizontal routing
                        x1 = dx > 0 ? srcPos.x + srcPos.width : srcPos.x;
                        y1 = srcCy + offset;
                        x2 = dx > 0 ? tgtPos.x : tgtPos.x + tgtPos.width;
                        y2 = tgtCy + offset;
                    } else {
                        // Vertical routing
                        x1 = srcCx + offset;
                        y1 = dy > 0 ? srcPos.y + srcPos.height : srcPos.y;
                        x2 = tgtCx + offset;
                        y2 = dy > 0 ? tgtPos.y : tgtPos.y + tgtPos.height;
                    }

                    // Build orthogonal path
                    var midX = (x1 + x2) / 2;
                    var midY = (y1 + y2) / 2;
                    var pathD;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        pathD = 'M' + x1 + ',' + y1 + ' L' + midX + ',' + y1 + ' L' + midX + ',' + y2 + ' L' + x2 + ',' + y2;
                    } else {
                        pathD = 'M' + x1 + ',' + y1 + ' L' + x1 + ',' + midY + ' L' + x2 + ',' + midY + ' L' + x2 + ',' + y2;
                    }

                    // Style based on relationship type - SysML v2 compliant
                    var strokeColor, strokeDash, markerEnd, strokeWidth;

                    if (conn.isSpecialization) {
                        // :> specialization - purple hollow triangle
                        strokeColor = '#C586C0';
                        strokeDash = 'none';
                        markerEnd = 'url(#general-specializes)';
                        strokeWidth = '1.5px';
                    } else if (conn.isTypedBy || conn.type === 'typed by') {
                        // : typed-by - blue dashed with solid arrow
                        strokeColor = '#569CD6';
                        strokeDash = '5,3';
                        markerEnd = 'url(#general-typed-by)';
                        strokeWidth = '1.5px';
                    } else if (conn.isContains || conn.type === 'contains') {
                        // contains - green solid with filled diamond
                        strokeColor = '#4EC9B0';
                        strokeDash = 'none';
                        markerEnd = 'url(#general-contains)';
                        strokeWidth = '1.5px';
                    } else if (conn.type === 'connect' || conn.type === 'interface') {
                        // connect/interface - gold with circle end
                        strokeColor = '#D7BA7D';
                        strokeDash = 'none';
                        markerEnd = 'url(#general-connect)';
                        strokeWidth = '2px';
                    } else if (conn.type === 'bind') {
                        // bind - gray dotted
                        strokeColor = '#808080';
                        strokeDash = '2,2';
                        markerEnd = 'none';
                        strokeWidth = '1px';
                    } else if (conn.type === 'allocate') {
                        // allocate - dashed with arrow
                        strokeColor = '#D4D4D4';
                        strokeDash = '8,4';
                        markerEnd = 'url(#general-arrow)';
                        strokeWidth = '1.5px';
                    } else if (conn.type === 'flow') {
                        // flow - solid with filled arrow
                        strokeColor = '#4EC9B0';
                        strokeDash = 'none';
                        markerEnd = 'url(#general-arrow)';
                        strokeWidth = '2px';
                    } else {
                        // default relationship
                        strokeColor = 'var(--vscode-charts-blue)';
                        strokeDash = 'none';
                        markerEnd = 'url(#general-arrow)';
                        strokeWidth = '1.5px';
                    }

                    edgeGroup.append('path')
                        .attr('d', pathD)
                        .attr('class', 'relationship-edge')
                        .style('fill', 'none')
                        .style('stroke', strokeColor)
                        .style('stroke-width', strokeWidth)
                        .style('stroke-dasharray', strokeDash)
                        .style('opacity', 0.85)
                        .style('marker-end', markerEnd);

                    // Add label at midpoint with SysML v2 notation
                    if (conn.type) {
                        var labelX = Math.abs(dx) > Math.abs(dy) ? midX : (x1 + x2) / 2;
                        var labelY = Math.abs(dx) > Math.abs(dy) ? (y1 + y2) / 2 - 6 : midY - 6;

                        // Use SysML v2 notation symbols
                        var labelText = conn.type;
                        if (conn.isSpecialization || conn.type === 'specializes') labelText = ':>';
                        else if (conn.isTypedBy || conn.type === 'typed by') labelText = ':';
                        else if (conn.isContains || conn.type === 'contains') labelText = '◆';
                        else if (conn.type === 'connect') labelText = 'connect';
                        else if (conn.type === 'bind') labelText = '=';
                        else if (conn.type === 'allocate') labelText = '\\u00ABallocate\\u00BB';
                        else if (conn.type === 'flow') labelText = 'flow';
                        else if (conn.type.length > 12) labelText = conn.type.substring(0, 10) + '..';

                        // Add background for label readability
                        var labelBg = edgeGroup.append('rect')
                            .attr('x', labelX - 20)
                            .attr('y', labelY - 8)
                            .attr('width', 40)
                            .attr('height', 12)
                            .attr('rx', 2)
                            .style('fill', 'var(--vscode-editor-background)')
                            .style('opacity', 0.9);

                        edgeGroup.append('text')
                            .attr('x', labelX)
                            .attr('y', labelY)
                            .attr('text-anchor', 'middle')
                            .text(labelText)
                            .style('font-size', '9px')
                            .style('font-weight', 'bold')
                            .style('fill', strokeColor);
                    }
                });

                // Collect and draw port-to-port connections from connection/interface children
                var portConnections = [];
                function collectPortConnections(elements) {
                    if (!elements) return;
                    elements.forEach(function(el) {
                        var elType = (el.type || '').toLowerCase();
                        // Look for connection, interface, connect, or bind type elements
                        if (elType.includes('connection') || elType.includes('interface') || elType.includes('connect') || elType === 'bind') {
                            // Check for 'from' and 'to' in attributes (from parser)
                            var fromAttr = el.attributes && el.attributes.get ? el.attributes.get('from') : (el.attributes && el.attributes.from);
                            var toAttr = el.attributes && el.attributes.get ? el.attributes.get('to') : (el.attributes && el.attributes.to);
                            if (fromAttr && toAttr) {
                                // Extract port names (handle qualified names like part.port)
                                var fromPort = fromAttr.split('.').pop();
                                var toPort = toAttr.split('.').pop();
                                portConnections.push({
                                    name: el.name,
                                    fromPort: fromPort,
                                    toPort: toPort,
                                    fromFull: fromAttr,
                                    toFull: toAttr,
                                    type: elType === 'bind' ? 'bind' : 'connect'
                                });
                            }
                        }

                        // Also check children for 'end' declarations (SysML v2 connection syntax)
                        if (el.children && el.children.length > 0 && (elType.includes('connection') || elType.includes('interface'))) {
                            var ends = [];
                            el.children.forEach(function(child) {
                                var childType = (child.type || '').toLowerCase();
                                if (childType === 'end' || child.name === 'end') {
                                    var ref = child.attributes && child.attributes.get ? child.attributes.get('reference') || child.attributes.get('typedBy') : '';
                                    if (!ref && child.attributes) ref = child.attributes.reference || child.attributes.typedBy || '';
                                    if (ref) ends.push(ref);
                                }
                            });
                            if (ends.length >= 2) {
                                portConnections.push({
                                    name: el.name,
                                    fromPort: ends[0].split('.').pop(),
                                    toPort: ends[1].split('.').pop(),
                                    fromFull: ends[0],
                                    toFull: ends[1],
                                    type: 'connect'
                                });
                            }
                        }

                        // Recursively check children
                        if (el.children) collectPortConnections(el.children);
                    });
                }
                collectPortConnections(elementsData);

                // Draw port-to-port connections
                portConnections.forEach(function(pConn) {
                    var fromPos = portPositions.get(pConn.fromPort);
                    var toPos = portPositions.get(pConn.toPort);

                    if (!fromPos || !toPos) return; // Skip if ports not found

                    // Draw connection line between ports
                    var x1 = fromPos.x;
                    var y1 = fromPos.y;
                    var x2 = toPos.x;
                    var y2 = toPos.y;

                    // Add some offset from node edge for cleaner routing
                    if (fromPos.side === 'left') x1 -= 5;
                    else if (fromPos.side === 'right') x1 += 5;
                    if (toPos.side === 'left') x2 -= 5;
                    else if (toPos.side === 'right') x2 += 5;

                    // Calculate orthogonal path
                    var midX = (x1 + x2) / 2;
                    var midY = (y1 + y2) / 2;
                    var dx = x2 - x1;
                    var dy = y2 - y1;

                    var pathD;
                    if (Math.abs(dx) > Math.abs(dy)) {
                        pathD = 'M' + x1 + ',' + y1 + ' L' + midX + ',' + y1 + ' L' + midX + ',' + y2 + ' L' + x2 + ',' + y2;
                    } else {
                        pathD = 'M' + x1 + ',' + y1 + ' L' + x1 + ',' + midY + ' L' + x2 + ',' + midY + ' L' + x2 + ',' + y2;
                    }

                    // Different styles for bind vs connect
                    var isBind = pConn.type === 'bind';
                    var strokeColor = isBind ? '#569CD6' : '#D7BA7D'; // Blue for bind, Gold for connect
                    var strokeDash = isBind ? '4,2' : 'none'; // Dashed for bind, solid for connect

                    // Draw the port connection edge
                    edgeGroup.append('path')
                        .attr('d', pathD)
                        .attr('class', 'port-connection-edge')
                        .style('fill', 'none')
                        .style('stroke', strokeColor)
                        .style('stroke-width', '2px')
                        .style('stroke-dasharray', strokeDash)
                        .style('opacity', 0.9)
                        .style('marker-end', 'url(#general-connect)')
                        .style('marker-start', 'url(#general-connect)');

                    // Add connection label if named
                    if (pConn.name) {
                        edgeGroup.append('text')
                            .attr('x', midX)
                            .attr('y', midY - 6)
                            .attr('text-anchor', 'middle')
                            .text(pConn.name.length > 15 ? pConn.name.substring(0, 13) + '..' : pConn.name)
                            .style('font-size', '8px')
                            .style('fill', strokeColor)
                            .style('font-style', 'italic');
                    }
                });

            } catch (error) {
                console.error('[General] Error:', error);
                renderPlaceholderView(width, height, 'General View',
                    'An error occurred while rendering.\\n\\nError: ' + (error.message || 'Unknown error'),
                    currentData);
            }
        }

        function renderSimpleElkFallback(width, height) {
            // Simple fallback if ELK fails to load
            const fallbackText = g.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .text('ELK Layout Engine not available - please refresh')
                .style('font-size', '16px')
                .style('fill', 'var(--vscode-errorForeground)');
        }

        function expandElkNodeDetails(nodeData, nodeElement, layoutNode) {
            // Remove any existing expanded details
            g.selectAll('.expanded-details').remove();

            // Remove selection styling from all nodes
            g.selectAll('.elk-node-bg')
                .each(function(d) {
                    const node = d3.select(this);
                    const parentNode = d3.select(this.parentNode);
                    const nodeProps = parentNode.datum().properties;
                    const isLibValidated = isLibraryValidated(nodeProps.element);
                    const borderColor = isLibValidated ? 'var(--vscode-charts-green)' : 'var(--vscode-panel-border)';
                    const isRoot = !g.selectAll('.elk-edge').nodes().some(edge => {
                        return edge.__data__ && edge.__data__.targets &&
                               edge.__data__.targets.includes(parentNode.datum().id);
                    });
                    const borderWidth = isLibValidated ? '3px' : (isRoot ? '3px' : '2px');
                    node.style('stroke', borderColor)
                        .style('stroke-width', borderWidth);
                });
            g.selectAll('.elk-node').classed('selected', false);

            // Add selection styling to clicked node
            nodeElement.select('.elk-node-bg')
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', '4px');
            nodeElement.classed('selected', true);

            // Position details panel
            const detailsX = layoutNode.x + layoutNode.width + 25;
            const detailsY = layoutNode.y;

            // Create advanced details panel
            const detailsGroup = g.append('g')
                .attr('class', 'expanded-details')
                .attr('transform', 'translate(' + detailsX + ',' + detailsY + ')');

            // Panel background with enhanced styling
            detailsGroup.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 320)
                .attr('height', 200)
                .attr('rx', 15)
                .style('fill', 'var(--vscode-editor-background)')
                .style('stroke', 'var(--vscode-charts-blue)')
                .style('stroke-width', '2px')
                .style('filter', 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))')
                .style('opacity', 0.98);

            // Enhanced close button
            const closeButton = detailsGroup.append('g')
                .attr('class', 'close-button')
                .attr('transform', 'translate(285, 18)')
                .style('cursor', 'pointer')
                .on('click', () => {
                    g.selectAll('.expanded-details').remove();
                    nodeElement.select('.elk-node-bg')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '2px');
                });

            closeButton.append('circle')
                .attr('r', 14)
                .style('fill', 'var(--vscode-charts-red)')
                .style('opacity', 0.9);

            closeButton.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .text('×')
                .style('fill', 'white')
                .style('font-size', '18px')
                .style('font-weight', 'bold')
                .style('pointer-events', 'none');

            // Content with enhanced layout
            const content = detailsGroup.append('g')
                .attr('class', 'details-content')
                .attr('transform', 'translate(25, 30)');

            let yPos = 0;

            // Enhanced title
            content.append('text')
                .attr('x', 0)
                .attr('y', yPos += 25)
                .text(nodeData.name)
                .style('font-size', '20px')
                .style('font-weight', 'bold')
                .style('fill', 'var(--vscode-editor-foreground)');

            // Type with enhanced styling
            content.append('text')
                .attr('x', 0)
                .attr('y', yPos += 35)
                .text('Type: ' + nodeData.type)
                .style('font-size', '14px')
                .style('fill', 'var(--vscode-descriptionForeground)');

            // Library validation info
            if (isLibraryValidated(nodeData.element)) {
                content.append('text')
                    .attr('x', 0)
                    .attr('y', yPos += 22)
                    .text('✓ Standard Library Type')
                    .style('font-size', '13px')
                    .style('fill', 'var(--vscode-charts-green)')
                    .style('font-weight', 'bold');

                const libKind = getLibraryKind(nodeData.element);
                if (libKind) {
                    content.append('text')
                        .attr('x', 0)
                        .attr('y', yPos += 18)
                        .text('Library Kind: ' + libKind)
                        .style('font-size', '12px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                }

                const libChain = getLibraryChain(nodeData.element);
                if (libChain) {
                    content.append('text')
                        .attr('x', 0)
                        .attr('y', yPos += 18)
                        .text('Specializes: ' + libChain)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-descriptionForeground)')
                        .style('font-style', 'italic');
                }
            }

            // Show documentation if available
            if (nodeData.element?.doc) {
                content.append('text')
                    .attr('x', 0)
                    .attr('y', yPos += 25)
                    .text('Doc: ' + nodeData.element.doc.substring(0, 60) + (nodeData.element.doc.length > 60 ? '...' : ''))
                    .style('font-size', '11px')
                    .style('fill', 'var(--vscode-descriptionForeground)')
                    .style('font-style', 'italic');
            }

            // Children info
            if (nodeData.children && nodeData.children.length > 0) {
                content.append('text')
                    .attr('x', 0)
                    .attr('y', yPos += 25)
                    .text('Children: ' + nodeData.children.length)
                    .style('font-size', '14px')
                    .style('fill', 'var(--vscode-descriptionForeground)');
            }

            // Enhanced action button
            const actionButton = content.append('g')
                .attr('class', 'action-button')
                .attr('transform', 'translate(0, ' + (yPos += 45) + ')')
                .style('cursor', 'pointer')
                .on('click', () => {
                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: nodeData.name
                    });
                });

            actionButton.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', 180)
                .attr('height', 40)
                .attr('rx', 10)
                .style('fill', 'var(--vscode-button-background)')
                .style('stroke', 'var(--vscode-button-border)')
                .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');

            actionButton.append('text')
                .attr('x', 90)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .text('Go to Definition')
                .style('fill', 'var(--vscode-button-foreground)')
                .style('font-size', '13px')
                .style('font-weight', '600')
                .style('pointer-events', 'none');
        }

        function renderSequenceView(width, height, data = currentData) {
            if (!data.sequenceDiagrams || data.sequenceDiagrams.length === 0) {
                // Show message when no sequence diagrams are found
                const messageGroup = g.append('g')
                    .attr('class', 'sequence-message');

                messageGroup.append('text')
                    .attr('x', width / 2)
                    .attr('y', height / 2)
                    .attr('text-anchor', 'middle')
                    .text('No sequence diagrams found in this SysML model')
                    .style('font-size', '18px')
                    .style('fill', 'var(--vscode-descriptionForeground)')
                    .style('font-weight', 'bold');

                messageGroup.append('text')
                    .attr('x', width / 2)
                    .attr('y', height / 2 + 30)
                    .attr('text-anchor', 'middle')
                    .text('Add "interaction def" elements to see sequence diagrams')
                    .style('font-size', '14px')
                    .style('fill', 'var(--vscode-descriptionForeground)');

                return;
            }

            // Render sequence diagrams
            const diagrams = data.sequenceDiagrams;
            let currentY = 50;

            diagrams.forEach((diagram, diagramIndex) => {
                // Create group for this sequence diagram
                const diagramGroup = g.append('g')
                    .attr('class', 'sequence-diagram')
                    .attr('transform', 'translate(0, ' + currentY + ')');

                // Diagram title
                diagramGroup.append('text')
                    .attr('x', width / 2)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .text(diagram.name)
                    .style('font-size', '20px')
                    .style('font-weight', 'bold')
                    .style('fill', 'var(--vscode-editor-foreground)')
                    .on('click', () => {
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: diagram.name
                        });
                    })
                    .style('cursor', 'pointer');

                // Calculate layout
                const participants = diagram.participants;
                const messages = diagram.messages;
                const participantWidth = Math.min(150, (width - 100) / participants.length);
                const participantSpacing = (width - 100) / Math.max(1, participants.length - 1);
                const messageHeight = 80;
                const diagramHeight = Math.max(400, messages.length * messageHeight + 200);

                // Draw participants (lifelines)
                participants.forEach((participant, i) => {
                    const participantX = 50 + (i * participantSpacing);
                    const isLibValidated = participant.element ? isLibraryValidated(participant.element) : false;
                    const borderColor = isLibValidated ? 'var(--vscode-charts-green)' : 'var(--vscode-panel-border)';
                    const borderWidth = isLibValidated ? '3px' : '2px';

                    const participantGroup = diagramGroup.append('g')
                        .attr('class', 'sequence-participant')
                        .attr('transform', 'translate(' + participantX + ', 40)');

                    // Participant box
                    participantGroup.append('rect')
                        .attr('x', -participantWidth/2)
                        .attr('y', 0)
                        .attr('width', participantWidth)
                        .attr('height', 60)
                        .attr('rx', 8)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', borderColor)
                        .style('stroke-width', borderWidth);

                    // Participant name
                    participantGroup.append('text')
                        .attr('x', 0)
                        .attr('y', 25)
                        .attr('text-anchor', 'middle')
                        .text(participant.name)
                        .style('font-size', '14px')
                        .style('font-weight', 'bold')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .on('click', () => {
                            vscode.postMessage({
                                command: 'jumpToElement',
                                elementName: participant.name
                            });
                        })
                        .style('cursor', 'pointer');

                    // Participant type
                    participantGroup.append('text')
                        .attr('x', 0)
                        .attr('y', 42)
                        .attr('text-anchor', 'middle')
                        .text('[' + participant.type + ']')
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-descriptionForeground)');

                    // Lifeline (vertical line)
                    participantGroup.append('line')
                        .attr('x1', 0)
                        .attr('y1', 60)
                        .attr('x2', 0)
                        .attr('y2', diagramHeight - 60)
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '2px')
                        .style('stroke-dasharray', '5,5');
                });

                // Draw messages
                messages.forEach((message, messageIndex) => {
                    const fromParticipant = participants.find(p => p.name === message.from);
                    const toParticipant = participants.find(p => p.name === message.to);

                    if (!fromParticipant || !toParticipant) {
                        console.warn('Could not find participant for message:', message);
                        return;
                    }

                    const fromIndex = participants.indexOf(fromParticipant);
                    const toIndex = participants.indexOf(toParticipant);
                    const fromX = 50 + (fromIndex * participantSpacing);
                    const toX = 50 + (toIndex * participantSpacing);
                    const messageY = 120 + (messageIndex * messageHeight);

                    const messageGroup = diagramGroup.append('g')
                        .attr('class', 'sequence-message')
                        .on('click', () => {
                            vscode.postMessage({
                                command: 'jumpToElement',
                                elementName: message.name
                            });
                        })
                        .style('cursor', 'pointer');

                    // Message arrow
                    const arrowPath = fromX < toX
                        ? 'M ' + fromX + ' ' + messageY + ' L ' + (toX - 10) + ' ' + messageY + ' L ' + (toX - 20) + ' ' + (messageY - 5) + ' M ' + (toX - 10) + ' ' + messageY + ' L ' + (toX - 20) + ' ' + (messageY + 5)
                        : 'M ' + fromX + ' ' + messageY + ' L ' + (toX + 10) + ' ' + messageY + ' L ' + (toX + 20) + ' ' + (messageY - 5) + ' M ' + (toX + 10) + ' ' + messageY + ' L ' + (toX + 20) + ' ' + (messageY + 5);

                    messageGroup.append('path')
                        .attr('d', arrowPath)
                        .style('stroke', 'var(--vscode-charts-blue)')
                        .style('stroke-width', '2px')
                        .style('fill', 'none');

                    // Message label background
                    const labelX = (fromX + toX) / 2;
                    const labelText = message.payload || message.name;
                    const labelWidth = Math.max(100, labelText.length * 8);

                    messageGroup.append('rect')
                        .attr('x', labelX - labelWidth/2)
                        .attr('y', messageY - 25)
                        .attr('width', labelWidth)
                        .attr('height', 20)
                        .attr('rx', 4)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'var(--vscode-charts-blue)')
                        .style('stroke-width', '1px');

                    // Message label
                    messageGroup.append('text')
                        .attr('x', labelX)
                        .attr('y', messageY - 10)
                        .attr('text-anchor', 'middle')
                        .text(labelText)
                        .style('font-size', '12px')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('pointer-events', 'none');

                    // Timing annotation
                    if (message.occurrence > 0) {
                        messageGroup.append('text')
                            .attr('x', Math.min(fromX, toX) - 30)
                            .attr('y', messageY + 5)
                            .text(message.occurrence + 's')
                            .style('font-size', '10px')
                            .style('fill', 'var(--vscode-descriptionForeground)')
                            .style('font-style', 'italic');
                    }
                });

                // Update currentY for next diagram
                currentY += diagramHeight + 100;
            });
        }

        function exportPDF() {
            // For now, convert SVG to PNG and send as PDF request
            // In a full implementation, this would use a PDF library
            const svgElement = document.querySelector('#visualization svg');
            if (!svgElement) {
                console.error('No SVG element found for PDF export');
                return;
            }

            vscode.postMessage({
                command: 'export',
                format: 'pdf',
                data: new XMLSerializer().serializeToString(svgElement)
            });
        }

        function exportJSON() {
            // Export the current data structure as JSON
            if (!currentData) {
                console.error('No data available for JSON export');
                return;
            }

            const jsonData = JSON.stringify(currentData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const reader = new FileReader();

            reader.onloadend = function() {
                vscode.postMessage({
                    command: 'export',
                    format: 'json',
                    data: reader.result
                });
            };

            reader.readAsDataURL(blob);
        }

        function exportPNG() {
            if (currentView === 'sysml' && cy) {
                const pngData = cy.png({
                    output: 'base64uri',
                    full: true,
                    bg: getComputedStyle(document.body).backgroundColor || '#0d1117'
                });
                vscode.postMessage({
                    command: 'export',
                    format: 'png',
                    data: pngData
                });
                return;
            }
            const svgElement = document.querySelector('#visualization svg');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            canvas.width = svgElement.width.baseVal.value;
            canvas.height = svgElement.height.baseVal.value;

            img.onload = function() {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const pngData = canvas.toDataURL('image/png');
                vscode.postMessage({
                    command: 'export',
                    format: 'png',
                    data: pngData
                });
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }

        function exportSVG() {
            if (currentView === 'sysml' && cy) {
                if (typeof cy.svg === 'function') {
                    const svgContent = cy.svg({ scale: 1, full: true });
                    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        vscode.postMessage({
                            command: 'export',
                            format: 'svg',
                            data: reader.result
                        });
                    };
                    reader.readAsDataURL(svgBlob);
                } else {
                    // Fallback to PNG if SVG plugin is unavailable
                    exportPNG();
                }
                return;
            }
            const svgElement = document.querySelector('#visualization svg');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            const reader = new FileReader();

            reader.onloadend = function() {
                vscode.postMessage({
                    command: 'export',
                    format: 'svg',
                    data: reader.result
                });
            };

            reader.readAsDataURL(svgBlob);
        }

        // Make all button handler functions globally accessible
        window.exportPNG = exportPNG;
        window.exportSVG = exportSVG;
        window.exportPDF = exportPDF;
        window.exportJSON = exportJSON;
        window.resetZoom = resetZoom;
        window.zoomToFit = zoomToFit;
        window.clearSelection = clearSelection;
        window.filterElements = filterElements;

        // IBD/Interconnection View Renderer - Compact version
        function renderIbdView(width, height, data = currentData) {
            if (!data || !data.parts || data.parts.length === 0) {
                renderPlaceholderView(width, height, 'Interconnection View',
                    'No parts or internal structure found to display.\\n\\nThis view shows internal block diagrams with parts, ports, and connectors.',
                    data);
                return;
            }

            const parts = data.parts || [];
            const ports = data.ports || [];
            const connectors = data.connectors || [];

            // Layout configuration - expanded to show all properties
            const isHorizontal = layoutDirection === 'horizontal';
            const partWidth = 220;  // Wider to fit property names
            const padding = 50;
            const horizontalSpacing = 60;
            const verticalSpacing = 40;

            // Assign IDs to parts
            parts.forEach((part, index) => {
                if (!part.id) part.id = part.name || ('part-' + index);
            });

            // Helper function to calculate part height based on content
            const calculatePartHeight = (part) => {
                const partPorts = ports.filter(p => p && (p.parentId === part.name || p.parentId === part.id));
                const partChildren = part.children || [];

                // Count content lines (same logic as rendering)
                let contentLineCount = 0;

                // Count ports
                partPorts.forEach(p => {
                    if (p && p.name) {
                        contentLineCount++; // Port header line
                        // Count port properties and children
                        if (p.properties) contentLineCount += Object.keys(p.properties).length;
                        if (p.attributes) {
                            if (typeof p.attributes.forEach === 'function') {
                                p.attributes.forEach(() => contentLineCount++);
                            } else if (typeof p.attributes === 'object') {
                                contentLineCount += Object.keys(p.attributes).filter(k => k !== 'isRedefinition').length;
                            }
                        }
                        if (p.children) {
                            contentLineCount += p.children.filter(c => c.type === 'redefinition' && c.name).length;
                        }
                    }
                });

                // Count children
                partChildren.forEach(c => {
                    if (!c || !c.name || !c.type) return;
                    if (c.type === 'part' || c.type === 'port') {
                        contentLineCount++; // Part/port header
                        if (c.properties) contentLineCount += Object.keys(c.properties).length;
                        if (c.attributes) {
                            if (typeof c.attributes.forEach === 'function') {
                                c.attributes.forEach(() => contentLineCount++);
                            } else if (typeof c.attributes === 'object') {
                                contentLineCount += Object.keys(c.attributes).filter(k => k !== 'isRedefinition').length;
                            }
                        }
                        if (c.children) {
                            contentLineCount += c.children.filter(gc => gc.type === 'redefinition' && gc.name).length;
                        }
                    } else if (c.type === 'redefinition' || c.type === 'attribute' || c.type === 'property' || c.type === 'state') {
                        contentLineCount++;
                    }
                });

                // Get typed-by reference for header height calculation
                let hasTypedBy = false;
                if (part.attributes && part.attributes.get) {
                    hasTypedBy = !!(part.attributes.get('partType') || part.attributes.get('type') || part.attributes.get('typedBy'));
                }
                if (!hasTypedBy && part.partType) hasTypedBy = true;

                const lineHeight = 12;
                const headerHeight = hasTypedBy ? 50 : 38;
                const contentHeight = contentLineCount * lineHeight + 10;
                const portsHeight = partPorts.length * 16 + 10;

                return Math.max(80, headerHeight + contentHeight + portsHeight);
            };

            // Calculate actual heights for all parts
            const partHeights = new Map();
            parts.forEach(part => {
                partHeights.set(part.name, calculatePartHeight(part));
                if (part.id) partHeights.set(part.id, calculatePartHeight(part));
            });

            // Calculate grid layout
            const cols = isHorizontal
                ? Math.ceil(Math.sqrt(parts.length * 1.5))
                : Math.max(2, Math.ceil(Math.sqrt(parts.length)));
            const rows = Math.ceil(parts.length / Math.max(1, cols));

            // Calculate row heights (maximum height in each row)
            const rowHeights = [];
            for (let row = 0; row < rows; row++) {
                let maxHeight = 80; // Minimum height
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col;
                    if (index < parts.length) {
                        const partHeight = partHeights.get(parts[index].name) || 80;
                        maxHeight = Math.max(maxHeight, partHeight);
                    }
                }
                rowHeights.push(maxHeight);
            }

            // Position parts in grid with variable row heights
            const partPositions = new Map();
            parts.forEach((part, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);

                // Calculate y position based on sum of previous row heights
                let yPos = padding;
                for (let r = 0; r < row; r++) {
                    yPos += rowHeights[r] + verticalSpacing;
                }

                const posData = {
                    x: padding + col * (partWidth + horizontalSpacing),
                    y: yPos,
                    part: part,
                    height: partHeights.get(part.name) || 80
                };
                // Store by simple name
                partPositions.set(part.name, posData);
                partPositions.set(part.id, posData);
                // Also store by qualified name if available
                if (part.qualifiedName && part.qualifiedName !== part.name) {
                    partPositions.set(part.qualifiedName, posData);
                }
            });

            // Helper to find part position by qualified name (e.g., camera.optics.outgoingLight -> camera.optics)
            const findPartPos = (qualifiedName) => {
                if (!qualifiedName) return null;

                // First try exact match
                if (partPositions.has(qualifiedName)) {
                    return partPositions.get(qualifiedName);
                }

                const segments = qualifiedName.split('.');

                // Try progressively shorter qualified names (excluding last segment which is usually a port)
                for (let i = segments.length - 1; i >= 1; i--) {
                    const partialPath = segments.slice(0, i).join('.');
                    const pos = partPositions.get(partialPath);
                    if (pos) {
                        return pos;
                    }
                }

                // Try each individual segment
                for (let i = segments.length - 1; i >= 0; i--) {
                    const pos = partPositions.get(segments[i]);
                    if (pos) {
                        return pos;
                    }
                }

                return null;
            };

            // Add SysML v2 connector markers
            const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

            // Filled arrow for item flow (SysML v2 standard)
            defs.append('marker')
                .attr('id', 'ibd-flow-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 10)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-4L10,0L0,4Z')
                .style('fill', 'var(--vscode-charts-blue)');

            // Solid circle for connection end (SysML v2 standard)
            defs.append('marker')
                .attr('id', 'ibd-connection-dot')
                .attr('viewBox', '0 0 10 10')
                .attr('refX', 5)
                .attr('refY', 5)
                .attr('markerWidth', 4)
                .attr('markerHeight', 4)
                .append('circle')
                .attr('cx', 5)
                .attr('cy', 5)
                .attr('r', 4)
                .style('fill', 'var(--vscode-charts-blue)');

            // Draw connectors FIRST (behind parts)
            const connectorGroup = g.append('g').attr('class', 'ibd-connectors');
            let connIdx = 0;

            connectors.forEach(connector => {
                const srcPos = findPartPos(connector.sourceId);
                const tgtPos = findPartPos(connector.targetId);

                if (!srcPos || !tgtPos) {
                    return;
                }

                // Get dynamic heights for each part
                const srcHeight = srcPos.height || 80;
                const tgtHeight = tgtPos.height || 80;

                // Calculate edge connection points
                const srcCx = srcPos.x + partWidth / 2;
                const srcCy = srcPos.y + srcHeight / 2;
                const tgtCx = tgtPos.x + partWidth / 2;
                const tgtCy = tgtPos.y + tgtHeight / 2;

                // Small offset for multiple connectors
                const offset = (connIdx % 4) * 10 - 15;
                connIdx++;

                let x1, y1, x2, y2;
                const dx = tgtCx - srcCx;
                const dy = tgtCy - srcCy;

                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal connection
                    if (dx > 0) {
                        x1 = srcPos.x + partWidth; y1 = srcCy + offset;
                        x2 = tgtPos.x; y2 = tgtCy + offset;
                    } else {
                        x1 = srcPos.x; y1 = srcCy + offset;
                        x2 = tgtPos.x + partWidth; y2 = tgtCy + offset;
                    }
                } else {
                    // Vertical connection
                    if (dy > 0) {
                        x1 = srcCx + offset; y1 = srcPos.y + srcHeight;
                        x2 = tgtCx + offset; y2 = tgtPos.y;
                    } else {
                        x1 = srcCx + offset; y1 = srcPos.y;
                        x2 = tgtCx + offset; y2 = tgtPos.y + tgtHeight;
                    }
                }

                // Draw orthogonal path
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                let pathD;
                if (Math.abs(x2 - x1) > Math.abs(y2 - y1)) {
                    pathD = 'M' + x1 + ',' + y1 + ' L' + midX + ',' + y1 + ' L' + midX + ',' + y2 + ' L' + x2 + ',' + y2;
                } else {
                    pathD = 'M' + x1 + ',' + y1 + ' L' + x1 + ',' + midY + ' L' + x2 + ',' + midY + ' L' + x2 + ',' + y2;
                }

                // Determine connector type and style (SysML v2 conventions)
                const isFlow = connector.type === 'flow' || connector.name.includes('flow');
                const isBinding = connector.type === 'binding' || connector.type === 'interface';

                connectorGroup.append('path')
                    .attr('d', pathD)
                    .style('fill', 'none')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', isBinding ? '1.5px' : '2px')
                    .style('stroke-dasharray', isBinding ? '5,3' : 'none')  // Dashed for binding
                    .style('marker-start', isFlow ? 'none' : 'url(#ibd-connection-dot)')
                    .style('marker-end', isFlow ? 'url(#ibd-flow-arrow)' : 'url(#ibd-connection-dot)');

                // Connection label at midpoint (SysML v2: clean, minimal background)
                const label = connector.name || '';
                if (label && label !== 'connection' && label !== 'connector') {
                    const lx = (x1 + x2) / 2;
                    const ly = (y1 + y2) / 2;
                    const displayLabel = label.length > 15 ? label.substring(0, 13) + '..' : label;

                    // White background rectangle for readability
                    connectorGroup.append('rect')
                        .attr('x', lx - displayLabel.length * 3 - 3)
                        .attr('y', ly - 8)
                        .attr('width', displayLabel.length * 6 + 6)
                        .attr('height', 13)
                        .attr('rx', 0)  // Sharp corners per SysML v2
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'none')
                        .style('opacity', 0.95);

                    // Connector name label
                    connectorGroup.append('text')
                        .attr('x', lx)
                        .attr('y', ly + 3)
                        .attr('text-anchor', 'middle')
                        .text(displayLabel)
                        .style('font-size', '8px')
                        .style('font-weight', '500')
                        .style('fill', 'var(--vscode-charts-blue)');
                }
            });

            // Draw parts
            const partGroup = g.append('g').attr('class', 'ibd-parts');

            partPositions.forEach((pos, partName) => {
                // Skip duplicate entries (same part indexed by both name and id)
                if (partName !== pos.part.name) return;

                const part = pos.part;

                // Validate part
                if (!part || !part.name) {
                    console.error('[IBD Render] Invalid part in partPositions:', part);
                    return;
                }

                const typeLower = (part.type || '').toLowerCase();
                const typeColor = getTypeColor(part.type);
                const isLibValidated = isLibraryValidated(part);
                const isDefinition = typeLower.includes('def');
                const isUsage = !isDefinition;

                // Get typed-by reference (e.g., "partName : PartType")
                let typedByName = null;
                if (part.attributes && part.attributes.get) {
                    typedByName = part.attributes.get('partType') || part.attributes.get('type') || part.attributes.get('typedBy');
                }
                if (!typedByName && part.partType) typedByName = part.partType;

                // Collect part's ports and children
                const partPorts = ports.filter(p => p && (p.parentId === part.name || p.parentId === part.id));
                const partChildren = part.children || [];

                // Calculate dynamic height based on content
                const contentLines = [];

                // Helper function to format property/attribute values
                const formatProperties = (obj) => {
                    const props = [];

                    // Handle properties object
                    if (obj.properties) {
                        if (typeof obj.properties === 'object') {
                            Object.entries(obj.properties).forEach(([key, value]) => {
                                if (value !== null && value !== undefined) {
                                    props.push('  :>> ' + key + ' = ' + value);
                                }
                            });
                        }
                    }

                    // Handle attributes (can be Map or plain object)
                    if (obj.attributes) {
                        if (typeof obj.attributes.forEach === 'function') {
                            // It's a Map
                            obj.attributes.forEach((value, key) => {
                                if (value !== null && value !== undefined && key !== 'isRedefinition') {
                                    props.push('  ' + key + ' = ' + value);
                                }
                            });
                        } else if (typeof obj.attributes === 'object') {
                            // It's a plain object
                            Object.entries(obj.attributes).forEach(([key, value]) => {
                                if (value !== null && value !== undefined && key !== 'isRedefinition') {
                                    props.push('  ' + key + ' = ' + value);
                                }
                            });
                        }
                    }

                    return props;
                };

                // Add ports with their properties
                partPorts.forEach(p => {
                    if (p && p.name) {
                        contentLines.push('[port] ' + p.name);
                        // Add port properties
                        const portProps = formatProperties(p);
                        contentLines.push(...portProps);

                        // Also check for redefinition children (e.g., :>> voltage = 7.4)
                        if (p.children && p.children.length > 0) {
                            p.children.forEach(child => {
                                if (child.type === 'redefinition' && child.name) {
                                    const value = child.attributes && child.attributes.get ?
                                        child.attributes.get('value') :
                                        (child.attributes && child.attributes.value);
                                    if (value) {
                                        contentLines.push('  :>> ' + child.name + ' = ' + value);
                                    }
                                }
                            });
                        }
                    }
                });

                // Add nested parts/attributes with their properties
                partChildren.forEach(c => {
                    try {
                        if (!c || !c.name || !c.type) return;

                        if (c.type === 'part') {
                            contentLines.push('[part] ' + c.name);
                            const childProps = formatProperties(c);
                            contentLines.push(...childProps);

                            // Also check for redefinition children (e.g., :>> voltage = 7.4)
                            if (c.children && c.children.length > 0) {
                                c.children.forEach(grandchild => {
                                    if (grandchild.type === 'redefinition' && grandchild.name) {
                                        const value = grandchild.attributes && grandchild.attributes.get ?
                                            grandchild.attributes.get('value') :
                                            (grandchild.attributes && grandchild.attributes.value);
                                        if (value) {
                                            contentLines.push('  :>> ' + grandchild.name + ' = ' + value);
                                        }
                                    }
                                });
                            }
                        } else if (c.type === 'port') {
                            contentLines.push('[port] ' + c.name);
                            const childProps = formatProperties(c);
                            contentLines.push(...childProps);

                            // Also check for redefinition children (e.g., :>> voltage = 7.4)
                            if (c.children && c.children.length > 0) {
                                c.children.forEach(grandchild => {
                                    if (grandchild.type === 'redefinition' && grandchild.name) {
                                        const value = grandchild.attributes && grandchild.attributes.get ?
                                            grandchild.attributes.get('value') :
                                            (grandchild.attributes && grandchild.attributes.value);
                                        if (value) {
                                            contentLines.push('  :>> ' + grandchild.name + ' = ' + value);
                                        }
                                    }
                                });
                            }
                        } else if (c.type === 'redefinition') {
                            // Direct redefinition (e.g., :>> voltage = 7.4)
                            const value = c.attributes && c.attributes.get ?
                                c.attributes.get('value') :
                                (c.attributes && c.attributes.value);
                            if (value) {
                                contentLines.push(':>> ' + c.name + ' = ' + value);
                            }
                        } else if (c.type === 'attribute' || c.type === 'property') {
                            // For attributes, show name and value
                            const valueStr = c.value !== undefined ? ' = ' + c.value : '';
                            contentLines.push('[attr] ' + c.name + valueStr);
                        } else if (c.type === 'state') {
                            contentLines.push('[state] ' + c.name);
                        }
                    } catch (error) {
                        // Skip problem children silently
                    }
                });

                const lineHeight = 12;
                const headerHeight = typedByName ? 50 : 38;
                const contentHeight = contentLines.length * lineHeight + 10;
                const portsHeight = partPorts.length * 16 + 10;  // Account for port display
                const totalHeight = Math.max(80, headerHeight + contentHeight + portsHeight);

                const partG = partGroup.append('g')
                    .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                    .attr('class', 'ibd-part' + (isDefinition ? ' definition-node' : ' usage-node'))
                    .style('cursor', 'pointer');

                // Part box (main rectangle) - matching General View
                partG.append('rect')
                    .attr('width', partWidth)
                    .attr('height', totalHeight)
                    .attr('rx', isUsage ? 8 : 4)  // Rounded for usages, slightly rounded for defs
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', isLibValidated ? '#4EC9B0' : typeColor)
                    .style('stroke-width', isUsage ? '3px' : '2px')
                    .style('stroke-dasharray', isDefinition ? '6,3' : 'none');

                // Type color bar at top (General View style)
                partG.append('rect')
                    .attr('width', partWidth)
                    .attr('height', 5)
                    .attr('rx', 2)
                    .style('fill', typeColor);

                // Header background
                partG.append('rect')
                    .attr('y', 5)
                    .attr('width', partWidth)
                    .attr('height', typedByName ? 36 : 28)
                    .style('fill', 'var(--vscode-button-secondaryBackground)');

                // Type stereotype (SysML v2: «part»)
                let stereoDisplay = part.type || 'part';
                if (typeLower.includes('part def')) stereoDisplay = 'part def';
                else if (typeLower.includes('part')) stereoDisplay = 'part';
                else if (typeLower.includes('port def')) stereoDisplay = 'port def';
                else if (typeLower.includes('action def')) stereoDisplay = 'action def';
                else if (typeLower.includes('action')) stereoDisplay = 'action';

                partG.append('text')
                    .attr('x', partWidth / 2)
                    .attr('y', 17)
                    .attr('text-anchor', 'middle')
                    .text('«' + stereoDisplay + '»')  // Use proper guillemets
                    .style('font-size', '9px')
                    .style('fill', typeColor);

                // Part name
                const displayName = part.name.length > 18 ? part.name.substring(0, 16) + '..' : part.name;
                partG.append('text')
                    .attr('x', partWidth / 2)
                    .attr('y', 31)
                    .attr('text-anchor', 'middle')
                    .text(displayName)
                    .style('font-size', '11px')
                    .style('font-weight', 'bold')
                    .style('fill', 'var(--vscode-editor-foreground)');

                // Show typed-by reference below name if available
                if (typedByName) {
                    partG.append('text')
                        .attr('x', partWidth / 2)
                        .attr('y', 43)
                        .attr('text-anchor', 'middle')
                        .text(': ' + (typedByName.length > 18 ? typedByName.substring(0, 16) + '..' : typedByName))
                        .style('font-size', '10px')
                        .style('font-style', 'italic')
                        .style('fill', '#569CD6');
                }

                // Content starts after header
                const contentStartY = typedByName ? 50 : 38;

                // Properties/Attributes compartment - show ALL content lines
                contentLines.forEach((line, i) => {
                    partG.append('text')
                        .attr('x', 6)
                        .attr('y', contentStartY + 8 + i * lineHeight)
                        .text(line.length > 28 ? line.substring(0, 26) + '..' : line)
                        .style('font-size', '9px')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                });

                // Render ports as small squares on the boundary (SysML v2 standard)
                const portSize = 10;  // Match General View port size
                const portSpacing = 16;
                // Position ports after all content lines
                const portStartY = contentStartY + 8 + contentLines.length * lineHeight + 10;

                // Show ALL ports (no slicing)
                partPorts.forEach((p, i) => {
                    if (!p || !p.name) return;

                    // Position ports on left edge, evenly spaced
                    const portY = portStartY + i * portSpacing;

                    // Determine port direction for color
                    const portDirection = p.direction || 'inout';
                    const portColor = portDirection === 'in' ? '#C586C0' :
                                    (portDirection === 'out' ? '#4EC9B0' : '#9CDCFE');

                    // Port symbol (small square on boundary)
                    partG.append('rect')
                        .attr('class', 'port-icon')
                        .attr('x', -portSize/2)  // Half outside, half inside
                        .attr('y', portY - portSize/2)
                        .attr('width', portSize)
                        .attr('height', portSize)
                        .style('fill', portColor)
                        .style('stroke', 'var(--vscode-editor-background)')
                        .style('stroke-width', '1px');

                    // Port name label (outside the box)
                    const portLabel = p.name.length > 10 ? p.name.substring(0, 8) + '..' : p.name;
                    partG.append('text')
                        .attr('x', -portSize/2 - 3)
                        .attr('y', portY + 3)
                        .attr('text-anchor', 'end')
                        .text(portLabel)
                        .style('font-size', '8px')
                        .style('fill', portColor);
                });

                // Click handlers
                partG.on('click', () => {})
                    .on('dblclick', () => {
                        vscode.postMessage({ command: 'jumpToElement', elementName: part.name });
                    });
            });
        }

        // Activity/Action Flow View Renderer
        function renderActivityView(width, height, data = currentData) {
            if (!data || !data.diagrams || data.diagrams.length === 0) {
                renderPlaceholderView(width, height, 'Action Flow View',
                    'No activity diagrams found to display.\\n\\nThis view shows action flows with decisions, merge nodes, and swim lanes.',
                    data);
                return;
            }

            // Use selected diagram index, with bounds checking
            const diagramIndex = Math.min(selectedDiagramIndex, data.diagrams.length - 1);
            const diagram = data.diagrams[diagramIndex];

            // Ensure all actions have id and name for reliable processing
            const actions = (diagram.actions || []).map((action, idx) => ({
                ...action,
                id: action.id || action.name || 'action_' + idx,
                name: action.name || action.id || 'Action ' + (idx + 1)
            }));
            let flows = diagram.flows || [];

            // If no explicit flows, create implicit flows between consecutive actions
            if (flows.length === 0 && actions.length > 1) {
                flows = [];
                for (let i = 0; i < actions.length - 1; i++) {
                    flows.push({
                        from: actions[i].id || actions[i].name,
                        to: actions[i + 1].id || actions[i + 1].name,
                        type: 'control'
                    });
                }
            }

            // Layout configuration - activity view defaults to vertical (top-down)
            // Only use horizontal if explicitly set
            const isHorizontal = activityLayoutDirection === 'horizontal';
            const actionWidth = 220;
            const actionHeight = 60;
            const verticalSpacing = 80;
            const horizontalSpacing = 140;
            const startX = 80;
            const startY = 80;
            const swimLaneWidth = 250;

            // Organize actions by swim lanes
            const swimLanes = new Map();
            const noLaneActions = [];

            actions.forEach(action => {
                if (action.lane) {
                    if (!swimLanes.has(action.lane)) {
                        swimLanes.set(action.lane, []);
                    }
                    swimLanes.get(action.lane).push(action);
                } else {
                    noLaneActions.push(action);
                }
            });

            // Build action position map using topological sort for proper ordering
            const actionPositions = new Map();
            const actionIndexById = new Map();
            actions.forEach((action, index) => actionIndexById.set(action.id, index));

            // Calculate levels (rows) for each action based on dependencies
            const levels = new Map();
            const visited = new Set();

            function calculateLevel(actionId, currentLevel = 0) {
                if (visited.has(actionId)) {
                    return levels.get(actionId) || 0;
                }
                visited.add(actionId);

                // Find flows that target this action
                const incomingFlows = flows.filter(f => f.to === actionId);
                let maxSourceLevel = -1;

                incomingFlows.forEach(flow => {
                    const sourceLevel = calculateLevel(flow.from, currentLevel);
                    maxSourceLevel = Math.max(maxSourceLevel, sourceLevel);
                });

                const level = maxSourceLevel + 1;
                levels.set(actionId, level);
                return level;
            }

            // Calculate levels for all actions
            actions.forEach(action => {
                if (!visited.has(action.id)) {
                    calculateLevel(action.id);
                }
            });

            // Organize actions by level
            const actionsByLevel = new Map();
            actions.forEach(action => {
                const level = levels.get(action.id) || 0;
                if (!actionsByLevel.has(level)) {
                    actionsByLevel.set(level, []);
                }
                actionsByLevel.get(level).push(action);
            });

            // Position actions in grid layout
            let laneIndex = 0;
            const lanePositions = new Map();

            if (swimLanes.size > 0) {
                swimLanes.forEach((laneActions, laneName) => {
                    const laneX = 60 + laneIndex * (swimLaneWidth + 40);
                    lanePositions.set(laneName, { x: laneX, index: laneIndex });

                    laneActions.forEach((action) => {
                        const level = levels.get(action.id) || 0;
                        actionPositions.set(action.id, {
                            x: laneX + (swimLaneWidth - actionWidth) / 2,
                            y: startY + level * verticalSpacing,
                            action: action
                        });
                    });

                    laneIndex++;
                });
            } else {
                // No swim lanes - center actions, respecting layout direction
                actions.forEach((action, index) => {
                    const level = levels.get(action.id) || 0;
                    const actionsAtLevel = actionsByLevel.get(level) || [action];
                    const positionInLevel = actionsAtLevel.indexOf(action);
                    const totalAtLevel = actionsAtLevel.length;

                    if (isHorizontal) {
                        // Horizontal: levels go left-to-right, actions stacked vertically
                        const centerOffset = (totalAtLevel - 1) * (actionHeight + verticalSpacing) / 2;
                        actionPositions.set(action.id, {
                            x: startX + level * (actionWidth + horizontalSpacing),
                            y: height / 2 - centerOffset + positionInLevel * (actionHeight + verticalSpacing),
                            action: action
                        });
                    } else {
                        // Vertical (default): levels go top-to-bottom, actions spread horizontally
                        const centerOffset = (totalAtLevel - 1) * (actionWidth + horizontalSpacing) / 2;
                        actionPositions.set(action.id, {
                            x: width / 2 - centerOffset + positionInLevel * (actionWidth + horizontalSpacing),
                            y: startY + level * verticalSpacing,
                            action: action
                        });
                    }
                });
            }

            // Draw swim lanes if present
            if (swimLanes.size > 0) {
                const maxLevel = Math.max(...Array.from(levels.values()), 0);
                const laneHeight = startY + (maxLevel + 1) * verticalSpacing + 40;

                lanePositions.forEach((pos, laneName) => {
                    g.append('rect')
                        .attr('x', pos.x - 10)
                        .attr('y', 20)
                        .attr('width', swimLaneWidth)
                        .attr('height', laneHeight)
                        .attr('rx', 4)
                        .style('fill', 'none')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '2px')
                        .style('stroke-dasharray', '5,5')
                        .style('opacity', 0.5);

                    g.append('text')
                        .attr('x', pos.x + swimLaneWidth / 2)
                        .attr('y', 40)
                        .attr('text-anchor', 'middle')
                        .text(laneName)
                        .style('font-size', '12px')
                        .style('font-weight', 'bold')
                        .style('fill', 'var(--vscode-descriptionForeground)');
                });
            }

            // Draw flows (behind actions)
            const flowGroup = g.append('g').attr('class', 'activity-flows');

            flows.forEach(flow => {
                const sourcePos = actionPositions.get(flow.from);
                const targetPos = actionPositions.get(flow.to);

                if (!sourcePos || !targetPos) {
                    return;
                }

                let pathData;
                let labelX, labelY;

                if (isHorizontal) {
                    // Horizontal layout: exit from right side, enter from left
                    const startX = sourcePos.x + actionWidth;
                    const startY = sourcePos.y + actionHeight / 2;
                    const endX = targetPos.x;
                    const endY = targetPos.y + actionHeight / 2;

                    const midX = (startX + endX) / 2;
                    pathData = 'M ' + startX + ',' + startY +
                               ' L ' + midX + ',' + startY +
                               ' L ' + midX + ',' + endY +
                               ' L ' + endX + ',' + endY;
                    labelX = midX;
                    labelY = (startY + endY) / 2 - 5;
                } else {
                    // Vertical layout: exit from bottom, enter from top
                    const startX = sourcePos.x + actionWidth / 2;
                    const startY = sourcePos.y + actionHeight;
                    const endX = targetPos.x + actionWidth / 2;
                    const endY = targetPos.y;

                    const midY = (startY + endY) / 2;
                    pathData = 'M ' + startX + ',' + startY +
                               ' L ' + startX + ',' + midY +
                               ' L ' + endX + ',' + midY +
                               ' L ' + endX + ',' + endY;
                    labelX = (startX + endX) / 2;
                    labelY = midY - 5;
                }

                flowGroup.append('path')
                    .attr('d', pathData)
                    .style('fill', 'none')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '2px')
                    .style('marker-end', 'url(#activity-arrowhead)');

                // Add guard/condition label if present
                const guardLabel = flow.guard || flow.condition;

                if (guardLabel) {
                    // Extract just the enum value if it's a comparison like "scanEnvironment.status == StatusKind::safe"
                    let displayLabel = guardLabel;
                    // Trim any whitespace first
                    const trimmedGuard = String(guardLabel).trim();

                    // Try multiple patterns to extract enum value
                    // Pattern 1: Look for "::enumValue" anywhere in the string (most common)
                    // Note: Double-escaped for template literal
                    let enumMatch = trimmedGuard.match(/::(\\w+)/);
                    if (enumMatch) {
                        displayLabel = enumMatch[1]; // Just use "safe" or "alert"
                    } else {
                        // Truncate long conditions for display
                        displayLabel = trimmedGuard.length > 25 ? trimmedGuard.substring(0, 22) + '...' : trimmedGuard;
                    }

                    // Add a background rect for better visibility
                    const labelText = '[' + displayLabel + ']';
                    const labelWidth = labelText.length * 6 + 8;

                    flowGroup.append('rect')
                        .attr('x', labelX - labelWidth / 2)
                        .attr('y', labelY - 10)
                        .attr('width', labelWidth)
                        .attr('height', 14)
                        .attr('rx', 3)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'var(--vscode-charts-orange)')
                        .style('stroke-width', '1px')
                        .style('opacity', 0.9);

                    flowGroup.append('text')
                        .attr('x', labelX)
                        .attr('y', labelY)
                        .attr('text-anchor', 'middle')
                        .text(labelText)
                        .style('font-size', '10px')
                        .style('fill', 'var(--vscode-charts-orange)')
                        .style('font-weight', 'bold');
                }
            });

            // Add arrowhead marker for flows
            const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

            defs.append('marker')
                .attr('id', 'activity-arrowhead')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style('fill', 'var(--vscode-charts-blue)');

            // Draw actions
            const actionGroup = g.append('g').attr('class', 'activity-actions');

            // Helper function to truncate text to fit in a given width
            function truncateToFit(text, maxChars) {
                if (!text) return '';
                if (text.length <= maxChars) return text;
                return text.substring(0, maxChars - 2) + '..';
            }

            // Helper function to handle click navigation
            function handleActionClick(action) {
                if (action && action.name) {
                    vscode.postMessage({
                        command: 'jumpToElement',
                        elementName: action.name
                    });
                }
            }

            actionPositions.forEach((pos, actionId) => {
                const action = pos.action;
                const actionKind = (action.kind || action.type || 'action').toLowerCase();
                const actionName = action.name || actionId || 'unnamed';

                // Determine shape based on action kind
                const isDecision = actionKind.includes('decision') || actionKind.includes('merge');
                const isFork = actionKind.includes('fork') || actionKind.includes('join');
                const isStart = actionKind.includes('initial') || actionKind.includes('start') || actionName === 'start';
                const isEnd = actionKind.includes('final') || actionKind.includes('end') || actionKind.includes('done') || actionName === 'done';

                const actionElement = actionGroup.append('g')
                    .attr('class', 'activity-action')
                    .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                    .style('cursor', 'pointer')
                    .on('click', function(event) {
                        event.stopPropagation();
                        handleActionClick(action);
                    });

                if (isStart || isEnd) {
                    // Circle for start/end nodes
                    actionElement.append('circle')
                        .attr('cx', actionWidth / 2)
                        .attr('cy', actionHeight / 2)
                        .attr('r', 20)
                        .style('fill', isStart ? 'var(--vscode-charts-green)' : 'var(--vscode-charts-red)')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '3px');

                    if (isEnd) {
                        actionElement.append('circle')
                            .attr('cx', actionWidth / 2)
                            .attr('cy', actionHeight / 2)
                            .attr('r', 12)
                            .style('fill', 'var(--vscode-charts-red)')
                            .style('stroke', 'none');
                    }
                } else if (isDecision) {
                    // Diamond for decision/merge nodes
                    const diamond = 'M ' + (actionWidth / 2) + ',0 ' +
                                  'L ' + actionWidth + ',' + (actionHeight / 2) + ' ' +
                                  'L ' + (actionWidth / 2) + ',' + actionHeight + ' ' +
                                  'L 0,' + (actionHeight / 2) + ' Z';

                    actionElement.append('path')
                        .attr('d', diamond)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'var(--vscode-charts-orange)')
                        .style('stroke-width', '2px');

                    // Show label for both decision and merge nodes
                    let decisionLabel = '?';
                    if (actionKind.includes('merge')) {
                        // Merge nodes show their name - use smaller font for longer names
                        decisionLabel = truncateToFit(actionName, 18);
                    } else if (action.condition && action.condition !== 'decide') {
                        // Decision with specific condition
                        decisionLabel = truncateToFit(action.condition, 18);
                    }

                    actionElement.append('text')
                        .attr('x', actionWidth / 2)
                        .attr('y', actionHeight / 2 + 5)
                        .attr('text-anchor', 'middle')
                        .text(decisionLabel)
                        .style('font-size', actionKind.includes('merge') ? '11px' : '16px')
                        .style('font-weight', actionKind.includes('merge') ? 'bold' : 'bold')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');
                } else if (isFork) {
                    // Bar for fork/join nodes
                    actionElement.append('rect')
                        .attr('x', 0)
                        .attr('y', actionHeight / 2 - 5)
                        .attr('width', actionWidth)
                        .attr('height', 10)
                        .attr('rx', 2)
                        .style('fill', 'var(--vscode-panel-border)')
                        .style('stroke', 'none');
                } else {
                    // Rounded rectangle for regular actions
                    actionElement.append('rect')
                        .attr('width', actionWidth)
                        .attr('height', actionHeight)
                        .attr('rx', 8)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'var(--vscode-charts-blue)')
                        .style('stroke-width', '2px');

                    // Action name - truncate to fit within box (approx 24 chars for 220px width at 13px font)
                    const maxChars = 24;
                    const displayName = truncateToFit(actionName, maxChars);

                    // Use smaller font for longer names
                    const fontSize = actionName.length > 20 ? '11px' : '13px';

                    actionElement.append('text')
                        .attr('x', actionWidth / 2)
                        .attr('y', actionHeight / 2 - 5)
                        .attr('text-anchor', 'middle')
                        .text(displayName)
                        .style('font-size', fontSize)
                        .style('font-weight', 'bold')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');

                    // Action kind - only show if not redundant
                    if (actionKind !== 'action' && actionKind !== displayName.toLowerCase()) {
                        actionElement.append('text')
                            .attr('x', actionWidth / 2)
                            .attr('y', actionHeight / 2 + 12)
                            .attr('text-anchor', 'middle')
                            .text('«' + truncateToFit(actionKind, 14) + '»')
                            .style('font-size', '9px')
                            .style('fill', 'var(--vscode-descriptionForeground)')
                            .style('user-select', 'none');
                    }
                }
            });
        }

        // State Transition View Renderer
        function renderStateView(width, height, data = currentData) {
            if (!data || !data.states || data.states.length === 0) {
                renderPlaceholderView(width, height, 'State Transition View',
                    'No states found to display.\\n\\nThis view shows state machines with states, transitions, and guards.',
                    data);
                return;
            }

            const allStates = data.states || [];
            const transitions = data.transitions || [];

            // Group states by their parent state machine
            const stateMachineMap = new Map(); // machineName -> { container, states, nestedMachines }
            const orphanStates = [];

            // Helper to recursively find all child states from a container
            function collectChildStates(container, collected = []) {
                if (container.children && container.children.length > 0) {
                    container.children.forEach(child => {
                        const childType = (child.type || '').toLowerCase();
                        const childName = (child.name || '').toLowerCase();

                        // If this is a nested state machine, don't include its states here
                        const isNestedMachine = childName.endsWith('states') || childType.includes('exhibit');

                        if (childType.includes('state') && !childType.includes('def')) {
                            if (!isNestedMachine) {
                                collected.push(child);
                            }
                        }
                        // Recurse into children that aren't separate state machines
                        if (!isNestedMachine && child.children) {
                            collectChildStates(child, collected);
                        }
                    });
                }
                return collected;
            }

            // First pass: identify state machine containers (including nested ones)
            function findStateMachines(stateList, depth = 0) {
                stateList.forEach(s => {
                    const typeLower = (s.type || '').toLowerCase();
                    const nameLower = (s.name || '').toLowerCase();

                    // State machine containers: exhibit state, or names ending with "States"
                    const isContainer = typeLower.includes('exhibit') ||
                                       nameLower.endsWith('states') ||
                                       (typeLower.includes('state') && s.children && s.children.length > 0 &&
                                        s.children.some(c => (c.type || '').toLowerCase().includes('state')));

                    if (isContainer && !typeLower.includes('def')) {
                        // Collect direct child states from this container
                        const childStates = collectChildStates(s);
                        stateMachineMap.set(s.name, {
                            container: s,
                            states: childStates,
                            transitions: [],
                            depth: depth
                        });
                    }

                    // Look for nested state machines in children
                    if (s.children && s.children.length > 0) {
                        findStateMachines(s.children, depth + 1);
                    }
                });
            }

            findStateMachines(allStates);

            // Second pass: for states without explicit parent, try to match by parent property
            allStates.forEach(s => {
                const typeLower = (s.type || '').toLowerCase();
                const nameLower = (s.name || '').toLowerCase();

                // Skip definitions and containers
                if (typeLower.includes('def') || typeLower.includes('definition')) {
                    return;
                }
                if (stateMachineMap.has(s.name)) {
                    return;
                }

                // Skip if already in a state machine
                let alreadyAssigned = false;
                for (const [machineName, machineData] of stateMachineMap) {
                    if (machineData.states.some(existing => existing.name === s.name)) {
                        alreadyAssigned = true;
                        break;
                    }
                }
                if (alreadyAssigned) return;

                // Try to find parent state machine by parent property
                if (s.parent) {
                    for (const [machineName, machineData] of stateMachineMap) {
                        if (s.parent === machineName || s.parent.includes(machineName)) {
                            // Avoid duplicates
                            if (!machineData.states.some(existing => existing.name === s.name)) {
                                machineData.states.push(s);
                            }
                            return;
                        }
                    }
                }

                // Not assigned to any state machine
                orphanStates.push(s);
            });

            // Assign transitions to state machines
            transitions.forEach(t => {
                for (const [machineName, machineData] of stateMachineMap) {
                    const stateNames = machineData.states.map(s => s.name || s.id);
                    if (stateNames.includes(t.source) || stateNames.includes(t.target)) {
                        machineData.transitions.push(t);
                        break;
                    }
                }
            });

            // Convert to array for selection
            const stateMachines = Array.from(stateMachineMap.entries()).map(([name, data]) => ({
                name,
                container: data.container,
                states: data.states,
                transitions: data.transitions
            }));

            // If no state machines found, create one from all states
            if (stateMachines.length === 0 && (allStates.length > 0 || orphanStates.length > 0)) {
                stateMachines.push({
                    name: 'State Machine',
                    container: null,
                    states: allStates.filter(s => {
                        const typeLower = (s.type || '').toLowerCase();
                        return !typeLower.includes('def') && !typeLower.includes('definition');
                    }),
                    transitions: transitions
                });
            }

            // Add orphan states to their own "Other States" group if there are any
            if (orphanStates.length > 0 && stateMachines.length > 0) {
                // Add orphans to the first state machine if they're not already there
                const firstMachine = stateMachines[0];
                orphanStates.forEach(s => {
                    if (!firstMachine.states.find(existing => existing.name === s.name)) {
                        firstMachine.states.push(s);
                    }
                });
            }

            // Select the current state machine based on selectedDiagramIndex
            const machineIndex = Math.min(selectedDiagramIndex, stateMachines.length - 1);
            const selectedMachine = stateMachines[machineIndex];

            if (!selectedMachine || selectedMachine.states.length === 0) {
                renderPlaceholderView(width, height, 'State Transition View',
                    'No states found in selected state machine.\\n\\nTry selecting a different state machine from the dropdown.',
                    data);
                return;
            }

            const states = selectedMachine.states;
            const stateMachineNames = [selectedMachine.name];

            // Layout configuration
            const stateWidth = 160;
            const stateHeight = 60;
            const horizontalSpacing = 80;
            const verticalSpacing = 100;
            const marginLeft = 80;
            const marginTop = stateMachineNames.length > 0 ? 110 : 80; // Extra space for title

            // Helper to get unique key for a state
            const getStateKey = (state) => state.id || state.name || ('state-' + Math.random().toString(36).substr(2, 9));

            // Filter out state definitions and state machine containers
            const stateUsages = states.filter(s => {
                const typeLower = (s.type || '').toLowerCase();
                const nameLower = (s.name || '').toLowerCase();

                // Skip state definitions (state def CameraState)
                if (typeLower.includes('def') || typeLower.includes('definition')) {
                    return false;
                }

                // Skip state machine containers
                if (nameLower.endsWith('states') || nameLower.includes('machine')) {
                    return false;
                }

                return true;
            });

            // Build adjacency list from transitions for layout (using filtered states)
            const stateKeys = new Set(stateUsages.map(s => getStateKey(s)));
            const outgoing = new Map(); // state -> [target states]
            const incoming = new Map(); // state -> [source states]

            stateUsages.forEach(s => {
                const key = getStateKey(s);
                outgoing.set(key, []);
                incoming.set(key, []);
            });

            // Use transitions from selected machine
            const machineTransitions = selectedMachine.transitions || transitions;
            machineTransitions.forEach(t => {
                // Only include transitions between visible states
                if (stateKeys.has(t.source) && stateKeys.has(t.target)) {
                    if (outgoing.has(t.source)) {
                        outgoing.get(t.source).push(t.target);
                    }
                    if (incoming.has(t.target)) {
                        incoming.get(t.target).push(t.source);
                    }
                }
            });

            // Identify special states - ONLY based on type, not name
            // "off" is a regular state, not an initial pseudostate
            const initialStates = stateUsages.filter(s => {
                const typeLower = (s.type || '').toLowerCase();
                return typeLower.includes('initial') && !typeLower.includes('state');
            });
            const finalStates = stateUsages.filter(s => {
                const typeLower = (s.type || '').toLowerCase();
                return typeLower.includes('final') && !typeLower.includes('state');
            });

            // Use hierarchical layout based on transition flow
            // Level 0: states with no incoming transitions (roots)
            // Level N: states reachable from level N-1
            const levels = new Map(); // stateKey -> level
            const visited = new Set();

            // Find root states (no incoming or initial states)
            const roots = stateUsages.filter(s => {
                const key = getStateKey(s);
                const inc = incoming.get(key) || [];
                return inc.length === 0 || initialStates.includes(s);
            });

            // BFS to assign levels
            let queue = roots.map(s => ({ state: s, level: 0 }));
            if (queue.length === 0 && stateUsages.length > 0) {
                // No clear roots, start with first state
                queue = [{ state: stateUsages[0], level: 0 }];
            }

            while (queue.length > 0) {
                const { state, level } = queue.shift();
                const key = getStateKey(state);

                if (visited.has(key)) continue;
                visited.add(key);
                levels.set(key, level);

                // Add children
                const targets = outgoing.get(key) || [];
                targets.forEach(targetKey => {
                    const targetState = stateUsages.find(s => getStateKey(s) === targetKey);
                    if (targetState && !visited.has(targetKey)) {
                        queue.push({ state: targetState, level: level + 1 });
                    }
                });
            }

            // Add any unvisited states
            stateUsages.forEach(s => {
                const key = getStateKey(s);
                if (!visited.has(key)) {
                    levels.set(key, Math.max(...Array.from(levels.values()), 0) + 1);
                }
            });

            // Group states by level
            const statesByLevel = new Map();
            stateUsages.forEach(s => {
                const key = getStateKey(s);
                const level = levels.get(key) || 0;
                if (!statesByLevel.has(level)) {
                    statesByLevel.set(level, []);
                }
                statesByLevel.get(level).push(s);
            });

            // Position states based on layout orientation
            const statePositions = new Map();
            const maxLevel = Math.max(...Array.from(statesByLevel.keys()), 0);

            if (stateLayoutOrientation === 'force') {
                // Force-directed layout using D3 simulation
                const nodes = stateUsages.map(s => ({
                    id: getStateKey(s),
                    state: s,
                    x: marginLeft + Math.random() * (width - marginLeft * 2 - stateWidth),
                    y: marginTop + Math.random() * (height - marginTop * 2 - stateHeight)
                }));

                const nodeMap = new Map();
                nodes.forEach(n => nodeMap.set(n.id, n));

                // Create links from transitions
                const links = [];
                transitions.forEach(t => {
                    const sourceKey = t.sourceName;
                    const targetKey = t.targetName;
                    if (nodeMap.has(sourceKey) && nodeMap.has(targetKey) && sourceKey !== targetKey) {
                        links.push({
                            source: nodeMap.get(sourceKey),
                            target: nodeMap.get(targetKey)
                        });
                    }
                });

                // Create force simulation
                const simulation = d3.forceSimulation(nodes)
                    .force('center', d3.forceCenter(width / 2 - stateWidth / 2, height / 2 - stateHeight / 2))
                    .force('charge', d3.forceManyBody().strength(-800))
                    .force('link', d3.forceLink(links).distance(stateWidth + horizontalSpacing).strength(0.5))
                    .force('collide', d3.forceCollide().radius(stateWidth * 0.8))
                    .force('x', d3.forceX(width / 2 - stateWidth / 2).strength(0.05))
                    .force('y', d3.forceY(height / 2 - stateHeight / 2).strength(0.05));

                // Run simulation synchronously to completion
                simulation.stop();
                for (let i = 0; i < 300; ++i) simulation.tick();

                // Apply positions with bounds checking
                nodes.forEach(n => {
                    statePositions.set(n.id, {
                        x: Math.max(marginLeft, Math.min(width - stateWidth - marginLeft, n.x)),
                        y: Math.max(marginTop, Math.min(height - stateHeight - marginTop, n.y)),
                        state: n.state
                    });
                });
            } else if (stateLayoutOrientation === 'horizontal') {
                // Horizontal: levels go left-to-right, states stacked vertically (side-by-side within level)
                statesByLevel.forEach((statesInLevel, level) => {
                    const levelX = marginLeft + level * (stateWidth + horizontalSpacing);
                    // Compact vertical spacing for states at the same level
                    const compactSpacing = 20; // Gap between states at same level
                    const totalHeight = statesInLevel.length * stateHeight + (statesInLevel.length - 1) * compactSpacing;
                    const startY = marginTop + Math.max(0, (height - totalHeight - marginTop * 2) / 3);

                    statesInLevel.forEach((state, index) => {
                        const key = getStateKey(state);
                        statePositions.set(key, {
                            x: levelX,
                            y: startY + index * (stateHeight + compactSpacing),
                            state: state
                        });
                    });
                });
            } else {
                // Vertical: levels go top-to-bottom, states spread horizontally (side-by-side within level)
                statesByLevel.forEach((statesInLevel, level) => {
                    const levelY = marginTop + level * (stateHeight + verticalSpacing);
                    // Compact horizontal spacing for states at the same level
                    const compactSpacing = 30; // Gap between states at same level
                    const totalWidth = statesInLevel.length * stateWidth + (statesInLevel.length - 1) * compactSpacing;
                    const startX = marginLeft + Math.max(0, (width - totalWidth - marginLeft * 2) / 3);

                    statesInLevel.forEach((state, index) => {
                        const key = getStateKey(state);
                        statePositions.set(key, {
                            x: startX + index * (stateWidth + compactSpacing),
                            y: levelY,
                            state: state
                        });
                    });
                });
            }

            // Add arrowhead marker
            const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
            defs.selectAll('#state-arrowhead').remove();

            defs.append('marker')
                .attr('id', 'state-arrowhead')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 10)
                .attr('refY', 0)
                .attr('markerWidth', 8)
                .attr('markerHeight', 8)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-4L10,0L0,4')
                .style('fill', 'var(--vscode-charts-purple)');

            // Create groups for layering
            const transitionGroup = g.append('g').attr('class', 'state-transitions');
            const stateGroup = g.append('g').attr('class', 'state-nodes');

            // Add title label for state machine(s)
            if (stateMachineNames.length > 0) {
                const titleText = stateMachineNames.length === 1
                    ? 'State Machine: ' + stateMachineNames[0]
                    : 'State Machines: ' + stateMachineNames.join(', ');

                g.append('text')
                    .attr('x', marginLeft)
                    .attr('y', 30)
                    .attr('class', 'state-machine-title')
                    .style('font-size', '16px')
                    .style('font-weight', 'bold')
                    .style('fill', 'var(--vscode-editor-foreground)')
                    .style('opacity', '0.9')
                    .text(titleText);
            }

            // Function to calculate edge path between two states
            function calculateEdgePath(sourceKey, targetKey, transitionIndex = 0, totalTransitions = 1) {
                const sourcePos = statePositions.get(sourceKey);
                const targetPos = statePositions.get(targetKey);

                if (!sourcePos || !targetPos) return null;

                const sx = sourcePos.x;
                const sy = sourcePos.y;
                const tx = targetPos.x;
                const ty = targetPos.y;

                // Self-loop
                if (sourceKey === targetKey) {
                    const loopSize = 30;
                    return {
                        path: 'M ' + (sx + stateWidth) + ' ' + (sy + stateHeight/2) +
                               ' C ' + (sx + stateWidth + loopSize) + ' ' + (sy + stateHeight/2 - loopSize) + ',' +
                                 ' ' + (sx + stateWidth + loopSize) + ' ' + (sy + stateHeight/2 + loopSize) + ',' +
                                 ' ' + (sx + stateWidth) + ' ' + (sy + stateHeight/2 + 5),
                        labelX: sx + stateWidth + loopSize + 5,
                        labelY: sy + stateHeight/2
                    };
                }

                // Determine connection points based on relative positions
                let startX, startY, endX, endY;
                const dx = tx - sx;
                const dy = ty - sy;

                // Offset for multiple transitions between same states
                const offset = (transitionIndex - (totalTransitions - 1) / 2) * 15;

                if (Math.abs(dx) > Math.abs(dy)) {
                    // Horizontal connection
                    if (dx > 0) {
                        // Target is to the right
                        startX = sx + stateWidth;
                        startY = sy + stateHeight / 2 + offset;
                        endX = tx;
                        endY = ty + stateHeight / 2 + offset;
                    } else {
                        // Target is to the left
                        startX = sx;
                        startY = sy + stateHeight / 2 + offset;
                        endX = tx + stateWidth;
                        endY = ty + stateHeight / 2 + offset;
                    }
                } else {
                    // Vertical connection
                    if (dy > 0) {
                        // Target is below
                        startX = sx + stateWidth / 2 + offset;
                        startY = sy + stateHeight;
                        endX = tx + stateWidth / 2 + offset;
                        endY = ty;
                    } else {
                        // Target is above
                        startX = sx + stateWidth / 2 + offset;
                        startY = sy;
                        endX = tx + stateWidth / 2 + offset;
                        endY = ty + stateHeight;
                    }
                }

                // Curved path with control points
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                // Add slight curve to avoid overlap
                const curveOffset = offset * 0.5;
                const controlX = midX + curveOffset;
                const controlY = midY + curveOffset;

                return {
                    path: 'M ' + startX + ' ' + startY + ' Q ' + controlX + ' ' + controlY + ' ' + endX + ' ' + endY,
                    labelX: controlX,
                    labelY: controlY - 8
                };
            }

            // Draw all transitions
            function drawTransitions() {
                transitionGroup.selectAll('*').remove();

                // Group transitions by source-target pair to handle multiple edges
                const transitionPairs = new Map();
                transitions.forEach(t => {
                    const pairKey = t.source + '->' + t.target;
                    if (!transitionPairs.has(pairKey)) {
                        transitionPairs.set(pairKey, []);
                    }
                    transitionPairs.get(pairKey).push(t);
                });

                transitionPairs.forEach((transitionsForPair, pairKey) => {
                    transitionsForPair.forEach((transition, index) => {
                        const edgeData = calculateEdgePath(
                            transition.source,
                            transition.target,
                            index,
                            transitionsForPair.length
                        );

                        if (!edgeData) return;

                        // Draw the path
                        transitionGroup.append('path')
                            .attr('d', edgeData.path)
                            .attr('class', 'transition-path')
                            .style('fill', 'none')
                            .style('stroke', 'var(--vscode-charts-purple)')
                            .style('stroke-width', '2px')
                            .style('marker-end', 'url(#state-arrowhead)');

                        // Draw label if present
                        if (transition.label) {
                            // Background for label
                            const labelText = transition.label.length > 15
                                ? transition.label.substring(0, 12) + '...'
                                : transition.label;

                            transitionGroup.append('rect')
                                .attr('x', edgeData.labelX - 25)
                                .attr('y', edgeData.labelY - 10)
                                .attr('width', 50)
                                .attr('height', 14)
                                .attr('rx', 3)
                                .style('fill', 'var(--vscode-editor-background)')
                                .style('opacity', 0.9);

                            transitionGroup.append('text')
                                .attr('x', edgeData.labelX)
                                .attr('y', edgeData.labelY)
                                .attr('text-anchor', 'middle')
                                .attr('dominant-baseline', 'middle')
                                .text(labelText)
                                .style('font-size', '10px')
                                .style('fill', 'var(--vscode-charts-purple)')
                                .style('font-weight', '500');
                        }
                    });
                });
            }

            // Draw initial transitions (draw them once)
            drawTransitions();

            // Draw states with drag behavior
            statePositions.forEach((pos, stateKey) => {
                const state = pos.state;
                const isInitial = initialStates.includes(state);
                const isFinal = finalStates.includes(state);

                const stateElement = stateGroup.append('g')
                    .attr('class', 'state-node')
                    .attr('data-state-key', stateKey)
                    .attr('transform', 'translate(' + pos.x + ', ' + pos.y + ')')
                    .style('cursor', 'grab');

                // Add drag behavior
                const drag = d3.drag()
                    .on('start', function(event) {
                        d3.select(this).raise().style('cursor', 'grabbing');
                    })
                    .on('drag', function(event) {
                        // Update position
                        const newX = pos.x + event.dx;
                        const newY = pos.y + event.dy;
                        pos.x = newX;
                        pos.y = newY;

                        d3.select(this).attr('transform', 'translate(' + newX + ', ' + newY + ')');

                        // Redraw transitions
                        drawTransitions();
                    })
                    .on('end', function(event) {
                        d3.select(this).style('cursor', 'grab');
                    });

                stateElement.call(drag);

                if (isInitial) {
                    // Initial state: filled circle
                    stateElement.append('circle')
                        .attr('cx', stateWidth / 2)
                        .attr('cy', stateHeight / 2)
                        .attr('r', 15)
                        .style('fill', 'var(--vscode-charts-green)')
                        .style('stroke', 'var(--vscode-panel-border)')
                        .style('stroke-width', '2px');

                    stateElement.append('text')
                        .attr('x', stateWidth / 2)
                        .attr('y', stateHeight / 2 + 30)
                        .attr('text-anchor', 'middle')
                        .text(state.name)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-editor-foreground)');

                } else if (isFinal) {
                    // Final state: double circle
                    stateElement.append('circle')
                        .attr('cx', stateWidth / 2)
                        .attr('cy', stateHeight / 2)
                        .attr('r', 18)
                        .style('fill', 'none')
                        .style('stroke', 'var(--vscode-charts-red)')
                        .style('stroke-width', '2px');
                    stateElement.append('circle')
                        .attr('cx', stateWidth / 2)
                        .attr('cy', stateHeight / 2)
                        .attr('r', 12)
                        .style('fill', 'var(--vscode-charts-red)');

                    stateElement.append('text')
                        .attr('x', stateWidth / 2)
                        .attr('y', stateHeight / 2 + 30)
                        .attr('text-anchor', 'middle')
                        .text(state.name)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-editor-foreground)');

                } else {
                    // Regular state: rounded rectangle with gradient
                    const gradient = defs.append('linearGradient')
                        .attr('id', 'state-gradient-' + stateKey.replace(/[^a-zA-Z0-9]/g, '_'))
                        .attr('x1', '0%').attr('y1', '0%')
                        .attr('x2', '0%').attr('y2', '100%');
                    gradient.append('stop')
                        .attr('offset', '0%')
                        .style('stop-color', 'var(--vscode-editor-background)');
                    gradient.append('stop')
                        .attr('offset', '100%')
                        .style('stop-color', 'var(--vscode-editorWidget-background)');

                    stateElement.append('rect')
                        .attr('width', stateWidth)
                        .attr('height', stateHeight)
                        .attr('rx', 8)
                        .attr('ry', 8)
                        .style('fill', 'url(#state-gradient-' + stateKey.replace(/[^a-zA-Z0-9]/g, '_') + ')')
                        .style('stroke', 'var(--vscode-charts-blue)')
                        .style('stroke-width', '2px')
                        .style('filter', 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))');

                    // State name - centered
                    const displayName = state.name.length > 18
                        ? state.name.substring(0, 15) + '...'
                        : state.name;

                    stateElement.append('text')
                        .attr('x', stateWidth / 2)
                        .attr('y', stateHeight / 2 + 4)
                        .attr('text-anchor', 'middle')
                        .text(displayName)
                        .style('font-size', '12px')
                        .style('font-weight', '600')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('pointer-events', 'none');

                    // Double-click to navigate
                    stateElement.on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: state.name
                        });
                    });
                }
            });
        }

        // Use Case View Renderer
        function renderUseCaseView(width, height, data = currentData) {
            if (!data || (!data.actors && !data.useCases) ||
                (data.actors && data.actors.length === 0 && data.useCases && data.useCases.length === 0)) {
                renderPlaceholderView(width, height, 'Use Case View',
                    'No actors or use cases found to display.\\n\\nThis view shows actors, use cases, and their relationships.',
                    data);
                return;
            }

            const actors = data.actors || [];
            const useCases = data.useCases || [];
            const actions = data.actions || [];
            const requirements = data.requirements || [];
            const relationships = data.relationships || [];

            // Layout configuration
            const useCaseWidth = 140;
            const useCaseHeight = 70;
            const actionWidth = 120;
            const actionHeight = 40;
            const requirementWidth = 130;
            const requirementHeight = 50;
            const actorSize = 60;
            const marginLeft = 80;
            const marginTop = 80;
            const horizontalSpacing = 180;
            const verticalSpacing = 120;
            const actorPositions = new Map();
            const useCasePositions = new Map();
            const actionPositions = new Map();
            const requirementPositions = new Map();

            if (usecaseLayoutOrientation === 'force') {
                // Force-directed layout
                const allNodes = [
                    ...actors.map(a => ({ id: a.name, type: 'actor', data: a, x: Math.random() * width, y: Math.random() * height })),
                    ...useCases.map(uc => ({ id: uc.name, type: 'usecase', data: uc, x: Math.random() * width, y: Math.random() * height })),
                    ...actions.map(a => ({ id: a.name, type: 'action', data: a, x: Math.random() * width, y: Math.random() * height })),
                    ...requirements.map(r => ({ id: r.name, type: 'requirement', data: r, x: Math.random() * width, y: Math.random() * height }))
                ];

                const nodeMap = new Map();
                allNodes.forEach(n => nodeMap.set(n.id, n));

                const links = relationships.map(r => ({
                    source: nodeMap.get(r.source),
                    target: nodeMap.get(r.target)
                })).filter(l => l.source && l.target);

                const simulation = d3.forceSimulation(allNodes)
                    .force('center', d3.forceCenter(width / 2, height / 2))
                    .force('charge', d3.forceManyBody().strength(-400))
                    .force('link', d3.forceLink(links).distance(200).strength(0.5))
                    .force('collide', d3.forceCollide().radius(100))
                    .force('x', d3.forceX(width / 2).strength(0.05))
                    .force('y', d3.forceY(height / 2).strength(0.05));

                simulation.stop();
                for (let i = 0; i < 300; ++i) simulation.tick();

                allNodes.forEach(n => {
                    const x = Math.max(marginLeft, Math.min(width - marginLeft - useCaseWidth, n.x));
                    const y = Math.max(marginTop, Math.min(height - marginTop - useCaseHeight, n.y));
                    if (n.type === 'actor') {
                        actorPositions.set(n.id, { x: x + actorSize / 2, y: y + actorSize / 2, actor: n.data });
                    } else if (n.type === 'action') {
                        actionPositions.set(n.id, { x: x, y: y, action: n.data });
                    } else if (n.type === 'requirement') {
                        requirementPositions.set(n.id, { x: x, y: y, requirement: n.data });
                    } else {
                        useCasePositions.set(n.id, { x: x, y: y, useCase: n.data });
                    }
                });
            } else if (usecaseLayoutOrientation === 'vertical') {
                // Vertical layout: actors on top, use cases below in rows, actions at bottom, requirements below
                const actorSpacing = Math.min(120, (width - marginLeft * 2) / Math.max(actors.length, 1));
                const actorStartX = marginLeft + (width - marginLeft * 2 - (actors.length - 1) * actorSpacing) / 2;

                actors.forEach((actor, index) => {
                    actorPositions.set(actor.name, {
                        x: actorStartX + index * actorSpacing,
                        y: marginTop + 40,
                        actor: actor
                    });
                });

                // Use cases in rows below
                const cols = Math.ceil(Math.sqrt(useCases.length * 1.5));
                const useCaseSpacingX = useCaseWidth + 40;
                const useCaseSpacingY = useCaseHeight + 40;
                const useCaseStartX = marginLeft + (width - marginLeft * 2 - (cols - 1) * useCaseSpacingX - useCaseWidth) / 2;
                const useCaseStartY = marginTop + 160;
                const useCaseRows = Math.ceil(useCases.length / cols);

                useCases.forEach((useCase, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    useCasePositions.set(useCase.name, {
                        x: useCaseStartX + col * useCaseSpacingX,
                        y: useCaseStartY + row * useCaseSpacingY,
                        useCase: useCase
                    });
                });

                // Calculate bottom of use cases section
                const useCaseBottomY = useCaseStartY + useCaseRows * useCaseSpacingY + 40;

                // Position actions below use cases
                let actionsBottomY = useCaseBottomY;
                if (actions.length > 0) {
                    const actionSpacingX = actionWidth + 30;
                    const actionStartY = useCaseBottomY;
                    const actionCols = Math.ceil(Math.sqrt(actions.length * 2));
                    const actionStartX = marginLeft + (width - marginLeft * 2 - (actionCols - 1) * actionSpacingX - actionWidth) / 2;
                    const actionRows = Math.ceil(actions.length / actionCols);

                    actions.forEach((action, index) => {
                        const col = index % actionCols;
                        const row = Math.floor(index / actionCols);
                        actionPositions.set(action.name, {
                            x: actionStartX + col * actionSpacingX,
                            y: actionStartY + row * (actionHeight + 30),
                            action: action
                        });
                    });

                    actionsBottomY = actionStartY + actionRows * (actionHeight + 30) + 40;
                }

                // Position requirements below actions in a row
                if (requirements.length > 0) {
                    const reqSpacingX = requirementWidth + 30;
                    const reqCols = Math.min(requirements.length, Math.floor((width - marginLeft * 2) / reqSpacingX));
                    const reqStartX = marginLeft + (width - marginLeft * 2 - (Math.min(requirements.length, reqCols) - 1) * reqSpacingX - requirementWidth) / 2;

                    requirements.forEach((req, index) => {
                        const col = index % reqCols;
                        const row = Math.floor(index / reqCols);
                        requirementPositions.set(req.name, {
                            x: reqStartX + col * reqSpacingX,
                            y: actionsBottomY + row * (requirementHeight + 20),
                            requirement: req
                        });
                    });
                }
            } else {
                // Horizontal layout (default): Actors along top, use cases below, actions and requirements at bottom
                const centerX = width / 2;

                // Position all actors along the top in a row
                const actorSpacing = Math.min(120, (width - marginLeft * 2) / Math.max(actors.length, 1));
                const actorStartX = marginLeft + (width - marginLeft * 2 - (actors.length - 1) * actorSpacing) / 2;
                const actorRowY = marginTop + 40;

                actors.forEach((actor, index) => {
                    actorPositions.set(actor.name, {
                        x: actorStartX + index * actorSpacing,
                        y: actorRowY,
                        actor: actor
                    });
                });

                // Position use cases in grid below actors
                const useCaseStartY = actorRowY + actorSize + 80; // Leave space below actors
                const cols = Math.ceil(Math.sqrt(useCases.length * 1.5));
                const useCaseSpacingX = useCaseWidth + 50;
                const useCaseSpacingY = useCaseHeight + 50;
                const useCaseStartX = centerX - (cols * useCaseSpacingX) / 2;
                const useCaseRows = Math.ceil(useCases.length / cols);

                useCases.forEach((useCase, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    useCasePositions.set(useCase.name, {
                        x: useCaseStartX + col * useCaseSpacingX,
                        y: useCaseStartY + row * useCaseSpacingY,
                        useCase: useCase
                    });
                });

                // Calculate bottom of use cases section
                const useCaseBottomY = useCaseStartY + useCaseRows * useCaseSpacingY + 40;

                // Position actions below use cases
                if (actions.length > 0) {
                    const actionCols = Math.ceil(Math.sqrt(actions.length * 2));
                    const actionSpacingX = actionWidth + 30;
                    const actionSpacingY = actionHeight + 25;
                    const actionStartX = centerX - (actionCols * actionSpacingX) / 2;

                    actions.forEach((action, index) => {
                        const col = index % actionCols;
                        const row = Math.floor(index / actionCols);
                        actionPositions.set(action.name, {
                            x: actionStartX + col * actionSpacingX,
                            y: useCaseBottomY + row * actionSpacingY,
                            action: action
                        });
                    });
                }

                // Position requirements at the bottom, below use cases/actions, in a row
                if (requirements.length > 0) {
                    // Calculate starting Y: below use cases and actions
                    const actionRows = actions.length > 0 ? Math.ceil(actions.length / Math.ceil(Math.sqrt(actions.length * 2))) : 0;
                    const reqStartY = useCaseBottomY + actionRows * (actionHeight + 25) + 60;

                    const reqSpacingX = requirementWidth + 30;
                    const reqCols = Math.min(requirements.length, Math.floor((width - marginLeft * 2) / reqSpacingX));
                    const reqStartX = centerX - (Math.min(requirements.length, reqCols) * reqSpacingX) / 2;
                    const reqRows = Math.ceil(requirements.length / reqCols);

                    requirements.forEach((req, index) => {
                        const col = index % reqCols;
                        const row = Math.floor(index / reqCols);
                        requirementPositions.set(req.name, {
                            x: reqStartX + col * reqSpacingX,
                            y: reqStartY + row * (requirementHeight + 20),
                            requirement: req
                        });
                    });
                }
            }

            // Helper function for case-insensitive position lookup
            function findActorPosition(name) {
                // Try exact match first
                if (actorPositions.has(name)) {
                    return actorPositions.get(name);
                }
                // Try case-insensitive match
                const nameLower = name.toLowerCase();
                for (const [key, value] of actorPositions.entries()) {
                    if (key.toLowerCase() === nameLower) {
                        return value;
                    }
                }
                return undefined;
            }

            // Draw relationships (behind use cases and actors) - wrapped in function for redraw on drag
            const relationshipGroup = g.append('g').attr('class', 'usecase-relationships');

            function drawUseCaseRelationships() {
                // Clear existing relationships
                relationshipGroup.selectAll('*').remove();

            relationships.forEach(rel => {
                let startX, startY, endX, endY;

                // Handle different relationship types
                if (rel.type === 'include') {
                    // Include relationship from action to child action
                    const sourcePos = actionPositions.get(rel.source);
                    const targetPos = actionPositions.get(rel.target);

                    if (!sourcePos || !targetPos) {
                        return;
                    }

                    startX = sourcePos.x + actionWidth / 2;
                    startY = sourcePos.y + actionHeight;
                    endX = targetPos.x + actionWidth / 2;
                    endY = targetPos.y;

                    // Dashed line with arrow for include
                    const relGroup = relationshipGroup.append('g');
                    relGroup.append('line')
                        .attr('x1', startX)
                        .attr('y1', startY)
                        .attr('x2', endX)
                        .attr('y2', endY)
                        .style('stroke', 'var(--vscode-charts-orange)')
                        .style('stroke-width', '1.5px')
                        .style('stroke-dasharray', '4,2');

                    // Add arrowhead
                    const angle = Math.atan2(endY - startY, endX - startX);
                    const arrowSize = 6;
                    relGroup.append('polygon')
                        .attr('points', [
                            [endX, endY],
                            [endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6)],
                            [endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6)]
                        ].map(p => p.join(',')).join(' '))
                        .style('fill', 'var(--vscode-charts-orange)');

                    // Add <<include>> label
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    relGroup.append('text')
                        .attr('x', midX + 5)
                        .attr('y', midY - 5)
                        .attr('text-anchor', 'start')
                        .style('font-size', '9px')
                        .style('fill', 'var(--vscode-charts-orange)')
                        .style('font-style', 'italic')
                        .text('«include»');

                    return;
                }

                if (rel.type === 'realize') {
                    // Relationship from use case to action (realization)
                    const sourcePos = useCasePositions.get(rel.source);
                    const targetPos = actionPositions.get(rel.target);

                    if (!sourcePos || !targetPos) {
                        return;
                    }

                    startX = sourcePos.x + useCaseWidth / 2;
                    startY = sourcePos.y + useCaseHeight;
                    endX = targetPos.x + actionWidth / 2;
                    endY = targetPos.y;

                    // Dashed line with arrow for realization
                    relationshipGroup.append('line')
                        .attr('x1', startX)
                        .attr('y1', startY)
                        .attr('x2', endX)
                        .attr('y2', endY)
                        .style('stroke', 'var(--vscode-charts-yellow)')
                        .style('stroke-width', '2px')
                        .style('stroke-dasharray', '5,3');

                    // Add arrowhead
                    const angle = Math.atan2(endY - startY, endX - startX);
                    const arrowSize = 8;
                    relationshipGroup.append('polygon')
                        .attr('points', [
                            [endX, endY],
                            [endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6)],
                            [endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6)]
                        ].map(p => p.join(',')).join(' '))
                        .style('fill', 'var(--vscode-charts-yellow)');

                    return;
                }

                if (rel.type === 'stakeholder') {
                    // Relationship from requirement to stakeholder (actor)
                    const sourcePos = requirementPositions.get(rel.source);
                    const targetPos = findActorPosition(rel.target);

                    if (!sourcePos || !targetPos) {
                        return;
                    }

                    startX = sourcePos.x + requirementWidth / 2;  // Center of requirement
                    startY = sourcePos.y;  // Top edge of requirement
                    endX = targetPos.x;
                    endY = targetPos.y + actorSize / 2;  // Bottom of actor

                    // Dashed line for stakeholder relationship
                    const relGroup = relationshipGroup.append('g');
                    relGroup.append('line')
                        .attr('x1', startX)
                        .attr('y1', startY)
                        .attr('x2', endX)
                        .attr('y2', endY)
                        .style('stroke', 'var(--vscode-charts-green)')
                        .style('stroke-width', '1.5px')
                        .style('stroke-dasharray', '4,2');

                    // Add arrowhead pointing to actor
                    const angle = Math.atan2(endY - startY, endX - startX);
                    const arrowSize = 6;
                    relGroup.append('polygon')
                        .attr('points', [
                            [endX, endY],
                            [endX - arrowSize * Math.cos(angle - Math.PI / 6), endY - arrowSize * Math.sin(angle - Math.PI / 6)],
                            [endX - arrowSize * Math.cos(angle + Math.PI / 6), endY - arrowSize * Math.sin(angle + Math.PI / 6)]
                        ].map(p => p.join(',')).join(' '))
                        .style('fill', 'var(--vscode-charts-green)');

                    // Add <<stakeholder>> label
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    relGroup.append('text')
                        .attr('x', midX)
                        .attr('y', midY - 5)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '9px')
                        .style('fill', 'var(--vscode-charts-green)')
                        .style('font-style', 'italic')
                        .text('«stakeholder»');

                    return;
                }

                // Actor to use case relationships
                const sourcePos = findActorPosition(rel.source);
                const targetPos = useCasePositions.get(rel.target);

                if (!sourcePos || !targetPos) {
                    return;
                }

                startX = sourcePos.x;
                startY = sourcePos.y + actorSize / 2;  // Bottom of actor (since actors are at top now)
                endX = targetPos.x + useCaseWidth / 2;
                endY = targetPos.y;  // Top of use case

                // Draw relationship line
                const lineColor = rel.type === 'subject' ? 'var(--vscode-charts-green)' : 'var(--vscode-charts-blue)';
                const lineStyle = rel.type === 'subject' ? '5,3' : 'none';

                relationshipGroup.append('line')
                    .attr('x1', startX)
                    .attr('y1', startY)
                    .attr('x2', endX)
                    .attr('y2', endY)
                    .style('stroke', lineColor)
                    .style('stroke-width', '2px')
                    .style('stroke-dasharray', lineStyle);

                // Add objective label if present
                if (rel.label) {
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;

                    // Truncate label if too long
                    const maxLabelLength = 40;
                    let labelText = rel.label;
                    if (labelText.length > maxLabelLength) {
                        labelText = labelText.substring(0, maxLabelLength - 3) + '...';
                    }

                    // Add background rect for better readability
                    const labelPadding = 4;
                    const labelGroup = relationshipGroup.append('g')
                        .attr('transform', 'translate(' + midX + ',' + midY + ')');

                    const textElement = labelGroup.append('text')
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .style('font-size', '10px')
                        .style('fill', 'var(--vscode-descriptionForeground)')
                        .style('font-style', 'italic')
                        .text(labelText);

                    // Get text dimensions for background
                    const bbox = textElement.node().getBBox();
                    labelGroup.insert('rect', 'text')
                        .attr('x', bbox.x - labelPadding)
                        .attr('y', bbox.y - labelPadding / 2)
                        .attr('width', bbox.width + labelPadding * 2)
                        .attr('height', bbox.height + labelPadding)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('opacity', '0.9');
                }
            });
            }  // End of drawUseCaseRelationships function

            // Draw initial relationships
            drawUseCaseRelationships();

            // Draw use cases (in front of relationships) with drag behavior
            const useCaseGroup = g.append('g').attr('class', 'usecase-nodes');

            useCasePositions.forEach((pos, useCaseName) => {
                const useCase = pos.useCase;

                const useCaseElement = useCaseGroup.append('g')
                    .attr('class', 'usecase-node')
                    .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                    .style('cursor', 'grab');

                // Add drag behavior
                const useCaseDrag = d3.drag()
                    .on('start', function(event) {
                        d3.select(this).raise().style('cursor', 'grabbing');
                    })
                    .on('drag', function(event) {
                        pos.x += event.dx;
                        pos.y += event.dy;
                        d3.select(this).attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
                        drawUseCaseRelationships();
                    })
                    .on('end', function(event) {
                        d3.select(this).style('cursor', 'grab');
                    });

                useCaseElement.call(useCaseDrag);

                // Use case oval
                useCaseElement.append('ellipse')
                    .attr('cx', useCaseWidth / 2)
                    .attr('cy', useCaseHeight / 2)
                    .attr('rx', useCaseWidth / 2)
                    .attr('ry', useCaseHeight / 2)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', 'var(--vscode-charts-purple)')
                    .style('stroke-width', '2px')
                    .on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: useCase.name
                        });
                    });

                // Use case name (wrapped if long)
                const maxChars = 16;
                const words = useCase.name.split(' ');
                let line1 = '';
                let line2 = '';

                if (useCase.name.length <= maxChars) {
                    line1 = useCase.name;
                } else {
                    // Try to split words across two lines
                    let charCount = 0;
                    for (let i = 0; i < words.length; i++) {
                        if (charCount + words[i].length > maxChars && line1) {
                            line2 = words.slice(i).join(' ');
                            break;
                        }
                        line1 += (i > 0 ? ' ' : '') + words[i];
                        charCount += words[i].length + 1;
                    }
                    if (line1.length > maxChars) {
                        line1 = line1.substring(0, maxChars - 3) + '...';
                    }
                    if (line2.length > maxChars) {
                        line2 = line2.substring(0, maxChars - 3) + '...';
                    }
                }

                if (line2) {
                    useCaseElement.append('text')
                        .attr('x', useCaseWidth / 2)
                        .attr('y', useCaseHeight / 2 - 6)
                        .attr('text-anchor', 'middle')
                        .text(line1)
                        .style('font-size', '12px')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');

                    useCaseElement.append('text')
                        .attr('x', useCaseWidth / 2)
                        .attr('y', useCaseHeight / 2 + 8)
                        .attr('text-anchor', 'middle')
                        .text(line2)
                        .style('font-size', '12px')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');
                } else {
                    useCaseElement.append('text')
                        .attr('x', useCaseWidth / 2)
                        .attr('y', useCaseHeight / 2 + 4)
                        .attr('text-anchor', 'middle')
                        .text(line1)
                        .style('font-size', '12px')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');
                }
            });

            // Draw requirements (between use cases and actors) with drag behavior
            const requirementGroup = g.append('g').attr('class', 'requirement-nodes');

            requirementPositions.forEach((pos, reqName) => {
                const requirement = pos.requirement;

                const reqElement = requirementGroup.append('g')
                    .attr('class', 'requirement-node')
                    .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                    .style('cursor', 'grab');

                // Add drag behavior
                const reqDrag = d3.drag()
                    .on('start', function(event) {
                        d3.select(this).raise().style('cursor', 'grabbing');
                    })
                    .on('drag', function(event) {
                        pos.x += event.dx;
                        pos.y += event.dy;
                        d3.select(this).attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
                        drawUseCaseRelationships();
                    })
                    .on('end', function(event) {
                        d3.select(this).style('cursor', 'grab');
                    });

                reqElement.call(reqDrag);

                // Requirement rectangle with note-style corner fold
                reqElement.append('path')
                    .attr('d', 'M0,0 L' + (requirementWidth - 12) + ',0 L' + requirementWidth + ',12 L' + requirementWidth + ',' + requirementHeight + ' L0,' + requirementHeight + ' Z')
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', '#B5CEA8')  // Green for requirements
                    .style('stroke-width', '2px')
                    .on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: requirement.name
                        });
                    });

                // Corner fold effect
                reqElement.append('path')
                    .attr('d', 'M' + (requirementWidth - 12) + ',0 L' + (requirementWidth - 12) + ',12 L' + requirementWidth + ',12')
                    .style('fill', 'none')
                    .style('stroke', '#B5CEA8')
                    .style('stroke-width', '1px');

                // <<requirement>> stereotype
                reqElement.append('text')
                    .attr('x', requirementWidth / 2)
                    .attr('y', 12)
                    .attr('text-anchor', 'middle')
                    .text('«req»')
                    .style('font-size', '9px')
                    .style('fill', '#B5CEA8')
                    .style('font-style', 'italic')
                    .style('user-select', 'none');

                // Requirement name (truncated if long)
                const maxChars = 18;
                let displayName = requirement.name;
                if (displayName.length > maxChars) {
                    displayName = displayName.substring(0, maxChars - 3) + '...';
                }

                reqElement.append('text')
                    .attr('x', requirementWidth / 2)
                    .attr('y', requirementHeight / 2 + 6)
                    .attr('text-anchor', 'middle')
                    .text(displayName)
                    .style('font-size', '11px')
                    .style('fill', 'var(--vscode-editor-foreground)')
                    .style('font-weight', '500')
                    .style('user-select', 'none');
            });

            // Draw actors (in front of everything) with drag behavior
            const actorGroup = g.append('g').attr('class', 'actor-nodes');

            actorPositions.forEach((pos, actorName) => {
                const actor = pos.actor;

                const actorElement = actorGroup.append('g')
                    .attr('class', 'actor-node')
                    .attr('transform', 'translate(' + (pos.x - actorSize / 2) + ',' + (pos.y - actorSize / 2) + ')')
                    .style('cursor', 'grab')
                    .on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: actor.name
                        });
                    });

                // Add drag behavior
                const actorDrag = d3.drag()
                    .on('start', function(event) {
                        d3.select(this).raise().style('cursor', 'grabbing');
                    })
                    .on('drag', function(event) {
                        pos.x += event.dx;
                        pos.y += event.dy;
                        d3.select(this).attr('transform', 'translate(' + (pos.x - actorSize / 2) + ',' + (pos.y - actorSize / 2) + ')');
                        drawUseCaseRelationships();
                    })
                    .on('end', function(event) {
                        d3.select(this).style('cursor', 'grab');
                    });

                actorElement.call(actorDrag);

                // Stick figure
                const headRadius = 8;
                const bodyHeight = 20;
                const armWidth = 12;
                const legHeight = 15;

                // Head
                actorElement.append('circle')
                    .attr('cx', actorSize / 2)
                    .attr('cy', 10)
                    .attr('r', headRadius)
                    .style('fill', 'none')
                    .style('stroke', 'var(--vscode-charts-orange)')
                    .style('stroke-width', '2px');

                // Body
                actorElement.append('line')
                    .attr('x1', actorSize / 2)
                    .attr('y1', 10 + headRadius)
                    .attr('x2', actorSize / 2)
                    .attr('y2', 10 + headRadius + bodyHeight)
                    .style('stroke', 'var(--vscode-charts-orange)')
                    .style('stroke-width', '2px');

                // Arms
                actorElement.append('line')
                    .attr('x1', actorSize / 2 - armWidth)
                    .attr('y1', 10 + headRadius + 8)
                    .attr('x2', actorSize / 2 + armWidth)
                    .attr('y2', 10 + headRadius + 8)
                    .style('stroke', 'var(--vscode-charts-orange)')
                    .style('stroke-width', '2px');

                // Legs
                actorElement.append('line')
                    .attr('x1', actorSize / 2)
                    .attr('y1', 10 + headRadius + bodyHeight)
                    .attr('x2', actorSize / 2 - armWidth)
                    .attr('y2', 10 + headRadius + bodyHeight + legHeight)
                    .style('stroke', 'var(--vscode-charts-orange)')
                    .style('stroke-width', '2px');

                actorElement.append('line')
                    .attr('x1', actorSize / 2)
                    .attr('y1', 10 + headRadius + bodyHeight)
                    .attr('x2', actorSize / 2 + armWidth)
                    .attr('y2', 10 + headRadius + bodyHeight + legHeight)
                    .style('stroke', 'var(--vscode-charts-orange)')
                    .style('stroke-width', '2px');

                // Actor name below figure
                const truncatedName = actor.name.length > 12 ? actor.name.substring(0, 9) + '...' : actor.name;
                actorElement.append('text')
                    .attr('x', actorSize / 2)
                    .attr('y', 10 + headRadius + bodyHeight + legHeight + 18)
                    .attr('text-anchor', 'middle')
                    .text(truncatedName)
                    .style('font-size', '11px')
                    .style('fill', 'var(--vscode-editor-foreground)')
                    .style('user-select', 'none');
            });

            // Draw actions (implementing use cases) with drag behavior
            if (actionPositions.size > 0) {
                const actionGroup = g.append('g').attr('class', 'action-nodes');

                actionPositions.forEach((pos, actionName) => {
                    const action = pos.action;

                    const actionElement = actionGroup.append('g')
                        .attr('class', 'action-node')
                        .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                        .style('cursor', 'grab')
                        .on('dblclick', function(event) {
                            event.stopPropagation();
                            vscode.postMessage({
                                command: 'jumpToElement',
                                elementName: action.name
                            });
                        });

                    // Add drag behavior
                    const actionDrag = d3.drag()
                        .on('start', function(event) {
                            d3.select(this).raise().style('cursor', 'grabbing');
                        })
                        .on('drag', function(event) {
                            pos.x += event.dx;
                            pos.y += event.dy;
                            d3.select(this).attr('transform', 'translate(' + pos.x + ',' + pos.y + ')');
                            drawUseCaseRelationships();
                        })
                        .on('end', function(event) {
                            d3.select(this).style('cursor', 'grab');
                        });

                    actionElement.call(actionDrag);

                    // Action rounded rectangle (UML activity style)
                    actionElement.append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', actionWidth)
                        .attr('height', actionHeight)
                        .attr('rx', 15)
                        .attr('ry', 15)
                        .style('fill', 'var(--vscode-editor-background)')
                        .style('stroke', 'var(--vscode-charts-yellow)')
                        .style('stroke-width', '2px');

                    // Action name
                    const truncatedActionName = action.name.length > 18
                        ? action.name.substring(0, 15) + '...'
                        : action.name;

                    actionElement.append('text')
                        .attr('x', actionWidth / 2)
                        .attr('y', actionHeight / 2 + 4)
                        .attr('text-anchor', 'middle')
                        .text(truncatedActionName)
                        .style('font-size', '11px')
                        .style('fill', 'var(--vscode-editor-foreground)')
                        .style('user-select', 'none');
                });
            }
        }

        // Package View Renderer
        function renderPackageView(width, height, data = currentData) {
            if (!data || !data.nodes || data.nodes.length === 0) {
                renderPlaceholderView(width, height, 'Package View',
                    'No packages found to display.\\n\\nThis view shows package containment and dependencies.',
                    data);
                return;
            }

            const nodes = data.nodes || [];
            const dependencies = data.dependencies || [];

            // Determine if horizontal or vertical layout
            const isHorizontal = layoutDirection === 'horizontal';

            // Uniform package size as requested by user
            const packageWidth = 180;
            const packageHeight = 120;
            const horizontalSpacing = 60;
            const verticalSpacing = 80;
            const startX = 100;
            const startY = 100;

            // Grid layout - prefer more columns for horizontal, more rows for vertical
            const cols = isHorizontal
                ? Math.ceil(Math.sqrt(nodes.length * 2))  // More columns for horizontal
                : Math.ceil(Math.sqrt(nodes.length / 2)); // Fewer columns for vertical
            const packagePositions = new Map();

            nodes.forEach((pkg, index) => {
                const col = index % Math.max(1, cols);
                const row = Math.floor(index / Math.max(1, cols));
                packagePositions.set(pkg.id, {
                    x: startX + col * (packageWidth + horizontalSpacing),
                    y: startY + row * (packageHeight + verticalSpacing),
                    package: pkg
                });
            });

            // Draw dependencies (behind packages)
            const dependencyGroup = g.append('g').attr('class', 'package-dependencies');

            dependencies.forEach(dep => {
                const sourcePos = packagePositions.get(dep.sourceId);
                const targetPos = packagePositions.get(dep.targetId);

                if (!sourcePos || !targetPos) {
                    return;
                }

                const startX = sourcePos.x + packageWidth / 2;
                const startY = sourcePos.y + packageHeight;
                const endX = targetPos.x + packageWidth / 2;
                const endY = targetPos.y;

                // Draw dependency line
                const lineStyle = dep.kind === 'import' ? '5,5' : '0';

                dependencyGroup.append('line')
                    .attr('x1', startX)
                    .attr('y1', startY)
                    .attr('x2', endX)
                    .attr('y2', endY)
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '2px')
                    .style('stroke-dasharray', lineStyle)
                    .style('marker-end', 'url(#package-arrowhead)');

                // Label for dependency type
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                dependencyGroup.append('text')
                    .attr('x', midX)
                    .attr('y', midY - 5)
                    .attr('text-anchor', 'middle')
                    .text('<<' + dep.kind + '>>')
                    .style('font-size', '9px')
                    .style('fill', 'var(--vscode-charts-blue)')
                    .style('font-style', 'italic');
            });

            // Add arrowhead marker
            const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');

            defs.append('marker')
                .attr('id', 'package-arrowhead')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style('fill', 'var(--vscode-charts-blue)');

            // Draw packages
            const packageGroup = g.append('g').attr('class', 'package-nodes');

            packagePositions.forEach((pos, pkgId) => {
                const pkg = pos.package;

                const packageElement = packageGroup.append('g')
                    .attr('class', 'package-node')
                    .attr('transform', 'translate(' + pos.x + ',' + pos.y + ')')
                    .style('cursor', 'pointer');

                // Package rectangle (tab style)
                const tabHeight = 25;
                const tabWidth = 60;

                // Main body
                packageElement.append('rect')
                    .attr('width', packageWidth)
                    .attr('height', packageHeight)
                    .attr('rx', 4)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '2px')
                    .on('click', function(event) {
                        event.stopPropagation();
                    })
                    .on('dblclick', function(event) {
                        event.stopPropagation();
                        vscode.postMessage({
                            command: 'jumpToElement',
                            elementName: pkg.name
                        });
                    });

                // Tab at top left
                packageElement.append('rect')
                    .attr('x', 0)
                    .attr('y', -tabHeight)
                    .attr('width', tabWidth)
                    .attr('height', tabHeight)
                    .attr('rx', 4)
                    .style('fill', 'var(--vscode-editor-background)')
                    .style('stroke', 'var(--vscode-charts-blue)')
                    .style('stroke-width', '2px');

                // Package icon in tab
                packageElement.append('text')
                    .attr('x', tabWidth / 2)
                    .attr('y', -tabHeight / 2 + 5)
                    .attr('text-anchor', 'middle')
                    .text('▤')
                    .style('font-size', '14px')
                    .style('fill', 'var(--vscode-charts-blue)')
                    .style('user-select', 'none');

                // Package name (truncated if too long)
                const pkgName = pkg.name || 'Unnamed Package';
                const truncatedName = pkgName.length > 20 ? pkgName.substring(0, 17) + '...' : pkgName;
                packageElement.append('text')
                    .attr('x', packageWidth / 2)
                    .attr('y', 25)
                    .attr('text-anchor', 'middle')
                    .text(truncatedName)
                    .style('font-size', '13px')
                    .style('font-weight', 'bold')
                    .style('fill', 'var(--vscode-editor-foreground)')
                    .style('user-select', 'none');

                // Package kind/stereotype
                if (pkg.kind && pkg.kind !== 'standard') {
                    packageElement.append('text')
                        .attr('x', packageWidth / 2)
                        .attr('y', 42)
                        .attr('text-anchor', 'middle')
                        .text('<<' + pkg.kind + '>>')
                        .style('font-size', '10px')
                        .style('fill', 'var(--vscode-descriptionForeground)')
                        .style('font-style', 'italic')
                        .style('user-select', 'none');
                }

                // Show child packages count (as requested - show children)
                if (pkg.childPackageIds && pkg.childPackageIds.length > 0) {
                    packageElement.append('text')
                        .attr('x', 10)
                        .attr('y', packageHeight - 30)
                        .text('└ ' + pkg.childPackageIds.length + ' child package' + (pkg.childPackageIds.length > 1 ? 's' : ''))
                        .style('font-size', '10px')
                        .style('fill', 'var(--vscode-descriptionForeground)')
                        .style('user-select', 'none');
                }

                // Show element count - use children length as fallback
                const elCount = pkg.elementCount || (pkg.children ? pkg.children.length : 0) || 0;
                packageElement.append('text')
                    .attr('x', 10)
                    .attr('y', packageHeight - 12)
                    .text('◉ ' + elCount + ' element' + (elCount !== 1 ? 's' : ''))
                    .style('font-size', '10px')
                    .style('fill', 'var(--vscode-descriptionForeground)')
                    .style('user-select', 'none');
            });
        }

        // Placeholder renderer for views under development
        function renderPlaceholderView(width, height, viewName, message, data) {
            const messageGroup = g.append('g')
                .attr('class', 'placeholder-message')
                .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2 - 100) + ')');

            // Icon
            messageGroup.append('text')
                .attr('x', 0)
                .attr('y', -40)
                .attr('text-anchor', 'middle')
                .text('🚧')
                .style('font-size', '64px');

            // View name
            messageGroup.append('text')
                .attr('x', 0)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .text(viewName)
                .style('font-size', '24px')
                .style('fill', 'var(--vscode-editor-foreground)')
                .style('font-weight', 'bold');

            // Message lines
            const lines = message.split('\\n');
            lines.forEach((line, i) => {
                messageGroup.append('text')
                    .attr('x', 0)
                    .attr('y', 60 + (i * 25))
                    .attr('text-anchor', 'middle')
                    .text(line)
                    .style('font-size', '14px')
                    .style('fill', 'var(--vscode-descriptionForeground)');
            });

            // Element count if available
            if (data && data.elements && data.elements.length > 0) {
                messageGroup.append('text')
                    .attr('x', 0)
                    .attr('y', 120 + (lines.length * 25))
                    .attr('text-anchor', 'middle')
                    .text('Found ' + data.elements.length + ' element(s) in model')
                    .style('font-size', '12px')
                    .style('fill', 'var(--vscode-charts-blue)')
                    .style('font-style', 'italic');
            }
        }

        // Add event listeners for view buttons (DOM should be ready since script is at end)
        const viewDropdownBtn = document.getElementById('view-dropdown-btn');
        const viewDropdownMenu = document.getElementById('view-dropdown-menu');

        if (viewDropdownBtn && viewDropdownMenu) {
            viewDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = viewDropdownMenu.classList.contains('show');
                viewDropdownMenu.classList.toggle('show', !isVisible);
            });
        }

        const dropdownItems = document.querySelectorAll('.view-dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const selectedView = e.currentTarget.getAttribute('data-view');
                if (viewDropdownMenu) {
                    viewDropdownMenu.classList.remove('show');
                }
                if (selectedView) {
                    changeView(selectedView);
                }
            });
        });

        // Set initial active view button
        updateActiveViewButton(currentView);

        // Add event listeners for action buttons
        document.getElementById('fit-btn').addEventListener('click', zoomToFit);
        document.getElementById('reset-btn').addEventListener('click', resetZoom);
        document.getElementById('layout-direction-btn').addEventListener('click', toggleLayoutDirection);
        document.getElementById('category-headers-btn').addEventListener('click', toggleCategoryHeaders);
        document.getElementById('clear-filter-btn').addEventListener('click', clearSelection);

        // Add diagram selector change handler
        const diagramSelector = document.getElementById('diagram-selector');
        if (diagramSelector) {
            diagramSelector.addEventListener('change', (e) => {
                selectedDiagramIndex = parseInt(e.target.value, 10) || 0;
                // Re-render current view with new selection
                renderVisualization(currentView);
            });
        }

        // Add export dropdown functionality
    const exportBtn = document.getElementById('export-btn');
    const exportMenu = document.getElementById('export-menu');

        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = exportMenu.classList.contains('show');

            if (!isVisible) {
                // Position dropdown using fixed positioning for better visibility
                const btnRect = exportBtn.getBoundingClientRect();
                const menuWidth = 160;
                const menuHeight = 200; // Approximate height
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // Calculate optimal position
                let left = btnRect.right - menuWidth;
                let top = btnRect.bottom + 4;

                // Adjust if would overflow viewport
                if (left < 8) left = btnRect.left;
                if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
                if (top + menuHeight > viewportHeight - 8) top = btnRect.top - menuHeight - 4;

                exportMenu.style.left = left + 'px';
                exportMenu.style.top = top + 'px';
            }

            exportMenu.classList.toggle('show', !isVisible);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
                exportMenu.classList.remove('show');
            }
            if (viewDropdownBtn && viewDropdownMenu &&
                !viewDropdownBtn.contains(e.target) &&
                !viewDropdownMenu.contains(e.target)) {
                viewDropdownMenu.classList.remove('show');
            }
        });

        // Handle export menu item clicks
        document.querySelectorAll('.export-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-format');
                exportMenu.classList.remove('show');

                switch(format) {
                    case 'png':
                        exportPNG();
                        break;
                    case 'svg':
                        exportSVG();
                        break;
                    case 'pdf':
                        exportPDF();
                        break;
                    case 'json':
                        exportJSON();
                        break;
                }
            });
        });
    </script>
</body>
</html>`;
    }
}
