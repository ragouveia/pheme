import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import {Md5} from 'ts-md5/dist/md5';
import {CacheControl} from './cache-control';
import {ICacheStorageService} from './icache-storage.service';

export abstract class AbstractCacheStorageService implements ICacheStorageService {

    abstract clear();

    abstract remove(key: string);

    protected abstract getCacheControl(key: string): CacheControl;

    protected abstract saveCacheControl(cacheControl: CacheControl);

    protected abstract keys(): string[];

    has(key: string): boolean {
        return !!this.getCacheControl(key);
    }

    get<T>(key: string): T {
        const cacheControl: CacheControl = this.getCacheControl(key);

        if (cacheControl) {
            cacheControl.incrementAcessCount();
            this.saveCacheControl(cacheControl);
            return JSON.parse(cacheControl.value);
        } else {
            return undefined;
        }
    }

    put<T>(key: string, value: T): T {
        let cacheControl: CacheControl = this.getCacheControl(key);
        const valueAsJson = JSON.stringify(value);

        if (cacheControl && cacheControl.value !== valueAsJson) {
            cacheControl.value = JSON.stringify(value);
            cacheControl.hash = Md5.hashStr(valueAsJson).toString();
            this.saveCacheControl(cacheControl);
        } else {
            cacheControl = new CacheControl(key, valueAsJson, Md5.hashStr(valueAsJson).toString());
            this.saveCacheControl(cacheControl);
        }
        return value;
    }

    getOrPut<T>(key: string, valueGeneratorObsersable: Observable<T>): Observable<T> {
        const existentValue = this.get<T>(key);
        let returnedValue: Observable<T>;

        if (existentValue) {
            returnedValue = of(existentValue);
        } else {
            returnedValue = this.handleGeneratedObservableValue(valueGeneratorObsersable, key);
        }
        return returnedValue;
    }

    private handleGeneratedObservableValue<T>(functionGeneratorResult: Observable<T>, key: string): Observable<T> {
        return functionGeneratorResult.pipe(
            tap(value => this.put<T>(key, value)),
            take(1));
    }

    protected removeLeastAccessedCacheEntries() {
        const keys = this.keys();
        let numberOfElementsToBeRemoved =  Math.ceil( keys.length / 3 );
        const allCacheControls = new Array<CacheControl>();

        for (let i = 0; i < keys.length; i++) {
            allCacheControls.push(this.getCacheControl(keys[i]));
        }
        allCacheControls.sort( (valueA, valueB) => {
            if (valueA.accessCount === valueB.accessCount) {
                return 0;
            } else if (valueA.accessCount < valueB.accessCount) {
                return 1;
            } else {
                return -1;
            }
        });

        for ( let i = allCacheControls.length - 1 ; numberOfElementsToBeRemoved > 0; i--, numberOfElementsToBeRemoved--) {
            this.remove(allCacheControls[i].key);
        }
    }

}
