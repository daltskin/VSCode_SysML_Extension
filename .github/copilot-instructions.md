---
description: Best practices and guidelines for SysML VS Code Extension development
applyTo: "**"
---

# Copilot Instructions for SysML VS Code Extension

## Project Overview

This VS Code extension provides comprehensive SysML v2.0 language support with syntax highlighting, formatting, validation, navigation, and interactive D3.js-based visualizations.

## Technology Stack Best Practices

### TypeScript Development

- Always use strict TypeScript configuration (`"strict": true`)
- Prefer interfaces over types for object shapes that might be extended
- Use union types and type guards for robust error handling
- Export types and interfaces that might be reused across modules
- Use `readonly` arrays and properties where data shouldn't be mutated
- Leverage TypeScript's built-in utility types (Partial, Pick, Omit, etc.)

### VS Code Extension Development

- Always dispose of resources properly in `deactivate()` function
- Use `vscode.Disposable` for event subscriptions and cleanup
- Prefer `vscode.workspace.onDidChangeTextDocument` over polling for file changes
- Cache expensive operations and invalidate when necessary
- Use `vscode.window.withProgress` for long-running operations
- Register commands in `package.json` and implement in `extension.ts`
- Use proper activation events to minimize extension startup impact

### D3.js Visualization Best Practices

- Always clean up previous visualizations before creating new ones
- Use `selection.selectAll().remove()` to clear containers
- Implement proper responsive design with `viewBox` and percentage dimensions
- Handle zoom and pan interactions gracefully with bounds checking
- Use `d3.scaleOrdinal()` with proper color schemes for consistent theming
- Implement debounced resize handlers for performance
- Use `requestAnimationFrame` for smooth animations
- Cache DOM selections when used repeatedly

### Performance Guidelines

- Lazy load visualization components only when needed
- Use Web Workers for heavy parsing operations when possible
- Implement virtual scrolling for large datasets
- Debounce user input events (typing, resizing) appropriately
- Use `IntersectionObserver` for viewport-aware rendering
- Cache parsed syntax trees and invalidate on content changes

## Code Organization

### File Structure Patterns

```
src/
├── extension.ts                 # Main activation/deactivation
├── parser/                      # Language parsing logic
├── validation/                  # Error checking and diagnostics
├── formatting/                  # Code formatting and beautification
├── navigation/                  # Go-to-definition, find references
├── visualization/               # D3.js interactive diagrams
├── explorer/                    # Tree view providers
└── test/                        # Comprehensive test suite
```

### Module Design Principles

- Each module should have a single, clear responsibility
- Export a main class or function as default, utilities as named exports
- Keep provider classes stateless when possible
- Use dependency injection for testability
- Implement proper error boundaries and fallbacks

## Error Handling

### Robust Error Management

- Always wrap async operations in try-catch blocks
- Use `vscode.window.showErrorMessage()` for user-facing errors
- Log detailed errors to output channel for debugging
- Implement graceful degradation when features fail
- Validate user input and provide helpful error messages
- Use custom error types for different failure categories

### Logging Best Practices

- Create a dedicated output channel: `vscode.window.createOutputChannel('SysML')`
- Include timestamps and context in log messages
- Use appropriate log levels (error, warn, info, debug)
- Never log sensitive information or large data structures
- Provide actionable error messages with suggested solutions

## Testing Strategies

### Test Coverage Goals

- Unit tests for all parser logic and utilities
- Integration tests for VS Code API interactions
- Visual regression tests for D3.js components
- Performance tests for large file handling
- End-to-end tests for complete workflows

### Test Organization

```typescript
describe("SysML Parser", () => {
  describe("parseElement", () => {
    it("should handle valid element syntax", () => {
      // Test implementation
    });

    it("should gracefully handle malformed input", () => {
      // Error case testing
    });
  });
});
```

## Security Considerations

- Sanitize all user input before processing
- Validate file paths and prevent directory traversal
- Use Content Security Policy for webview components
- Never execute arbitrary code from SysML files
- Implement proper access controls for file operations

## Accessibility Guidelines

- Ensure all interactive elements are keyboard accessible
- Provide proper ARIA labels for complex visualizations
- Support high contrast themes and custom color schemes
- Include alternative text descriptions for visual elements
- Test with screen readers and accessibility tools

## Configuration Management

- Use VS Code settings API for user preferences
- Provide sensible defaults for all configuration options
- Validate configuration changes and provide feedback
- Support workspace-specific and user-specific settings
- Document all configuration options in package.json

## Build and Deployment

- Use semantic versioning for releases
- Maintain comprehensive CHANGELOG.md
- Run all tests in CI/CD pipeline before publishing
- Use `vsce package` for creating marketplace-ready packages
- Include proper LICENSE and README.md files
- Test extension installation and activation thoroughly

## Code Style Guidelines

- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Use descriptive variable and function names
- Limit line length to 100 characters
- Use JSDoc comments for public APIs
- Maintain consistent indentation (2 spaces)
- Use meaningful commit messages following conventional commits

## Performance Monitoring

- Measure extension activation time
- Monitor memory usage in long-running sessions
- Profile CPU usage during heavy operations
- Track user interaction response times
- Implement telemetry for usage analytics (with user consent)

## Debugging Support

- Provide comprehensive debug configurations in `.vscode/launch.json`
- Include source maps for easier debugging
- Use VS Code's debugging API for advanced debugging features
- Implement proper breakpoint handling in language features
- Provide debug output channels for troubleshooting

## Output

- Keep all output concise
- Keep verbosity to a minimum
- Focus on actionable information
- Use bullet points and numbered lists for clarity
- Use markdown formatting for readability

Remember: Always prioritize user experience, maintain backwards compatibility, and follow VS Code extension guidelines for marketplace compliance.
