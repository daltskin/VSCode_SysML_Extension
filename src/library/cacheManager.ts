/**
 * Library Cache Manager - Handles caching of compiled library to disk
 */

import * as fs from 'fs';
import * as path from 'path';
import { LibraryCompiler } from './compiler';
import { CompiledLibrary, SerializedLibrary } from './types';

export class LibraryCacheManager {
    private cacheDir: string;
    private cacheFile: string;

    constructor(extensionPath: string) {
        this.cacheDir = path.join(extensionPath, '.sysml-cache');
        this.cacheFile = path.join(this.cacheDir, 'library.json');
    }

    /**
     * Load compiled library from cache or compile fresh
     */
    public async getCompiledLibrary(libraryPath: string, forceRecompile: boolean = false): Promise<CompiledLibrary> {
        // Check if cache exists and is valid
        if (!forceRecompile && this.isCacheValid()) {
            try {
                const cached = this.loadFromCache();
                if (cached) {
                    return cached;
                }
            } catch {
                // Cache load failed, will recompile
            }
        }

        // Compile fresh
        const compiler = new LibraryCompiler();
        const compiled = await compiler.compileLibrary(libraryPath);

        // Save to cache
        await this.saveToCache(compiled);

        return compiled;
    }

    /**
     * Check if cache file exists and is valid
     */
    private isCacheValid(): boolean {
        if (!fs.existsSync(this.cacheFile)) {
            return false;
        }

        try {
            const stats = fs.statSync(this.cacheFile);
            // Cache is valid for 7 days
            const age = Date.now() - stats.mtime.getTime();
            const maxAge = 7 * 24 * 60 * 60 * 1000;
            return age < maxAge;
        } catch {
            return false;
        }
    }

    /**
     * Load library from cache file
     */
    private loadFromCache(): CompiledLibrary | null {
        try {
            const content = fs.readFileSync(this.cacheFile, 'utf-8');
            const serialized: SerializedLibrary = JSON.parse(content);
            return LibraryCompiler.deserialize(serialized);
        } catch (error) {
            console.error('[LibraryCache] Failed to parse cache:', error);
            return null;
        }
    }

    /**
     * Save compiled library to cache
     */
    private async saveToCache(library: CompiledLibrary): Promise<void> {
        try {
            // Ensure cache directory exists
            if (!fs.existsSync(this.cacheDir)) {
                fs.mkdirSync(this.cacheDir, { recursive: true });
            }

            const serialized = LibraryCompiler.serialize(library);
            const content = JSON.stringify(serialized, null, 2);
            fs.writeFileSync(this.cacheFile, content, 'utf-8');
        } catch {
            // Silently ignore cache save failures
        }
    }

    /**
     * Invalidate cache (force recompilation on next load)
     */
    public invalidateCache(): void {
        if (fs.existsSync(this.cacheFile)) {
            fs.unlinkSync(this.cacheFile);
        }
    }

    /**
     * Get cache statistics
     */
    public getCacheStats(): { exists: boolean; size?: number; age?: number } {
        if (!fs.existsSync(this.cacheFile)) {
            return { exists: false };
        }

        try {
            const stats = fs.statSync(this.cacheFile);
            return {
                exists: true,
                size: stats.size,
                age: Date.now() - stats.mtime.getTime()
            };
        } catch {
            return { exists: false };
        }
    }
}
