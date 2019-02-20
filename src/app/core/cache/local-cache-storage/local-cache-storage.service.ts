import {AbstractCacheStorageService} from '../abstract-cache-storage.service';


import {CacheControl} from '../cache-control';

export class LocalCacheStorageService extends AbstractCacheStorageService  {

    protected getCacheControl(key: string): CacheControl {
        const cacheControlAsString: string = window.localStorage.getItem(key);

        return cacheControlAsString && cacheControlAsString.length ?
                Object.assign(new CacheControl('', '', ''), JSON.parse(cacheControlAsString))
                : undefined;
    }

    protected saveCacheControl(cacheControl: CacheControl) {
        const cacheControlAsJsonString = JSON.stringify(cacheControl);

        try {
            window.localStorage.setItem(cacheControl.key, cacheControlAsJsonString);
        } catch (e) {
            if (this.isLocalStorageQuotaExceededError(e)) {
                this.removeLeastAccessedCacheEntries();
                window.localStorage.setItem(cacheControl.key, cacheControlAsJsonString);
            }
        }
    }

    private isLocalStorageQuotaExceededError(e): boolean {
        return e.name === 'QuotaExceededError' || e.code === DOMException.QUOTA_EXCEEDED_ERR
          || e.toString().indexOf('QuotaExceededError') >= 0;
    }

    protected keys(): string[] {
        const keys = new Array<string>();

        for (let i = 0 ; i < window.localStorage.length; i++) {
            keys.push(window.localStorage.key(i));
        }
        return keys;
    }

    clear() {
        window.localStorage.clear();
    }

    remove(key: string) {
        window.localStorage.removeItem(key);
    }

}
