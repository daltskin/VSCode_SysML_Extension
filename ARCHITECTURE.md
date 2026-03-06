# SysML v2.0 Extension Architecture

## Overview

A VS Code extension providing SysML v2.0 language support with interactive visualization. All language intelligence (parsing, diagnostics, completions, hover, go-to-definition, formatting, etc.) is provided by the **[sysml-v2-lsp](https://github.com/daltskin/sysml-v2-lsp)** language server via the Language Server Protocol. The extension adds visualization, model exploration, and diagram rendering on top via a custom `sysml/model` LSP request.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       VS Code Extension Host                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐          ┌──────────────────────────────────────┐ │
│  │ extension.ts │─────────>│          LSP Client                  │ │
│  │   (entry)    │          │   (vscode-languageclient)            │ │
│  └──────┬───────┘          └──────────────┬───────────────────────┘ │
│         │                                 │  IPC                    │
│         │                                 v                         │
│         │                  ┌──────────────────────────────────────┐ │
│         │                  │     sysml-v2-lsp Language Server     │ │
│         │                  │  (separate Node.js process)          │ │
│         │                  │                                      │ │
│         │                  │  * ANTLR4 parser (worker thread)     │ │
│         │                  │  * Symbol table & model provider     │ │
│         │                  │  * Diagnostics & keyword typos       │ │
│         │                  │  * Completions / signature help      │ │
│         │                  │  * Hover / go-to-def / references    │ │
│         │                  │  * Semantic tokens / CodeLens        │ │
│         │                  │  * Rename / linked editing           │ │
│         │                  │  * Inlay hints / document links      │ │
│         │                  │  * Type & call hierarchy             │ │
│         │                  │  * Formatting / folding / selection  │ │
│         │                  │  * Workspace symbols                 │ │
│         │                  │  * Standard library resolution       │ │
│         │                  │  * Custom sysml/model request        │ │
│         │                  └──────────────────────────────────────┘ │
│         │                                                           │
│         │                                                           │
│  ┌──────┴──────────────────────────────────────────────────────┐    │
│  │                    Extension Features                       │    │
│  │                                                             │    │
│  │  ┌────────────┐  ┌───────────────┐  ┌────────────────────┐  │    │
│  │  │ Model Tree │  │  LSP Model    │  │  Model Dashboard   │  │    │
│  │  │  Explorer  │  │  Provider     │  │     Panel          │  │    │
│  │  └────────────┘  └───────────────┘  └────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                 Visualization Panel (Webview)                  │ │
│  │  ┌────────┬────────┬────────┬────────┬────────┬────────┬─────┐ │ │
│  │  │  BDD   │  IBD   │  ELK   │Package │Activity│Sequence│State│ │ │
│  │  └────────┴────────┴────────┴────────┴────────┴────────┴─────┘ │ │
│  │        |           Cytoscape.js + ELK          |        D3.js  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. LSP Client (`src/lsp/`)

- Starts the **sysml-v2-lsp** language server as a child process (IPC transport)
- The server module is shipped as the `sysml-v2-lsp` npm dependency
- Provides all language intelligence: diagnostics, completions, hover, go-to-definition, references, rename, formatting, code actions, semantic tokens, CodeLens, inlay hints, type/call hierarchy, document symbols, folding ranges, selection ranges, workspace symbols
- Custom `sysml/model` request returns parsed model data for visualization and explorer
- Supports `sysml.restartServer` command for development

### 2. LSP Model Provider (`src/providers/`)

- `lspModelProvider.ts` — sends `sysml/model` requests to the LSP server
- `sysmlModelTypes.ts` — shared type definitions for model data (elements, relationships, stats)
- Converts LSP model responses into visualization-ready data structures

### 3. Model Explorer (`src/explorer/`)

- `modelExplorerProvider.ts` — tree view showing SysML model structure
- Displays packages, parts, attributes, ports, connections, etc.
- Uses `sysml/model` request with `['elements', 'relationships']` scope
- Supports refresh, navigation to source, and model dashboard

### 4. Model Dashboard (`src/panels/`)

- `modelDashboardPanel.ts` — webview panel showing model statistics
- Displays element counts, relationship types, parse timing, and model structure overview

### 5. Visualization (`src/visualization/`)

- `visualizationPanel.ts` — webview-based diagram rendering
- Multiple renderers: BDD, IBD, Package, Activity, Sequence, State, UseCase
- Uses **Cytoscape.js** + **ELK** for graph layout
- Uses **D3.js** for custom diagrams

## Data Flow

```
 .sysml File
      │
      v
┌───────────┐    ┌──────────────────────────┐    ┌───────────────┐
│  TextDoc  │--->│   sysml-v2-lsp Server    │--->│ LSP Responses │
│           │    │                          │    │               │
│           │    │  ANTLR4 parse (worker)   │    │ diagnostics,  │
│           │    │  Symbol table build      │    │ completions,  │
│           │    │  Library resolution      │    │ model data    │
└───────────┘    └──────────────────────────┘    └───────┬───────┘
                                                         │
                         ┌───────────────────────────────┤
                         │                               │
                         v                               v
                  ┌─────────────┐              ┌───────────────┐
                  │ Model Tree  │              │  Visualization │
                  │  Explorer   │              │    Webview     │
                  └─────────────┘              └───────────────┘
```

## Key Dependencies

| Dependency              | Purpose                           |
| ----------------------- | --------------------------------- |
| `sysml-v2-lsp`          | Language server (LSP)             |
| `vscode-languageclient` | VS Code LSP client library        |
| `elkjs`                 | ELK graph layout algorithm        |
| `cytoscape`             | Graph visualization library       |
| `cytoscape-elk`         | ELK layout adapter for Cytoscape  |
| `d3`                    | Data-driven document manipulation |

## Module Structure

```
src/
├── extension.ts          # Entry point, command registration
├── lsp/
│   ├── client.ts         # LSP client (starts sysml-v2-lsp server)
│   └── server-launcher.cjs # Server process entry point
├── providers/
│   ├── lspModelProvider.ts  # sysml/model request handler
│   └── sysmlModelTypes.ts   # Shared model type definitions
├── visualization/
│   └── visualizationPanel.ts  # Webview host & diagram rendering
├── explorer/
│   └── modelExplorerProvider.ts # Tree view provider
├── panels/
│   └── modelDashboardPanel.ts   # Dashboard webview panel
├── types/
│   └── sysml-v2-lsp.d.ts       # Type declarations for LSP package
└── test/
    └── *.test.ts                # Unit and integration tests
```

## Extension Activation

1. Triggered by `onLanguage:sysml` or command invocation
2. Starts the **sysml-v2-lsp** language server via IPC (handles all language features)
3. Registers Model Explorer tree view, visualization commands, and dashboard
4. Sets up file watchers and document change handlers for model updates

## Webview Communication

```
  Extension Host                      Webview (Browser)
        │                                    │
        │──── { command: 'update',  ────────>│
        │       data: elements }             │
        │                                    │
        │<─── { command: 'select',  ─────────│
        │       element: name }              │
        │                                    │
        │──── { command: 'highlight' ───────>│
        │       name: string }               │
```

Messages are serialized JSON passed via `postMessage()`.
