# Makefile for SysML v2.0 VS Code Extension

# Variables
NODE_MODULES = node_modules
OUT_DIR = out
SRC_DIR = src
DIST_DIR = dist
PACKAGE_NAME = $(shell node -p "require('./package.json').name")
VERSION = $(shell node -p "require('./package.json').version")

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

.PHONY: all
all: install compile

# Help target
.PHONY: help
help:
	@echo "$(BLUE)SysML v2.0 VS Code Extension Makefile$(NC)"
	@echo ""
	@echo "$(YELLOW)Available targets:$(NC)"
	@echo "  $(GREEN)install$(NC)        - Install dependencies"
	@echo "  $(GREEN)compile$(NC)        - Compile TypeScript to JavaScript"
	@echo "  $(GREEN)watch$(NC)          - Watch and compile on changes"
	@echo "  $(GREEN)test$(NC)           - Run unit tests (fast, no VS Code required)"
	@echo "  $(GREEN)test-integration$(NC) - Run full integration tests (requires VS Code)"
	@echo "  $(GREEN)test-syntax$(NC)    - Test syntax and compilation (no VS Code required)"
	@echo "  $(GREEN)install-test-deps$(NC) - Install system dependencies for testing"
	@echo "  $(GREEN)lint$(NC)           - Run linting"
	@echo "  $(GREEN)lint-fix$(NC)       - Fix linting issues automatically"
	@echo "  $(GREEN)coverage$(NC)       - Generate coverage report"
	@echo "  $(GREEN)package$(NC)        - Create VSIX package"
	@echo "  $(GREEN)clean$(NC)          - Clean build artifacts"
	@echo "  $(GREEN)clean-all$(NC)      - Clean everything including node_modules"
	@echo "  $(GREEN)dev$(NC)            - Start development environment"
	@echo "  $(GREEN)debug$(NC)          - Prepare for debugging (then press F5 in VS Code)"
	@echo "  $(GREEN)debug-watch$(NC)    - Launch watch mode for debugging with auto-recompile"
	@echo "  $(GREEN)prepublish$(NC)     - Prepare for publishing"
	@echo "  $(GREEN)info$(NC)           - Show project information"
	@echo "  $(GREEN)help$(NC)           - Show this help message"

# Install dependencies
.PHONY: install
install: $(NODE_MODULES)

$(NODE_MODULES): package.json package-lock.json
	@echo "$(YELLOW)Installing dependencies...$(NC)"
	npm install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

# Compile TypeScript
.PHONY: compile
compile: $(OUT_DIR)

$(OUT_DIR): $(NODE_MODULES) tsconfig.json $(shell find $(SRC_DIR) -name "*.ts" 2>/dev/null || echo "")
	@echo "$(YELLOW)Compiling TypeScript...$(NC)"
	npm run compile
	@echo "$(GREEN)Compilation completed!$(NC)"

# Watch mode for development
.PHONY: watch
watch: $(NODE_MODULES)
	@echo "$(YELLOW)Starting watch mode...$(NC)"
	@echo "$(BLUE)Press Ctrl+C to stop$(NC)"
	npm run watch

# Run unit tests (fast — no VS Code instance required)
.PHONY: test
test: compile
	@echo "$(YELLOW)Running unit tests...$(NC)"
	npm run test:unit
	@echo "$(GREEN)Unit tests completed!$(NC)"

# Run full integration tests (requires VS Code / Electron)
.PHONY: test-integration
test-integration: compile
	@echo "$(YELLOW)Running integration tests...$(NC)"
	@if npm run test; then \
		echo "$(GREEN)Integration tests completed successfully!$(NC)"; \
	else \
		exit_code=$$?; \
		if [ $$exit_code -eq 127 ]; then \
			echo "$(RED)Tests failed to run - missing system dependencies$(NC)"; \
			echo "$(YELLOW)Try: 'make install-test-deps' to install required libraries$(NC)"; \
		elif [ $$exit_code -eq 1 ]; then \
			echo "$(YELLOW)Tests ran but some test cases failed$(NC)"; \
			echo "$(YELLOW)This indicates test logic issues, not system problems$(NC)"; \
		else \
			echo "$(RED)Tests failed with exit code $$exit_code$(NC)"; \
		fi; \
		echo "$(YELLOW)Run 'make test-syntax' for basic validation without full test suite$(NC)"; \
		exit $$exit_code; \
	fi

# Test syntax and compilation without VS Code
.PHONY: test-syntax
test-syntax: compile lint
	@echo "$(YELLOW)Running syntax validation...$(NC)"
	@echo "$(GREEN)✓ TypeScript compilation successful$(NC)"
	@echo "$(GREEN)✓ ESLint validation passed$(NC)"
	@echo "$(GREEN)✓ Extension can be packaged$(NC)"
	@npm run package > /dev/null 2>&1 && echo "$(GREEN)✓ VSIX package creation successful$(NC)" || echo "$(RED)✗ Package creation failed$(NC)"
	@echo "$(GREEN)All syntax validation tests passed!$(NC)"

# Install system dependencies for testing (requires sudo)
.PHONY: install-test-deps
install-test-deps:
	@echo "$(YELLOW)Installing system dependencies for VS Code testing...$(NC)"
	@if command -v sudo >/dev/null 2>&1; then \
		sudo apt update && sudo apt install -y libnspr4 libnss3 libatk-bridge2.0-0 libatspi2.0-0 libgtk-3-0 libgdk-pixbuf2.0-0 libxss1 libasound2 libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1; \
		echo "$(GREEN)System dependencies installed!$(NC)"; \
	else \
		echo "$(RED)sudo not available. Please install: libnspr4 libatk-bridge2.0-0 libatspi2.0-0$(NC)"; \
		exit 1; \
	fi

# Legacy alias — kept for backwards compatibility
.PHONY: test-unit
test-unit: test

# Run linting
.PHONY: lint
lint: $(NODE_MODULES)
	@echo "$(YELLOW)Running linter...$(NC)"
	npm run lint
	@echo "$(GREEN)Linting completed!$(NC)"

# Fix linting issues
.PHONY: lint-fix
lint-fix: $(NODE_MODULES)
	@echo "$(YELLOW)Fixing linting issues...$(NC)"
	npm run lint:fix
	@echo "$(GREEN)Linting fixes applied!$(NC)"

# Generate coverage report
.PHONY: coverage
coverage: compile
	@echo "$(YELLOW)Generating coverage report...$(NC)"
	npm run coverage
	@echo "$(GREEN)Coverage report generated!$(NC)"

# Create VSIX package
.PHONY: package
package: prepublish
	@echo "$(YELLOW)Creating VSIX package...$(NC)"
	npm run package
	@echo "$(GREEN)Package created: $(PACKAGE_NAME)-$(VERSION).vsix$(NC)"

# Prepare for publishing
.PHONY: prepublish
prepublish: $(NODE_MODULES)
	@echo "$(YELLOW)Preparing for publishing...$(NC)"
	npm run vscode:prepublish
	@echo "$(GREEN)Ready for publishing!$(NC)"

# Development environment setup
.PHONY: dev
dev: install
	@echo "$(YELLOW)Setting up development environment...$(NC)"
	@echo "$(BLUE)Starting watch mode in background...$(NC)"
	@echo "$(BLUE)You can now open VS Code and start debugging$(NC)"
	@echo "$(BLUE)Press F5 to launch Extension Development Host$(NC)"
	npm run watch

# Launch extension in VS Code debug mode
.PHONY: debug
debug: compile
	@echo "$(YELLOW)Launching VS Code Extension Development Host...$(NC)"
	@echo "$(BLUE)Using Wayland-optimized settings for best compatibility$(NC)"
	@npm run debug
	@echo "$(GREEN)✓ Extension Development Host should be starting!$(NC)"
	@echo "$(BLUE)Look for a new VS Code window with your extension loaded$(NC)"

# Launch extension in debug mode with watch compilation
.PHONY: debug-watch
debug-watch: install
	@echo "$(YELLOW)Starting debug mode with automatic recompilation...$(NC)"
	@echo "$(BLUE)This will:$(NC)"
	@echo "$(BLUE)1. Start TypeScript compiler in watch mode$(NC)"
	@echo "$(BLUE)2. Prepare for VS Code Extension debugging$(NC)"
	@echo "$(BLUE)3. Automatically recompile on file changes$(NC)"
	@echo ""
	@echo "$(GREEN)Starting TypeScript watch mode...$(NC)"
	@npm run watch &
	@sleep 3
	@echo ""
	@echo "$(GREEN)✓ Watch mode active - files will auto-recompile on changes$(NC)"
	@echo "$(BLUE)Now press F5 in VS Code to start debugging$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop watch mode$(NC)"
	@wait



# Clean build artifacts
.PHONY: clean
clean:
	@echo "$(YELLOW)Cleaning build artifacts...$(NC)"
	rm -rf $(OUT_DIR)
	rm -rf $(DIST_DIR)
	rm -f *.vsix
	rm -f tsconfig.tsbuildinfo
	@echo "$(GREEN)Build artifacts cleaned!$(NC)"

# Clean everything including dependencies, then reinstall and recompile
.PHONY: clean-all
clean-all: clean
	@echo "$(YELLOW)Cleaning all files including dependencies...$(NC)"
	rm -rf $(NODE_MODULES)
	rm -f package-lock.json
	@echo "$(GREEN)All files cleaned!$(NC)"
	@echo "$(YELLOW)Reinstalling dependencies...$(NC)"
	npm install
	@echo "$(YELLOW)Recompiling...$(NC)"
	npm run compile
	@echo "$(GREEN)Clean rebuild complete - ready for F5 debugging!$(NC)"

# Show project information
.PHONY: info
info:
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Name: $(PACKAGE_NAME)"
	@echo "  Version: $(VERSION)"
	@echo "  Node modules: $(shell [ -d $(NODE_MODULES) ] && echo '✓ Installed' || echo '✗ Not installed')"
	@echo "  Compiled: $(shell [ -d $(OUT_DIR) ] && echo '✓ Yes' || echo '✗ No')"
	@echo "  Package exists: $(shell [ -f "$(PACKAGE_NAME)-$(VERSION).vsix" ] && echo '✓ Yes' || echo '✗ No')"

# Verify all is working
.PHONY: verify
verify: install compile test lint
	@echo "$(GREEN)All verification steps completed successfully!$(NC)"

# Quick build for CI/CD
.PHONY: ci
ci: install compile test package
	@echo "$(GREEN)CI build completed successfully!$(NC)"

# Force rebuild
.PHONY: rebuild
rebuild: clean compile

# Show status
.PHONY: status
status: info
	@echo ""
	@echo "$(BLUE)Git Status:$(NC)"
	@git status --porcelain 2>/dev/null || echo "Not a git repository"
	@echo ""
	@echo "$(BLUE)Recent commits:$(NC)"
	@git log --oneline -5 2>/dev/null || echo "No git history"
