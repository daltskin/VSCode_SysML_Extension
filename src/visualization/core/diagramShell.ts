import * as vscode from "vscode";

export interface DiagramResourceHost {
    readonly cspSource: string;
    asWebviewUri(uri: vscode.Uri): vscode.Uri;
}

export function diagramShell(webview: DiagramResourceHost, extensionUri: vscode.Uri, version = ""): string {
        // Get URIs for local vendor scripts
        const d3Uri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'd3.min.js'));
        const elkUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'elk.bundled.js'));
        const elkWorkerUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'webview', 'elkWorker.js'));
        const cytoscapeUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape.min.js'));
        const cytoscapeElkUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape-elk.js'));
        const cytoscapeSvgUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'vendor', 'cytoscape-svg.js'));
        const nonce = _getNonce();
        const runtimeUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "media", "diagram-runtime", "runtime.js"));

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'nonce-${nonce}'; img-src ${webview.cspSource} data:; font-src ${webview.cspSource}; worker-src ${webview.cspSource} blob:;">
    <title>SysML Model Visualizer</title>
    <script nonce="${nonce}" src="${runtimeUri}"></script>
    <script nonce="${nonce}" src="${d3Uri}"></script>
    <script nonce="${nonce}" src="${elkUri}"></script>
    <script nonce="${nonce}" src="${cytoscapeUri}"></script>
    <script nonce="${nonce}" src="${cytoscapeElkUri}"></script>
    <script nonce="${nonce}" src="${cytoscapeSvgUri}"></script>
    <style nonce="${nonce}">
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
            max-height: 80vh;
            overflow-y: auto;
            background: var(--vscode-menu-background, var(--vscode-dropdown-background));
            border: 1px solid var(--vscode-menu-border, var(--vscode-panel-border));
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            padding: 4px;
            display: none;
            flex-direction: column;
            gap: 1px;
            z-index: 600;
        }
        .view-dropdown-menu.show {
            display: flex;
        }
        .view-dropdown-item {
            display: flex;
            align-items: center;
            gap: 6px;
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
            cursor: pointer;
            text-align: left;
            transition: background 0.1s ease;
        }
        .view-dropdown-item .icon {
            display: inline-block;
            width: 14px;
            text-align: center;
            flex-shrink: 0;
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
        .export-submenu-container {
            position: relative;
        }
        .export-submenu-container .export-menu-item::after {
            content: '▸';
            float: right;
            margin-left: 8px;
        }
        .export-submenu {
            display: none;
            position: absolute;
            left: 100%;
            top: 0;
            background-color: var(--vscode-menu-background);
            border: 1px solid var(--vscode-menu-border);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            min-width: 140px;
            z-index: 10001;
            padding: 4px;
        }
        .export-submenu-container:hover .export-submenu {
            display: block;
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
            overflow: hidden;
        }
        #pkg-dropdown {
            position: absolute;
            top: 8px;
            left: 12px;
            z-index: 500;
            display: none;
            align-items: center;
            gap: 8px;
        }
        #pkg-dropdown .view-dropdown-menu {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
        }
        #visualization {
            width: 100%;
            height: 100%;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }
        #legend-popup {
            display: none;
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 1000;
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            padding: 14px 18px;
            min-width: 240px;
            max-width: 320px;
            font-size: 12px;
            color: var(--vscode-editor-foreground);
        }
        #about-backdrop {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.45);
            z-index: 2000;
            justify-content: center;
            align-items: center;
        }
        #about-backdrop.show {
            display: flex;
        }
        #about-popup {
            background: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            padding: 18px 22px;
            min-width: 300px;
            max-width: 400px;
            font-size: 12px;
            color: var(--vscode-editor-foreground);
            animation: aboutFadeIn 0.15s ease;
        }
        @keyframes aboutFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to   { opacity: 1; transform: scale(1); }
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
        .node-group.highlighted-element .node-background {
            stroke: #FFD700 !important;
            stroke-width: 3px !important;
            filter: drop-shadow(0 0 8px #FFD700);
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

        /* ── Easter egg ──────────────────────────────────────── */
        #ee-egg {
            display: none;
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            padding: 3px 5px;
            border-radius: 4px;
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground);
            opacity: 0;
            transition: opacity 0.6s ease-in;
            user-select: none;
        }
        #ee-egg.revealed {
            display: inline-block;
            opacity: 1;
        }
        #ee-egg:hover {
            background: var(--vscode-button-hoverBackground);
            transform: scale(1.3);
            transition: transform 0.15s ease, background 0.15s ease;
        }
        @keyframes ee-wobble {
            0%,100% { transform: rotate(0deg); }
            20%  { transform: rotate(-8deg); }
            40%  { transform: rotate(10deg); }
            60%  { transform: rotate(-6deg); }
            80%  { transform: rotate(4deg); }
        }
        #ee-egg.hatch {
            animation: ee-wobble 0.5s ease;
        }
    </style>
</head>
<body>
    <div id="controls">
        <div style="display: flex; align-items: center; gap: 4px 8px; flex-wrap: wrap; padding: 2px 0;">
            <div class="view-dropdown">
                <button id="view-dropdown-btn" class="view-btn" title="Switch between visualization views">
                    <span style="font-size: 8px;">▼</span> View
                </button>
                <div id="view-dropdown-menu" class="view-dropdown-menu">
                    <button class="view-dropdown-item" data-view="elk"><span class="icon">◆</span> General</button>
                    <button class="view-dropdown-item" data-view="ibd"><span class="icon">▦</span> Interconnection</button>
                    <button class="view-dropdown-item" data-view="activity"><span class="icon">▶</span> Activity</button>
                    <button class="view-dropdown-item" data-view="state"><span class="icon">⌘</span> State</button>
                    <button class="view-dropdown-item" data-view="sequence"><span class="icon">⇄</span> Sequence</button>
                    <button class="view-dropdown-item" data-view="usecase"><span class="icon">◎</span> Case</button>
                    <div style="border-top: 1px solid var(--vscode-panel-border); margin: 3px 0;"></div>
                    <button class="view-dropdown-item" data-view="tree"><span class="icon">▲</span> Tree</button>
                    <button class="view-dropdown-item" data-view="package"><span class="icon">▤</span> Package</button>
                    <button class="view-dropdown-item" data-view="graph"><span class="icon">●</span> Graph</button>
                    <button class="view-dropdown-item" data-view="hierarchy"><span class="icon">■</span> Hierarchy</button>
                </div>
            </div>
            <span style="color: var(--vscode-panel-border);">|</span>
            <button id="fit-btn" class="action-btn" title="Fit diagram to view">⊞ Fit</button>
            <button id="reset-btn" class="action-btn" title="Reset zoom">↻ Reset</button>
            <button id="layout-direction-btn" class="action-btn" title="Toggle layout direction">→ LR</button>
            <button id="category-headers-btn" class="action-btn active" title="Toggle category headers" style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); border-color: var(--vscode-button-background);">☰ Grouped</button>
            <button id="layout-mode-btn" class="action-btn active" title="Toggle Grid vs. connection-driven layout" style="background: var(--vscode-button-background); color: var(--vscode-button-foreground); border-color: var(--vscode-button-background);">▦ Grid</button>
            <button id="minimap-toolbar-btn" class="action-btn" title="Toggle minimap">⊡ Map</button>
            <button id="dashboard-btn" class="action-btn" title="Open Model Dashboard">📊 Dashboard</button>
            <button id="workbench-btn" class="action-btn" title="Open Model Workbench">Edit Model</button>
            <button id="legend-btn" class="action-btn" title="Show diagram legend">🔑 Legend</button>
            <button id="ee-egg" title="What's this?">🥚</button>
            <button id="about-btn" class="action-btn" title="About this extension">ℹ️ About</button>
            <button id="activity-debug-btn" class="action-btn" title="Show Labels on Forks and Joins" style="display: none;">🏷️ Show Labels</button>
            <span style="color: var(--vscode-panel-border);">|</span>
            <div class="export-dropdown" style="position: relative; display: inline-block;">
                <button id="export-btn" class="action-btn" title="Export diagram">⇓ Export</button>
                <div id="export-menu" class="export-menu">
                    <div class="export-submenu-container">
                        <button class="export-menu-item" data-format="png-parent">PNG</button>
                        <div class="export-submenu">
                            <button class="export-menu-item" data-format="png" data-scale="1">1x - Original</button>
                            <button class="export-menu-item" data-format="png" data-scale="2">2x - Double ✓</button>
                            <button class="export-menu-item" data-format="png" data-scale="3">3x - Triple</button>
                            <button class="export-menu-item" data-format="png" data-scale="4">4x - Quadruple</button>
                        </div>
                    </div>
                    <button class="export-menu-item" data-format="svg">SVG</button>
                    <button class="export-menu-item" data-format="json">JSON</button>
                </div>
            </div>
            <span style="color: var(--vscode-panel-border);">|</span>
            <input type="text" class="filter-input" id="element-filter" placeholder="Filter..." title="Filter elements">
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

    <div id="visualization-wrapper">
        <div id="pkg-dropdown">
            <button id="pkg-dropdown-btn" class="view-btn" title="Filter by package or diagram">
                <span style="font-size: 8px;">▼</span> <span id="pkg-dropdown-label">Package</span>
            </button>
            <div id="pkg-dropdown-menu" class="view-dropdown-menu"></div>
        </div>
        <div id="visualization"></div>
        <!-- Legend popup overlay -->
        <div id="legend-popup">
            <div id="legend-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 8px; cursor: grab; user-select: none;">
                <span style="font-weight: 600; font-size: 13px;">Diagram Legend</span>
                <button id="legend-close-btn" style="background: none; border: none; color: var(--vscode-editor-foreground); cursor: pointer; font-size: 16px; padding: 0 2px; opacity: 0.7;" title="Close legend">✕</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 7px;">
                <div style="font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; margin-top: 2px;">Relationships</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#569CD6" stroke-width="2" stroke-dasharray="5,3"/><polygon points="32,2 40,6 32,10" fill="#569CD6"/></svg>
                    <span>Typing <code style="font-size: 10px; opacity: 0.8;">: Type</code></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#C586C0" stroke-width="2"/><polygon points="32,2 40,6 32,10" fill="#C586C0"/></svg>
                    <span>Specialization <code style="font-size: 10px; opacity: 0.8;">:&gt;</code></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="14"><polygon points="0,3 7,7 0,11" fill="#4EC9B0"/><line x1="7" y1="7" x2="40" y2="7" stroke="#4EC9B0" stroke-width="2"/></svg>
                    <span>Containment <code style="font-size: 10px; opacity: 0.8;">◆</code></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="40" y2="6" stroke="#D7BA7D" stroke-width="2.5"/></svg>
                    <span>Connection</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#D7BA7D" stroke-width="2.5"/><circle cx="36" cy="6" r="4" fill="none" stroke="#D7BA7D" stroke-width="1.5"/></svg>
                    <span>Interface</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#4EC9B0" stroke-width="2.5"/><polygon points="32,2 40,6 32,10" fill="#4EC9B0"/></svg>
                    <span>Flow</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="40" y2="6" stroke="#808080" stroke-width="1.5" stroke-dasharray="4,3"/></svg>
                    <span>Binding <code style="font-size: 10px; opacity: 0.8;">=</code></span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#B5CEA8" stroke-width="2" stroke-dasharray="6,3"/><polygon points="32,2 40,6 32,10" fill="#B5CEA8"/></svg>
                    <span>Allocation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#D4D4D4" stroke-width="1.5" stroke-dasharray="5,3"/><polygon points="32,2 40,6 32,10" fill="#D4D4D4"/></svg>
                    <span>Dependency</span>
                </div>
                <div style="font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; margin-top: 6px;">Structure</div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg width="40" height="12"><line x1="0" y1="6" x2="32" y2="6" stroke="#6A9955" stroke-width="1.5" stroke-dasharray="2,3"/><polygon points="32,2 40,6 32,10" fill="#6A9955"/></svg>
                    <span>Hierarchy <span style="font-size: 10px; opacity: 0.7;">(parent→child)</span></span>
                </div>
            </div>
        </div>
        <!-- About popup modal -->
        <div id="about-backdrop">
            <div id="about-popup">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--vscode-panel-border); padding-bottom: 10px;">
                    <span style="font-weight: 700; font-size: 15px;">SysML v2 Extension</span>
                    <button id="about-close-btn" style="background: none; border: none; color: var(--vscode-editor-foreground); cursor: pointer; font-size: 18px; padding: 0 4px; opacity: 0.7;" title="Close">✕</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; line-height: 1.5;">
                    <p style="margin: 0;">A comprehensive SysML v2.0 language support extension for VS Code with syntax highlighting, formatting, validation, navigation, and interactive visualizations.</p>
                    <div style="display: flex; gap: 10px; margin-top: 8px;">
                        <button id="about-rate-link" class="action-btn" style="font-size: 11px; cursor: pointer;" title="Rate on marketplace">⭐ Rate</button>
                        <button id="about-repo-link" class="action-btn" style="font-size: 11px; cursor: pointer;" title="View source on GitHub">🔗 GitHub</button>
                    </div>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--vscode-panel-border); font-size: 10px; opacity: 0.6; text-align: center;">
                        v${version} · Made with ❤️ for the SysML v2 community
                    </div>
                </div>
            </div>
        </div>
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

    <script nonce="${nonce}">
        SysMLDiagramRuntime.mount(window, document, d3, acquireVsCodeApi, "${elkWorkerUri}");
    </script>
</body>
</html>`;
    }

/** Generate a random nonce for Content Security Policy. */
function _getNonce(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; i++) {
        nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
}
