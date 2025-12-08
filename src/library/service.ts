/**
 * Library Service - Main interface for accessing compiled standard library
 */

import * as path from 'path';
import { LibraryCacheManager } from './cacheManager';
import { CompiledLibrary, LibrarySymbol } from './types';

export class LibraryService {
    private static instance: LibraryService;
    private library: CompiledLibrary | null = null;
    private cacheManager: LibraryCacheManager;
    private libraryPath: string;
    private initialized: boolean = false;

    private constructor(extensionPath: string) {
        this.libraryPath = path.join(extensionPath, 'sysml.library');
        this.cacheManager = new LibraryCacheManager(extensionPath);
    }

    public static getInstance(extensionPath?: string): LibraryService {
        if (!LibraryService.instance && extensionPath) {
            LibraryService.instance = new LibraryService(extensionPath);
        }
        if (!LibraryService.instance) {
            throw new Error('LibraryService not initialized with extension path');
        }
        return LibraryService.instance;
    }

    /**
     * Initialize the library (async, called at extension startup)
     */
    public async initialize(forceRecompile: boolean = false): Promise<void> {
        if (this.initialized && !forceRecompile) {
            return;
        }

        console.log('[LibraryService] Initializing...');
        const startTime = Date.now();

        try {
            this.library = await this.cacheManager.getCompiledLibrary(
                this.libraryPath,
                forceRecompile
            );
            this.initialized = true;

            const duration = Date.now() - startTime;
            console.log(`[LibraryService] Initialized with ${this.library.stats.totalSymbols} symbols in ${duration}ms`);
            console.log('[LibraryService] Symbol breakdown:', this.library.stats.byKind);
        } catch (error) {
            console.error('[LibraryService] Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * Lookup symbol by qualified name
     */
    public getSymbol(qualifiedName: string): LibrarySymbol | undefined {
        this.ensureInitialized();
        return this.library!.symbols.get(qualifiedName);
    }

    /**
     * Lookup symbols by simple name (may return multiple)
     */
    public getSymbolsByName(name: string): LibrarySymbol[] {
        this.ensureInitialized();
        const qualifiedNames = this.library!.simpleNameIndex.get(name) || [];
        return qualifiedNames
            .map(qn => this.library!.symbols.get(qn))
            .filter(s => s !== undefined) as LibrarySymbol[];
    }

    /**
     * Check if a symbol exists
     */
    public hasSymbol(qualifiedName: string): boolean {
        this.ensureInitialized();
        return this.library!.symbols.has(qualifiedName);
    }

    /**
     * Get all symbols in a package
     */
    public getPackageSymbols(packageName: string): LibrarySymbol[] {
        this.ensureInitialized();
        const childNames = this.library!.packages.get(packageName) || [];
        return childNames
            .map(name => this.library!.symbols.get(name))
            .filter(s => s !== undefined) as LibrarySymbol[];
    }

    /**
     * Get specialization chain for a type
     */
    public getSpecializationChain(typeName: string): string[] {
        this.ensureInitialized();
        const chain: string[] = [typeName];
        let current = this.getSymbol(typeName);

        while (current && current.specializes.length > 0) {
            // Follow first parent (primary specialization)
            const parent = current.specializes[0];
            chain.push(parent);
            current = this.getSymbol(parent);

            // Prevent infinite loops
            if (chain.length > 100) {
                console.warn('[LibraryService] Specialization chain too deep for', typeName);
                break;
            }
        }

        return chain;
    }

    /**
     * Get all subtypes of a type
     */
    public getSubtypes(typeName: string): string[] {
        this.ensureInitialized();
        const subtypes = this.library!.specializationGraph.get(typeName);
        return subtypes ? Array.from(subtypes) : [];
    }

    /**
     * Check if type A specializes type B
     */
    public isSpecializationOf(typeA: string, typeB: string): boolean {
        const chain = this.getSpecializationChain(typeA);
        return chain.includes(typeB);
    }

    /**
     * Search symbols by partial name
     */
    public searchSymbols(query: string, limit: number = 50): LibrarySymbol[] {
        this.ensureInitialized();
        const lowerQuery = query.toLowerCase();
        const results: LibrarySymbol[] = [];

        for (const symbol of this.library!.symbols.values()) {
            if (symbol.name.toLowerCase().includes(lowerQuery) ||
                symbol.qualifiedName.toLowerCase().includes(lowerQuery)) {
                results.push(symbol);
                if (results.length >= limit) {
                    break;
                }
            }
        }

        return results;
    }

    /**
     * Get all symbols of a specific kind
     */
    public getSymbolsByKind(kind: LibrarySymbol['kind']): LibrarySymbol[] {
        this.ensureInitialized();
        const results: LibrarySymbol[] = [];

        for (const symbol of this.library!.symbols.values()) {
            if (symbol.kind === kind) {
                results.push(symbol);
            }
        }

        return results;
    }

    /**
     * Get library statistics
     */
    public getStats() {
        this.ensureInitialized();
        return { ...this.library!.stats };
    }

    /**
     * Get library version
     */
    public getVersion(): string {
        this.ensureInitialized();
        return this.library!.version;
    }

    /**
     * Invalidate cache and force recompilation
     */
    public async recompile(): Promise<void> {
        console.log('[LibraryService] Recompiling library...');
        this.cacheManager.invalidateCache();
        this.initialized = false;
        await this.initialize(true);
    }

    /**
     * Check if library is initialized
     */
    public isInitialized(): boolean {
        return this.initialized && this.library !== null;
    }

    /**
     * Ensure library is initialized
     */
    private ensureInitialized(): void {
        if (!this.initialized || !this.library) {
            throw new Error('LibraryService not initialized. Call initialize() first.');
        }
    }

    /**
     * Get cache statistics
     */
    public getCacheStats() {
        return this.cacheManager.getCacheStats();
    }
}
