# SysML v2 VS Code Extension

A Visual Studio Code extension for SysML v2.0 with syntax highlighting, formatting, validation, navigation, and interactive diagram visualization.

![SysML v2.0](https://img.shields.io/badge/SysML-v2.0-blue) ![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-green) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow)

[![Install from Marketplace](https://img.shields.io/badge/Install-VS%20Code%20Marketplace-007ACC?logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=JamieD.sysml-v2-support)

## Features

### Language Support (LSP)

All language features are provided by the [sysml-v2-lsp](https://www.npmjs.com/package/sysml-v2-lsp) language server.

- **Syntax Highlighting** — Full support for SysML v2.0 keywords, operators, and constructs via TextMate grammar and semantic tokens
- **Standard Library** — Built-in OMG standard library (Kernel, Domain, Systems libraries)
- **Completions** — Context-aware auto-complete with trigger characters (`.`, `:`, space)
- **Hover** — Type information and documentation on hover
- **Formatting** — Smart indentation and code formatting (document and range)
- **Validation** — Real-time syntax and semantic checking with VS Code Problems panel integration
- **Navigation** — Go to Definition (including standard library imports), Find References, Document Symbols, Workspace Symbols, Breadcrumbs
- **Rename** — Rename symbols with linked editing support across references
- **Code Actions** — Quick fixes for common issues
- **Code Lens** — Reference counts shown above definitions
- **Folding** — Collapsible regions for blocks and nested structures
- **Selection Ranges** — Smart expand/shrink selection
- **Signature Help** — Parameter hints for action/calc invocations
- **Document Links** — Clickable import paths that navigate to the target
- **Type Hierarchy** — View supertypes and subtypes of definitions
- **Call Hierarchy** — Trace incoming and outgoing action/state invocations
- **Inlay Hints** — Inline type annotations next to identifiers (opt-in, off by default)
- **Snippets** — 29 code snippets for rapid scaffolding (`partdef`, `part`, `package`, `attrdef`, `portdef`, `actiondef`, `statedef`, `reqdef`, `enumdef`, `connect`, `flow`, `import`, and more)

### Tooling

- **Model Explorer** — Tree view showing packages and elements across your workspace, with two modes: **By File** and **Semantic Model**
- **Feature Explorer** — Master-detail tree view showing resolved type information, specialization chains, feature groups (parts, ports, attributes), multiplicity, direction, and modifiers for the selected definition
- **Feature Inspector** — Interactive sidebar panel showing detailed type information, specialization breadcrumbs, feature tables with direction/multiplicity/modifier badges, clickable type drill-down, and navigation history
- **Interactive Diagrams** — 10 diagram views: General, Interconnection, Action Flow, State Transition, Sequence, Case, Package, Graph, Tree, and Hierarchy — with search, pan, zoom, and PNG/SVG export
- **Model Dashboard** — Webview panel displaying model-wide statistics, element counts, build timing metrics, and Model Complexity Index (MCI)
- **Model Complexity Index** — Status bar indicator (0–100 score) with hotspot detection for complex elements, documentation coverage, and coupling analysis
- **Animated Parse Progress** — Status bar animation showing parse stages (assembling, building, linking) with real-time progress feedback
- **Diagnostic-Reactive Status Bar** — Live error/warning counts with colour-coded icons; click to open the Problems panel
- **LSP Server Health** — Status bar tooltip showing uptime, memory usage, and cache statistics
- **MCP Server** — Built-in [Model Context Protocol](https://modelcontextprotocol.io/) server for Copilot agent mode integration, enabling AI-assisted SysML modelling

### Workspace Support

When you open a **multi-root workspace** (`.code-workspace` file), the extension automatically scans all `.sysml` files across every folder and opens them for the LSP server to parse. This enables:

- **Cross-file navigation** — Go to Definition, Find References, and Rename work across all files in the workspace
- **Workspace-wide Model Explorer** — The tree view aggregates packages and elements from every file, with two modes:
  - **By File** — elements grouped under their source file
  - **Semantic Model** — a unified view merging all packages into a single model tree
- **Background pre-parsing** — configurable via `sysml.workspace.preloadOnOpen` (default: `workspaceOnly`)
- **Exclude patterns** — skip directories from scanning via `sysml.workspace.excludePatterns` (e.g. `temp`, `archive`)

For single-folder workspaces, files are parsed lazily when opened.

## Demo

![Demo](assets/visualiser.webp)

## Screenshots

<table>
<tr>
<td align="center"><strong>General</strong><br><img src="assets/general_view.png" width="250" alt="General View"></td>
<td align="center"><strong>Interconnection</strong><br><img src="assets/interconnection_view.png" width="250" alt="Interconnection View"></td>
<td align="center"><strong>Action Flow</strong><br><img src="assets/action_flow_view.png" width="250" alt="Action Flow View"></td>
<td align="center"><strong>State Transition</strong><br><img src="assets/state_view.png" width="250" alt="State Transition View"></td>
</tr>
<tr>
<td align="center"><strong>Hierarchy</strong><br><img src="assets/hierarchy_view.png" width="250" alt="Hierarchy View"></td>
<td align="center"><strong>Graph</strong><br><img src="assets/graph_view.png" width="250" alt="Graph View"></td>
<td align="center"><strong>Tree</strong><br><img src="assets/tree_view.png" width="250" alt="Tree View"></td>
<td></td>
</tr>
</table>

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=JamieD.sysml-v2-support):

1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for "SysML v2"
3. Click Install

Or install manually from `.vsix`: Extensions → ⋯ → Install from VSIX

## Usage

Create `.sysml` or `.kerml` files — the extension activates automatically and provides full language support for both:

```sysml
package MySystem {
    part def Vehicle {
        attribute mass : Real;
    }
    part car : Vehicle;
}
```

### Commands (Ctrl+Shift+P)

| Command                                        | Description                                                 |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `SysML: Show Model Visualizer`                 | Open interactive diagram for the current file               |
| `SysML: Show Model Explorer`                   | Open the tree view showing packages and elements            |
| `SysML: Validate SysML Model`                  | Run validation on the current file                          |
| `SysML: Format SysML Document`                 | Format the current SysML file                               |
| `SysML: Export Visualization (PNG/SVG)`        | Export the current diagram as PNG or SVG                    |
| `SysML: Change Visualizer View`                | Switch between diagram views (General, IBD, Activity, etc.) |
| `SysML: Refresh Visualization`                 | Re-render the current diagram                               |
| `SysML: Jump to Definition`                    | Navigate to the definition of the symbol under cursor       |
| `SysML: Show Type Hierarchy`                   | View supertypes and subtypes of the current definition      |
| `SysML: Show Call Hierarchy`                   | Trace incoming and outgoing action/state invocations        |
| `SysML: Show Feature Inspector`                | Inspect attributes, types, and relationships of an element  |
| `SysML: Show Model Dashboard`                  | View model statistics, build timing, and complexity index   |
| `SysML: Clear Parse Cache`                     | Flush server caches and re-parse the active file            |
| `SysML: Refresh Model Tree`                    | Refresh the Model Explorer tree view                        |
| `SysML: Toggle View: By File / Semantic Model` | Switch Model Explorer between file and semantic views       |
| `SysML: Restart Language Server`               | Restart the SysML LSP server                                |

### Context Menu

Right-click any folder in the Explorer → **Visualise with SysML** to aggregate and visualize all `.sysml` files in that folder. Choose **Visualise with SysML (Choose View)** to pick a specific diagram type.

Right-click in a SysML file editor → **Show Feature Inspector** to inspect the element at the cursor.

Right-click a `.sysml` file or folder → **Show Model Dashboard** for statistics and complexity analysis.

Right-click a package node in the **SysML Model Explorer** → **Visualize Package** to open an isolated diagram for that package.

## Settings

| Setting                            | Default           | Description                                                                                                                                                  |
| ---------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `sysml.validation.enabled`         | `true`            | Enable SysML model validation                                                                                                                                |
| `sysml.format.indentSize`          | `4`               | Number of spaces for indentation                                                                                                                             |
| `sysml.visualization.defaultView`  | `"sysml"`         | Default view when opening the visualizer (`sysml`, `tree`, `elk`, `bdd`, `package`, `ibd`, `graph`, `hierarchy`, `sequence`, `activity`, `state`, `usecase`) |
| `sysml.export.defaultScale`        | `2`               | Default scale factor for PNG exports (1x–4x)                                                                                                                 |
| `sysml.library.path`               | `""`              | Path to SysML v2 standard library directory                                                                                                                  |
| `sysml.maxNumberOfProblems`        | `100`             | Maximum number of problems reported per file                                                                                                                 |
| `sysml.inlayHints.enabled`         | `false`           | Enable inlay hints (inline type annotations). May interfere with renaming — disable if you experience editing issues                                         |
| `sysml.workspace.preloadOnOpen`    | `"workspaceOnly"` | Control workspace pre-parsing: `always`, `workspaceOnly`, `never`                                                                                            |
| `sysml.workspace.excludePatterns`  | `[]`              | Glob patterns to exclude from workspace pre-parsing                                                                                                          |
| `sysmlLanguageServer.trace.server` | `"off"`           | Traces communication between VS Code and the language server (`off`, `messages`, `verbose`)                                                                  |

## Development

```bash
npm install && npm run compile && npm test
```

## License

MIT
