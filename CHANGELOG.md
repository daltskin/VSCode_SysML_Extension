# Changelog

All notable changes to the SysML v2.0 Language Support extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.25.0]

### Added

- **Comprehensive test suite** — new test files covering CodeLens, diagram buttons, editing features, MCP server, Model Explorer integration, performance and visualization panel (224 tests total, 176 unit + 48 integration)
- **CI pipeline restructured** — split into 3 parallel jobs: `lint`, `unit-tests`, and `integration-tests` (runs after lint + unit pass)
- **Release pipeline test gate** — `test` job must pass before the `release` job runs

### Changed

- Updated `sysml-v2-lsp` dependency from 0.5.1 to 0.6.0
- Makefile: `make test` runs unit tests only; `make test-integration` runs the full Extension Host suite

### Fixed

- **`end port` validation false positive** ([#15](https://github.com/daltskin/VSCode_SysML_Extension/issues/15)) — parser erroneously rejected `end port`, `end part`, `end item`, and other `end <keyword>` syntax in interface/connection definitions; root cause was a stale DFA snapshot in the LSP server that didn't cover the new grammar paths
- **DFA snapshot robustness** — LSP parser now retries with a cleared DFA when pre-seeded states produce parse errors, preventing stale snapshots from causing silent failures

## [0.24.0]

### Changed

- Updated `sysml-v2-lsp` dependency from 0.5.0 to 0.5.1 (enhanced code actions with structured diagnostic data, qualified name resolution)
- Simplified CI configuration by removing Node.js version matrix

## [0.23.0]

### Changed

- Updated `sysml-v2-lsp` dependency from 0.4.1 to 0.5.0

### Fixed

- Removed `minimatch` override from `package.json`

## [0.22.0]

### Added

- **Feature Inspector panel** (`src/panels/featureInspectorPanel.ts`) — cursor-tracking webview showing resolved type information, specialization breadcrumbs, feature tables with direction/multiplicity/modifier badges, clickable type drill-down, and navigation history with back button
- **Feature Explorer tree view** (`src/explorer/featureExplorerProvider.ts`) — master-detail sidebar showing resolved type info, specialization chains, and feature groups (parts, ports, attributes, etc.) for the selected definition
- **Model Complexity Index (MCI)** — status bar indicator (0–100 score) with hotspot detection for complex elements, documentation coverage, coupling analysis, and textual rating
- **Model Explorer workspace modes** — toggle between **By File** and **Semantic Model** views; workspace-wide model loaded automatically for `.code-workspace` projects; active document auto-revealed in tree
- **Diagnostic-reactive status bar** — live error/warning counts with colour-coded icons (`$(error)` / `$(warning)` / `$(check)`); click to open the Problems panel
- **LSP server health in status bar tooltip** — uptime, heap/RSS memory usage, and cache statistics (documents, symbol tables, semantic tokens)
- **`SysML: Show Type Hierarchy`** command — surfaces VS Code's built-in type hierarchy view for SysML definitions
- **`SysML: Show Call Hierarchy`** command — surfaces VS Code's built-in call hierarchy view for action/state invocations
- **`SysML: Toggle View: By File / Semantic Model`** command — switch Model Explorer between file-based and semantic views
- **Workspace pre-parsing settings** — `sysml.workspace.preloadOnOpen` (`always` / `workspaceOnly` / `never`) and `sysml.workspace.excludePatterns` (glob array)
- **Camera Example** multi-file sample (`samples/Camera Example/`) — `.code-workspace` with 8 SysML files covering General View, Interconnection View, Activity, Sequence, State, and Use Case diagrams
- **Animated parse progress indicator** — status bar animation showing parse stages (assembling model, building blocks, linking elements) with real-time progress feedback

### Changed

- **`SysML: Clear Parse Cache`** enhanced — now flushes server caches (documents, symbol tables, semantic token sets) with reported counts, then re-parses the active file immediately
- **Model Dashboard** updated with Model Complexity Index display and build timing metrics
- **ESLint configuration** modernised — flat config format with browser globals for webview JS, Node globals for scripts, vendor files ignored, type-checked TypeScript linting

### Fixed

- **ESLint errors in browser JS** — added proper environment globals for `media/game/`, `media/webview/`, and `scripts/` files; ignored third-party vendor bundles and `.venv` directory

## [0.21.0]

### Added

- **LSP model provider** (`src/providers/lspModelProvider.ts`) — sends `sysml/model` requests to the language server for structured model data
- **Model type definitions** (`src/providers/sysmlModelTypes.ts`) — shared TypeScript types for elements, relationships, and model statistics
- **Model Dashboard panel** (`src/panels/modelDashboardPanel.ts`) — webview dashboard showing model statistics and build timing
- **Go-to-Definition for library imports** — navigate to standard library definitions from import statements
- **`modelBuildTimeMs` timing metric** — real ANTLR parse time from the LSP server, reported consistently across status bar, dashboard, and output log

### Changed

- **Architecture: complete migration to LSP-only model** — visualization panel and model explorer now use `sysml/model` LSP requests instead of the in-extension ANTLR parser; the extension no longer bundles any parser, resolver, or library code
- **Visualization panel refactored** (`src/visualization/visualizationPanel.ts`) — rebuilt to consume LSP model data directly
- **Model Explorer refactored** (`src/explorer/modelExplorerProvider.ts`) — uses LSP model provider instead of in-extension parser
- **Extension activation refactored** (`src/extension.ts`) — streamlined for LSP-only architecture

### Fixed

- **LSP cold-start race condition** — model explorer and visualization now wait for the server to be ready
- **Filename encoding in logs** — spaces in filenames are properly handled

### Removed

- **In-extension ANTLR parser** (`src/parser/`) — `antlrSysMLParser.ts`, `sysmlParser.ts`, `parserWorker.ts`, `parserWorkerHost.ts`, `libraryIndexer.ts`, `vscodeMock.ts`, and `generated/` directory
- **Semantic resolver** (`src/resolver/`) — `resolver.ts`, `diagnostics.ts`, `types.ts`, `index.ts`
- **Library service** (`src/library/`) — `service.ts`, `cacheManager.ts`, `compiler.ts`, `types.ts`, `index.ts`
- **Grammar files** (`grammar/`) — `SysMLv2Lexer.g4`, `SysMLv2Parser.g4`
- **`sysml.library/` directory** — standard library files now bundled in the LSP server
- **`antlr4` runtime dependency**

## [0.20.0]

### Fixed

- **Comprehensive keyword validator fix**: eliminated ~100 false-positive "Unexpected identifier where a SysML keyword was expected" diagnostics by adding missing tokens to `NAME_PRECEDING_KEYWORDS` — covers KerML elements, annotations, control nodes, reference-preceding keywords, succession/flow tokens, relationship keywords, modifiers, visibility keywords, and punctuation (e.g. `attribute redefines`, `<'short-name'> identifier`, `exhibit`, `perform`, `include`, etc.)

### Changed

- Updated `sysml-v2-lsp` dependency from 0.1.6 to 0.1.7

## [0.19.0]

### Added

- **Semantic validation for enum literals**: warns when enumeration members inside `enum def` are missing the required `enum` keyword prefix (e.g. bare `condenser;` → should be `enum condenser;`)
- **Missing import detection**: warns when standard-library types (`String`, `Integer`, `Boolean`, `Real`, `Natural`, `Number`, `Complex`) are used without the corresponding `import ScalarValues::*` (or `NumericalValues::*`) statement, with a suggested fix
- **Semantic diagnostics surface in Problems panel**: resolver warnings (enum keyword, missing imports, unresolved types) now appear as VS Code diagnostics alongside LSP diagnostics
- Enumeration literals are now properly extracted into the structural diagram data (previously always empty)

### Fixed

- MCP / Visualizer parser alignment: the extension's semantic resolver now detects issues that the MCP `parse` / `validate` tools miss (permissive ANTLR grammar accepts `ENUM?` optional), preventing the false-confidence loop where MCP reports 0 errors but the visualizer shows "Parse Error"
- `sysml.validateModel` command now runs the full semantic resolution pass instead of only showing LSP diagnostic count

### Changed

- Updated `sysml-v2-lsp` dependency from 0.1.5 to 0.1.6

## [0.18.0]

### Added

- RC car sample model (`samples/rc-car.sysml`) — 540-line SysML v2 example with activity, sequence, and state machine diagrams

### Fixed

- MCP server registration: replaced broken `require('sysml-v2-lsp')` with direct path resolution — fixes "Tried to use SysML v2 tools but was blocked" in Copilot agent mode
- Removed duplicate MCP server definitions from `.vscode/settings.json`, `.vscode/mcp.json`, and `samples/.vscode/` that caused two servers to appear in the debug host

### Changed

- Updated `sysml-v2-lsp` dependency from 0.1.4 to 0.1.5
- MCP server now registered programmatically by the extension only (single `sysml-v2-mcp` provider)

## [0.17.0]

### Added

- Language Server Protocol (LSP) integration via the [`sysml-v2-lsp`](https://www.npmjs.com/package/sysml-v2-lsp) package — all language intelligence features (diagnostics, completions, hover, go-to-definition, references, rename, formatting, code actions, semantic tokens, CodeLens, inlay hints, type/call hierarchy, document symbols, folding ranges, selection ranges, workspace symbols) now provided by the language server
- New LSP client module (`src/lsp/client.ts`) managing server lifecycle over IPC transport
- `sysml.restartServer` command to restart the language server on demand
- Configuration settings: `sysml.trace.server` (off/messages/verbose), `sysml.maxNumberOfProblems`, `sysml.library.path`
- New test suite `lspClient.test.ts` covering LSP diagnostics, hover, document symbols, and completions

### Changed

- Extension architecture: language features delegated to LSP server instead of in-extension providers
- Local ANTLR parser retained only for visualization panel and model explorer tree view
- `parseSysMLDocument()` simplified — parse gate mechanism and inline validation removed
- `validateModel` command now reports `vscode.languages.getDiagnostics()` count from the LSP server
- `deactivate()` now stops the LSP client
- Updated `ARCHITECTURE.md` to reflect LSP client/server architecture

### Removed

- In-extension provider registrations: `SysMLFormatter`, `SysMLDefinitionProvider`, `SysMLDocumentSymbolProvider`, `SysMLCompletionProvider`, `SysMLCodeActionProvider`, `SysMLValidator`
- `LibraryService` initialization from extension activation (LSP handles library resolution)
- `getLibraryService()` export from extension module
- Test files for removed providers: `formatter.test.ts`, `navigation.test.ts`, `validator.test.ts`

## [0.16.0]

### Changed

- Extracted grammar generation pipeline into standalone [sysml-v2-grammar](https://github.com/daltskin/sysml-v2-grammar) repository
- Grammar files now downloaded from release artifacts via `make grammar` / `npm run grammar:download`
- Parser grammar renamed from `SysMLv2.g4` to `SysMLv2Parser.g4` (aligned with upstream repo)
- Removed redundant `antlr:copy-tokens` build step — tokens file now included in grammar release
- Removed `make debug-elk` target — use `npm run debug:elk` directly if needed

### Removed

- 19 orphaned renderer files and associated view model types
- 6 dead test files for removed renderers
- Python-based grammar generation scripts (`scripts/grammar/`)

## [0.15.0]

### Added

- Worker thread for ANTLR parsing — heavy lexer/parser/visitor work now runs off the extension host thread, eliminating ~4s UI freezes on large files
- `parseAsync()` method on `SysMLParser` with automatic fallback to synchronous parsing if the worker is unavailable
- 300ms debounce on document change events to avoid parse-per-keystroke

### Fixed

- Cytoscape SVG plugin registered twice — removed duplicate `cytoscape.use()` calls; UMD bundles already self-register on script load
- Removed unsupported `<meta http-equiv>` cache tags from visualization webview HTML (stripped by VS Code sandbox)
- Release workflow now installs Java and downloads the ANTLR jar so `vscode:prepublish` succeeds in CI

## [0.14.0]

### Added

- BNF-based grammar generation pipeline from official OMG SysML v2 KEBNF spec
- SLL prediction mode with DFA cache reuse for faster parsing
- `Clear Parse Cache` command
- Parse-error diagnostics from ANTLR4
- Centralised parse entry point with cancellation and progress notifications
- 12 targeted grammar fixes for spec ambiguities

### Changed

- Migrated from `antlr4ts` to official `antlr4` runtime (v4.13.2)
- Parser and lexer grammars regenerated from spec
- Validator rewritten with two-phase semantic resolution approach

### Fixed

- State transition source/target extraction
- Subclassification extraction from definition declarations
- Extension activation reliability
- TreeView node size & spacing improvements

## [0.13.0]

### Added

- ANTLR-based SysML v2 parser with full grammar support
- Interactive diagram visualizations (BDD, IBD, Activity, Sequence, State, Use Case)
- Model Explorer tree view
- Code formatting and validation
- Go-to-definition and symbol navigation
- Completion provider with context-aware suggestions
- Standard SysML v2 library support
- D3.js and Cytoscape.js based rendering

### Changed

- Improved syntax highlighting coverage

### Fixed

- Initial release stability improvements

## [0.12.0]

### Added

- Configurable export resolution for diagram PNG export
- PNG export scale options (1×, 2×, 4×)

### Fixed

- Tree view export rendering issues

## [0.10.0]

### Added

- IntelliSense completion provider for SysML keywords and element references
- Multi-selection support in visualization commands
- Enhanced element navigation from diagrams

### Changed

- Improved validator with better duplicate detection and reference handling
- Nested action validation and visualization support

## [0.7.0]

### Added

- Fork and join node support in activity diagram parsing and rendering

## [0.6.0]

### Added

- Model Explorer registered as command palette entry (`SysML: Explorer`)

## [0.5.0]

### Added

- Keyword validation with typo detection and quick-fix suggestions
- CI workflow for automated testing
- Release workflow for automated VSIX packaging and publishing

## [0.4.0]

### Added

- Inline editing for element names in diagram views
- Enhanced element navigation from visualization panels
- Visualization interaction tests

### Changed

- Replaced `nyc` with `c8` for code coverage

## [0.3.1]

### Fixed

- Spurious re-render on first resize observer callback

## [0.3.0]

### Added

- Toggle for category headers in General View

### Changed

- Reduced debounce times for improved responsiveness
- Optimised update logic in visualization panel

## [0.2.1]

### Changed

- README screenshots and video assets updated to WebP format

## [0.2.0]

### Added

- Compact UI styling for buttons, menus, and toolbar
- Dropdown interaction improvements

### Changed

- Document loading performance improved with debounced parsing

### Fixed

- Release workflow conditional check for marketplace publishing

## [0.1.0]

### Added

- Initial release
- SysML v2.0 syntax highlighting via TextMate grammar
- Regex-based parser with element extraction
- Interactive diagram visualizations (General View)
- Model Explorer tree view
- Basic code formatting
- Extension activation on `.sysml` files
