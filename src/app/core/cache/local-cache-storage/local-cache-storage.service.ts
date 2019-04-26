import { AbstractCacheStorageService } from '../abstract-cache-storage.service';
import { CacheControl } from '../cache-control';

export class LocalCacheStorageService extends AbstractCacheStorageService  {

    static readonly CACHE_CONTROL_MAX_SIZE: number = 100;
    static readonly CACHE_CONTROL_COUNT_KEY: string = 'cacheControlCountKey';
    static readonly CACHE_CONTROL_PREFIX_KEY: string = 'CacheControl_';

    constructor() {
        super();
    }

    protected getCacheControl(key: string): CacheControl {
        const cacheControlAsString: string = window.localStorage.getItem(LocalCacheStorageService.CACHE_CONTROL_PREFIX_KEY + key);

        return cacheControlAsString && cacheControlAsString.length ?
                Object.assign(new CacheControl('', '', ''), JSON.parse(cacheControlAsString))
                : undefined;
    }

    protected saveCacheControl(cacheControl: CacheControl): void {
        const cacheControlAsJsonString: string = JSON.stringify(cacheControl);
        let cacheControlItensCount: number = this.getCacheControlItensCount();
        const storeKey: string = LocalCacheStorageService.CACHE_CONTROL_PREFIX_KEY + cacheControl.key;

        try {
            if (cacheControlItensCount >= LocalCacheStorageService.CACHE_CONTROL_MAX_SIZE) {
                this.removeLeastAccessedCacheEntries();
                cacheControlItensCount = this.keys().length;
            }

            window.localStorage.setItem(storeKey, cacheControlAsJsonString);

        } catch (e) {

            if (this.isLocalStorageQuotaExceededError(e)) {
                this.removeLeastAccessedCacheEntries();
                cacheControlItensCount = this.keys().length;
                window.localStorage.setItem(storeKey, cacheControlAsJsonString);
            }
        }

        cacheControlItensCount++;
        this.saveCacheControlItensCount(cacheControlItensCount);
    }

    private getCacheControlItensCount(): number {
        return window.localStorage.getItem(LocalCacheStorageService.CACHE_CONTROL_COUNT_KEY)
            ? Number.parseInt(window.localStorage.getItem(LocalCacheStorageService.CACHE_CONTROL_COUNT_KEY), 10)
            : 0;
    }

    private saveCacheControlItensCount(cacheControlItensCount: number): void {
        window.localStorage.setItem(LocalCacheStorageService.CACHE_CONTROL_COUNT_KEY, cacheControlItensCount.toString());
    }

    private isLocalStorageQuotaExceededError(e): boolean {
        return e.name === 'QuotaExceededError' || e.code === DOMException.QUOTA_EXCEEDED_ERR
          || e.toString().indexOf('QuotaExceededError') >= 0;
    }

    protected keys(): string[] {
        const keys = new Array<string>();

        for (let i = 0 ; i < window.localStorage.length; i++) {
            if (window.localStorage.key(i).startsWith(LocalCacheStorageService.CACHE_CONTROL_PREFIX_KEY)) {
                keys.push(window.localStorage.key(i));
            }
        }
        return keys;
    }

    clear(): void {
        window.localStorage.clear();
    }

    remove(key: string): void {
        window.localStorage.removeItem(key);
    }

}
