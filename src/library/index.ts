/**
 * SysML v2 Standard Library Compilation and Management
 *
 * This module provides a complete replacement for the regex-based libraryIndexer.
 * It uses ANTLR to parse the standard library and produces a semantic symbol table
 * with qualified names, relationships, and type information.
 */

export { LibraryCacheManager } from './cacheManager';
export { LibraryCompiler } from './compiler';
export { LibraryService } from './service';
export * from './types';

