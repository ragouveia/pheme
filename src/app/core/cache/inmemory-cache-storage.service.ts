import {AbstractCacheStorageService} from './abstract-cache-storage.service';

import {CacheControl} from './cache-control';

export class InMemoryCacheStorageService extends AbstractCacheStorageService {

    public static readonly CACHE_SIZE = 200;
    private cache;

    constructor() {
        super();
        this.initializeCache();
    }

    private initializeCache() {
        this.cache = {};
    }

    protected getCacheControl(key: string): CacheControl {
        return this.cache[key];
    }

    protected saveCacheControl(cacheControl: CacheControl) {
        const existCacheControl: boolean = this.cache[cacheControl.key];
        const cacheIsFull = this.size() + 1 > InMemoryCacheStorageService.CACHE_SIZE;

        if (!existCacheControl && cacheIsFull) {
            this.removeLeastAccessedCacheEntries();
        }
        this.cache[cacheControl.key] = cacheControl;
    }

    clear() {
       this.initializeCache();
    }

    remove(key: string) {
        delete this.cache[key];
    }

    size(): number {
        return Object.keys(this.cache).length;
    }

    protected keys(): string[] {
        return  Object.keys(this.cache);
    }
}
