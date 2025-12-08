/**
 * Library Compiler - Parses SysML v2 standard library using ANTLR
 * and produces a semantic symbol table with qualified names, relationships,
 * and type information.
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { ANTLRSysMLParser } from '../parser/antlrSysMLParser';
import type { Relationship, SysMLElement } from '../parser/sysmlParser';
import {
    CompiledLibrary,
    LibraryFeature,
    LibraryRelationship,
    LibrarySymbol,
    SerializedLibrary
} from './types';

export class LibraryCompiler {
    private antlrParser: ANTLRSysMLParser;
    private symbols: Map<string, LibrarySymbol> = new Map();
    private simpleNameIndex: Map<string, string[]> = new Map();
    private packages: Map<string, string[]> = new Map();
    private specializationGraph: Map<string, Set<string>> = new Map();
    private currentPackagePath: string[] = [];
    private stats = {
        totalSymbols: 0,
        byKind: {} as Record<string, number>,
        totalFiles: 0,
        totalPackages: 0
    };

    constructor() {
        this.antlrParser = new ANTLRSysMLParser();
    }

    /**
     * Compile the entire library from a directory
     */
    public async compileLibrary(libraryPath: string): Promise<CompiledLibrary> {
        console.log('[LibraryCompiler] Starting compilation of', libraryPath);
        const startTime = Date.now();

        this.reset();
        await this.compileDirectory(libraryPath, libraryPath);

        const duration = Date.now() - startTime;
        console.log(`[LibraryCompiler] Compiled ${this.stats.totalSymbols} symbols from ${this.stats.totalFiles} files in ${duration}ms`);

        return {
            version: this.generateVersion(libraryPath),
            timestamp: Date.now(),
            symbols: this.symbols,
            simpleNameIndex: this.simpleNameIndex,
            packages: this.packages,
            specializationGraph: this.specializationGraph,
            stats: this.stats
        };
    }

    /**
     * Recursively compile all .sysml files in a directory
     */
    private async compileDirectory(dirPath: string, rootPath: string): Promise<void> {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory() && !entry.name.startsWith('.')) {
                await this.compileDirectory(fullPath, rootPath);
            } else if (entry.isFile() && entry.name.endsWith('.sysml')) {
                await this.compileFile(fullPath, rootPath);
            }
        }
    }

    /**
     * Compile a single library file
     */
    private async compileFile(filePath: string, rootPath: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const relativePath = path.relative(rootPath, filePath);

            console.log(`[LibraryCompiler] Compiling ${relativePath}`);

            // Create mock VS Code document
            const mockDoc = this.createMockDocument(content, filePath);

            // Parse with ANTLR
            const elements = this.antlrParser.parseDocument(mockDoc, false);
            const relationships = this.antlrParser.getRelationships();

            // Extract symbols
            this.extractSymbols(elements, relativePath, relationships);

            this.stats.totalFiles++;
        } catch (error) {
            console.error(`[LibraryCompiler] Error compiling ${filePath}:`, error);
        }
    }

    /**
     * Extract symbols from parsed elements
     */
    private extractSymbols(
        elements: SysMLElement[],
        sourceFile: string,
        relationships: Relationship[],
        parentPackage: string = ''
    ): void {
        for (const element of elements) {
            // Build qualified name
            const qualifiedName = parentPackage
                ? `${parentPackage}::${element.name}`
                : element.name;

            // Extract specializations from relationships
            const specializes = relationships
                .filter(r => r.source === element.name &&
                            (r.type === 'specialization' || r.type === 'specializes'))
                .map(r => r.target);

            // Create library symbol
            const symbol: LibrarySymbol = {
                qualifiedName,
                name: element.name,
                packagePath: parentPackage,
                kind: this.normalizeKind(element.type),
                sourceFile,
                line: element.range.start.line,
                documentation: element.attributes.get('documentation') as string,
                specializes,
                features: this.extractFeatures(element),
                relationships: this.extractRelationships(element, relationships),
                constraints: [],
                stereotypes: [],
                isAbstract: element.attributes.get('modifier') === 'abstract',
                visibility: this.extractVisibility(element)
            };

            // Add optional properties
            if (element.attributes.has('direction')) {
                symbol.direction = element.attributes.get('direction') as 'in' | 'out' | 'inout';
            }
            if (element.attributes.has('dataType') || element.attributes.has('partType')) {
                symbol.type = (element.attributes.get('dataType') || element.attributes.get('partType')) as string;
            }
            if (element.attributes.has('defaultValue')) {
                symbol.defaultValue = element.attributes.get('defaultValue') as string;
            }

            // Store symbol
            this.symbols.set(qualifiedName, symbol);

            // Update simple name index
            if (!this.simpleNameIndex.has(element.name)) {
                this.simpleNameIndex.set(element.name, []);
            }
            this.simpleNameIndex.get(element.name)!.push(qualifiedName);

            // Update package index
            if (element.type === 'package') {
                this.packages.set(qualifiedName, []);
                this.stats.totalPackages++;
            }
            if (parentPackage && this.packages.has(parentPackage)) {
                this.packages.get(parentPackage)!.push(qualifiedName);
            }

            // Update specialization graph
            for (const parent of specializes) {
                if (!this.specializationGraph.has(parent)) {
                    this.specializationGraph.set(parent, new Set());
                }
                this.specializationGraph.get(parent)!.add(qualifiedName);
            }

            // Update stats
            this.stats.totalSymbols++;
            this.stats.byKind[symbol.kind] = (this.stats.byKind[symbol.kind] || 0) + 1;

            // Recursively process children
            if (element.children.length > 0) {
                const childPackage = element.type === 'package' ? qualifiedName : parentPackage;
                this.extractSymbols(element.children, sourceFile, relationships, childPackage);
            }
        }
    }

    /**
     * Extract features from element
     */
    private extractFeatures(element: SysMLElement): LibraryFeature[] {
        const features: LibraryFeature[] = [];

        for (const child of element.children) {
            if (['attribute', 'port', 'reference', 'action', 'state'].includes(child.type)) {
                features.push({
                    name: child.name,
                    kind: child.type as any,
                    type: (child.attributes.get('dataType') || child.attributes.get('partType')) as string,
                    multiplicity: child.attributes.get('multiplicity') as string,
                    direction: child.attributes.get('direction') as 'in' | 'out' | 'inout',
                    defaultValue: child.attributes.get('defaultValue') as string,
                    isComposite: child.type !== 'reference'
                });
            }
        }

        return features;
    }

    /**
     * Extract relationships for an element
     */
    private extractRelationships(
        element: SysMLElement,
        allRelationships: Relationship[]
    ): LibraryRelationship[] {
        return allRelationships
            .filter(r => r.source === element.name)
            .map(r => ({
                type: r.type as any,
                source: r.source,
                target: r.target
            }));
    }

    /**
     * Normalize element kind to standard values
     */
    private normalizeKind(type: string): LibrarySymbol['kind'] {
        const kindMap: Record<string, LibrarySymbol['kind']> = {
            'package': 'package',
            'part': 'part',
            'part def': 'part def',
            'action': 'action',
            'action def': 'action def',
            'state': 'state',
            'state def': 'state def',
            'requirement': 'requirement',
            'requirement def': 'requirement def',
            'constraint': 'constraint',
            'constraint def': 'constraint def',
            'attribute': 'attribute',
            'port': 'port',
            'interface': 'interface',
            'connection': 'connection',
            'allocation': 'allocation',
            'item': 'item',
            'item def': 'item def',
            'occurrence': 'occurrence',
            'enumeration': 'enumeration',
            'metadata': 'metadata',
            'comment': 'comment',
            'doc': 'doc'
        };

        return kindMap[type.toLowerCase()] || 'part' as LibrarySymbol['kind'];
    }

    /**
     * Extract visibility from element
     */
    private extractVisibility(element: SysMLElement): 'public' | 'private' | 'protected' {
        const mod = element.attributes.get('modifier') || element.attributes.get('visibility');
        if (mod === 'private') return 'private';
        if (mod === 'protected') return 'protected';
        return 'public';
    }

    /**
     * Create mock VS Code document for parsing
     */
    private createMockDocument(content: string, filePath: string): any {
        const lines = content.split('\n');
        return {
            getText: () => content,
            uri: { path: filePath, fsPath: filePath },
            lineCount: lines.length,
            lineAt: (line: number) => ({
                text: lines[line] || '',
                range: {
                    start: { line, character: 0 },
                    end: { line, character: (lines[line] || '').length }
                }
            }),
            positionAt: (offset: number) => {
                const before = content.slice(0, offset);
                const linesBefore = before.split('\n');
                return {
                    line: linesBefore.length - 1,
                    character: linesBefore[linesBefore.length - 1].length
                };
            }
        };
    }

    /**
     * Generate version identifier from directory
     */
    private generateVersion(dirPath: string): string {
        // Use directory modification time and content hash
        const stats = fs.statSync(dirPath);
        const hash = crypto.createHash('md5')
            .update(dirPath)
            .update(stats.mtime.toISOString())
            .digest('hex')
            .substring(0, 8);
        return `lib-${hash}`;
    }

    /**
     * Serialize library for caching
     */
    public static serialize(library: CompiledLibrary): SerializedLibrary {
        return {
            version: library.version,
            timestamp: library.timestamp,
            symbols: Array.from(library.symbols.entries()),
            simpleNameIndex: Array.from(library.simpleNameIndex.entries()),
            packages: Array.from(library.packages.entries()),
            specializationGraph: Array.from(library.specializationGraph.entries())
                .map(([k, v]) => [k, Array.from(v)]),
            stats: library.stats
        };
    }

    /**
     * Deserialize library from cache
     */
    public static deserialize(data: SerializedLibrary): CompiledLibrary {
        return {
            version: data.version,
            timestamp: data.timestamp,
            symbols: new Map(data.symbols),
            simpleNameIndex: new Map(data.simpleNameIndex),
            packages: new Map(data.packages),
            specializationGraph: new Map(
                data.specializationGraph.map(([k, v]) => [k, new Set(v)])
            ),
            stats: data.stats
        };
    }

    /**
     * Reset internal state
     */
    private reset(): void {
        this.symbols.clear();
        this.simpleNameIndex.clear();
        this.packages.clear();
        this.specializationGraph.clear();
        this.stats = {
            totalSymbols: 0,
            byKind: {},
            totalFiles: 0,
            totalPackages: 0
        };
    }
}
