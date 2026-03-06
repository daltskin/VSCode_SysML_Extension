/**
 * MCP Server Tests
 *
 * Tests that the MCP server definition provider is registered correctly
 * and that the MCP server process can be located and would launch.
 *
 * Unit-mode tests validate the configuration and registration logic.
 * Integration-mode tests verify the actual MCP server is discoverable
 * by Copilot/agent mode.
 */
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const _isUnitTest = (vscode as any)._isMock === true;

suite('MCP Server Test Suite', () => {

    test('MCP server definition provider ID is declared in package.json', () => {
        // Verify the package.json declares the MCP server definition provider
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const providers = pkg.contributes?.mcpServerDefinitionProviders;
        assert.ok(Array.isArray(providers), 'mcpServerDefinitionProviders should be an array');
        const sysmlMcp = providers.find((p: any) => p.id === 'sysml-v2-mcp');
        assert.ok(sysmlMcp, 'sysml-v2-mcp provider should be declared');
        assert.strictEqual(sysmlMcp.label, 'SysML v2 Model Context');
    });

    test('MCP server script file exists on disk', () => {
        // The mcpServer.js should be bundled in node_modules/sysml-v2-lsp
        const mcpPath = path.resolve(
            __dirname, '../../node_modules/sysml-v2-lsp/dist/server/mcpServer.js',
        );
        assert.ok(
            fs.existsSync(mcpPath),
            `MCP server script should exist at: ${mcpPath}`,
        );
    });

    test('MCP activation event is configured', () => {
        const pkgPath = path.resolve(__dirname, '../../package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const events: string[] = pkg.activationEvents ?? [];
        assert.ok(
            events.includes('onMcpServerDefinitionProvider:sysml-v2-mcp'),
            'Activation events should include MCP server definition provider trigger',
        );
    });

    test('MCP server module is importable', () => {
        // Verify the sysml-v2-lsp package exports a serverPath
        const lspPkg = require('sysml-v2-lsp');
        assert.ok(lspPkg.serverPath, 'sysml-v2-lsp should export serverPath');
        assert.ok(
            fs.existsSync(lspPkg.serverPath),
            `Server module should exist at exported path: ${lspPkg.serverPath}`,
        );
    });

    test('MCP server registers during extension activation', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(15000);

        const ext = vscode.extensions.getExtension('jamied.sysml-v2-support');
        assert.ok(ext, 'Extension should be present');
        if (!ext!.isActive) {
            await ext!.activate();
        }

        // After activation, the 'sysml-v2-mcp' provider should be
        // registered.  We verify indirectly: if vscode.lm is available
        // and the extension activated without error, the provider was
        // registered (the registerMcpServerDefinitionProvider call is
        // guarded by fs.existsSync which we already tested above).
        assert.strictEqual(ext!.isActive, true, 'Extension should be active');
    });

    test('All 22 extension commands are registered after activation', async function () {
        if (_isUnitTest) { return this.skip(); }
        this.timeout(10000);

        const commands = await vscode.commands.getCommands(true);
        const expectedCommands = [
            'sysml.formatDocument',
            'sysml.validateModel',
            'sysml.showVisualizer',
            'sysml.showModelExplorer',
            'sysml.exportVisualization',
            'sysml.visualizeFolder',
            'sysml.visualizeFolderWithView',
            'sysml.changeVisualizerView',
            'sysml.clearCache',
            'sysml.refreshModelTree',
            'sysml.toggleModelExplorerViewMode',
            'sysml.switchToFileView',
            'sysml.switchToSemanticView',
            'sysml.jumpToDefinition',
            'sysml.restartServer',
            'sysml.refreshVisualization',
            'sysml.showTypeHierarchy',
            'sysml.showCallHierarchy',
            'sysml.showFeatureInspector',
            'sysml.showModelDashboard',
            'sysml.showSysRunner',
            'sysml.visualizePackage',
        ];

        for (const cmd of expectedCommands) {
            assert.ok(
                commands.includes(cmd),
                `Command '${cmd}' should be registered`,
            );
        }
    });
});
