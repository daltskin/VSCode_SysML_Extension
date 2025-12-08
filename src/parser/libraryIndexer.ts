/**
 * SysML v2 Standard Library Indexer
 *
 * Indexes the official SysML v2 standard library to provide:
 * - Type definitions and hierarchy
 * - Standard library element lookup
 * - Validation against standard types
 * - IntelliSense support
 */

import * as fs from 'fs';
import * as path from 'path';

export interface LibraryElement {
    name: string;
    kind: string; // 'part', 'action', 'requirement', 'attribute', etc.
    filePath: string;
    qualifiedName: string;
    documentation?: string;
    specializes?: string[];
    features?: string[];
}

export class LibraryIndexer {
    private static instance: LibraryIndexer;
    private elements: Map<string, LibraryElement> = new Map();
    private indexed: boolean = false;
    private libraryPath: string;

    private constructor() {
        // Library is at project root
        this.libraryPath = path.join(__dirname, '../../sysml.library');
    }

    public static getInstance(): LibraryIndexer {
        if (!LibraryIndexer.instance) {
            LibraryIndexer.instance = new LibraryIndexer();
        }
        return LibraryIndexer.instance;
    }

    /**
     * Index the standard library (async, called at extension startup)
     */
    public async indexLibrary(): Promise<void> {
        if (this.indexed) {
            return;
        }

        console.log('Indexing SysML v2 Standard Library...');
        const startTime = Date.now();

        try {
            if (!fs.existsSync(this.libraryPath)) {
                console.warn(`Standard library not found at: ${this.libraryPath}`);
                return;
            }

            await this.indexDirectory(this.libraryPath);

            const duration = Date.now() - startTime;
            console.log(`Indexed ${this.elements.size} library elements in ${duration}ms`);
            this.indexed = true;
        } catch (error) {
            console.error('Failed to index standard library:', error);
        }
    }

    /**
     * Recursively index all .sysml and .kerml files
     */
    private async indexDirectory(dirPath: string): Promise<void> {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                await this.indexDirectory(fullPath);
            } else if (entry.isFile() && (entry.name.endsWith('.sysml') || entry.name.endsWith('.kerml'))) {
                await this.indexFile(fullPath);
            }
        }
    }

    /**
     * Index a single library file
     */
    private async indexFile(filePath: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const elements = this.extractElements(content, filePath);

            for (const element of elements) {
                this.elements.set(element.qualifiedName, element);
                // Also index by simple name for quick lookup
                if (!element.qualifiedName.includes('::')) {
                    this.elements.set(element.name, element);
                }
            }
        } catch (error) {
            console.error(`Failed to index file ${filePath}:`, error);
        }
    }

    /**
     * Extract element definitions from library file content
     * Uses simple regex patterns optimized for standard library format
     */
    private extractElements(content: string, filePath: string): LibraryElement[] {
        const elements: LibraryElement[] = [];

        // Pattern for element definitions
        // Matches: part def PartDefinition :> ...
        //          attribute def AttributeDefinition :> ...
        //          action def ActionDefinition :> ...
        //          abstract metadata def MetadataItem :> ...
        const elementPattern = /(?:^|\n)\s*(abstract\s+)?(\w+)\s+(def|definition)\s+(\w+)(?:\s+:>\s+([\w:,\s]+))?/g;

        let match;
        while ((match = elementPattern.exec(content)) !== null) {
            const _isAbstract = match[1] !== undefined;
            const kind = match[2]; // 'part', 'action', 'attribute', 'metadata', etc.
            const name = match[4];
            const specializes = match[5] ? match[5].split(',').map(s => s.trim()) : [];

            elements.push({
                name,
                kind,
                filePath,
                qualifiedName: name, // Could be enhanced to extract package qualification
                specializes,
                features: []
            });
        }

        // Pattern for function definitions (standard library specific)
        // Matches: function 'if' { ... }
        //          abstract function '.' { ... }
        const functionPattern = /(?:^|\n)\s*(abstract\s+)?function\s+(['"]\w+['"]|\w+)/g;

        while ((match = functionPattern.exec(content)) !== null) {
            const _isAbstract = match[1] !== undefined;
            const name = match[2].replace(/['"]/g, ''); // Remove quotes from operator names

            elements.push({
                name,
                kind: 'function',
                filePath,
                qualifiedName: name,
                specializes: [],
                features: []
            });
        }

        // Pattern for feature definitions
        // Matches: ref feature target : Anything[0..*] nonunique;
        //          feature chain chains source.target;
        const featurePattern = /(?:^|\n)\s*(abstract\s+)?(?:(ref|private)\s+)?feature\s+(\w+)(?:\s*:\s*([\w:.[\]*]+))?/g;

        while ((match = featurePattern.exec(content)) !== null) {
            const modifier = match[2];
            const name = match[3];
            const type = match[4];

            elements.push({
                name,
                kind: modifier ? `${modifier}_feature` : 'feature',
                filePath,
                qualifiedName: name,
                specializes: type ? [type] : [],
                features: []
            });
        }

        // Pattern for simple declarations (items, metadata items, etc.)
        // Matches: part partInstance : PartDefinition;
        //          item metadataItems : MetadataItem[0..*] :> ...
        const usagePattern = /(?:^|\n)\s*(?:(abstract|private|ref)\s+)?(\w+)\s+(\w+)\s*:\s*([\w:[\]*]+)/g;

        while ((match = usagePattern.exec(content)) !== null) {
            const modifier = match[1];
            const kind = match[2];
            const name = match[3];
            const type = match[4];

            // Only index well-known usage kinds
            if (['part', 'action', 'requirement', 'attribute', 'port', 'connection', 'item', 'metadata'].includes(kind)) {
                elements.push({
                    name,
                    kind: modifier ? `${modifier}_${kind}` : kind,
                    filePath,
                    qualifiedName: name,
                    specializes: [type],
                    features: []
                });
            }
        }

        return elements;
    }

    /**
     * Look up an element by name
     */
    public lookup(name: string): LibraryElement | undefined {
        return this.elements.get(name);
    }

    /**
     * Check if a name is a standard library element
     */
    public isStandardElement(name: string): boolean {
        return this.elements.has(name);
    }

    /**
     * Get all elements of a specific kind
     */
    public getElementsByKind(kind: string): LibraryElement[] {
        return Array.from(this.elements.values()).filter(e => e.kind === kind);
    }

    /**
     * Get all element names (for autocomplete)
     */
    public getAllElementNames(): string[] {
        return Array.from(this.elements.keys());
    }

    /**
     * Get specialization hierarchy for an element
     */
    public getSpecializationChain(name: string): string[] {
        const chain: string[] = [];
        let current = this.lookup(name);

        while (current) {
            chain.push(current.name);
            if (current.specializes && current.specializes.length > 0) {
                current = this.lookup(current.specializes[0]);
            } else {
                break;
            }
        }

        return chain;
    }

    /**
     * Get statistics about indexed library
     */
    public getStatistics(): { total: number; byKind: Map<string, number> } {
        const byKind = new Map<string, number>();

        for (const element of this.elements.values()) {
            const count = byKind.get(element.kind) || 0;
            byKind.set(element.kind, count + 1);
        }

        return {
            total: this.elements.size,
            byKind
        };
    }

    /**
     * Check if library is indexed
     */
    public isIndexed(): boolean {
        return this.indexed;
    }

    /**
     * Clear the index (for testing)
     */
    public clear(): void {
        this.elements.clear();
        this.indexed = false;
    }
}
