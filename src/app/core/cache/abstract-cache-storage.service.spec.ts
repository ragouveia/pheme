import { of } from 'rxjs';

import {AbstractCacheStorageService} from './abstract-cache-storage.service';
import {CacheControl} from './cache-control';

describe('LocalCacheStorage', () => {

  const key = 'keyTest';
  let cacheStorageStub;

  beforeEach(() => {
    cacheStorageStub = new AbstractCacheStorageServiceStub();
  });


  it('1- should put a value in cache', () => {
    const value =  'valueTest';

    cacheStorageStub.put(key, value);
    expect(cacheStorageStub.lastSavedCacheControl.value).toBe(JSON.stringify(value));
  });

  it('2 - should return undefined whether try to get a inexistent value from cache', () => {
    expect(cacheStorageStub.get('key')).toBeUndefined();
  });

  it('3 - should replace current value whether to put a value with a existent key', () => {
    const value =  {'valueTest' : 'valueTeEst'};
    const newValue = {'newValueTest' : 'newValueTest'};

    setupCacheWithKey(cacheStorageStub, key, value);
    cacheStorageStub.put(key, newValue);
    expect(cacheStorageStub.lastSavedCacheControl.value).toBe(JSON.stringify(newValue));
  });

  it('4 - should not call the function which generates value whether the key is in the cache', () => {
    const valueExpected = {'valueTest' : 'valueTest'};
    const valueGeneratorFunction = () => of('fail');

    setupCacheWithKey(cacheStorageStub, key, valueExpected);

    cacheStorageStub.getOrPut(key, valueGeneratorFunction)
                    .subscribe( value => expect(JSON.stringify(value)).toBe(JSON.stringify(valueExpected)));
  });

  it('5 - should call Observable which generates a value whether the key is not in cache', () => {
    const valueExpected = 'valueGeneratedFromObservable';
    const valueGeneratorObservable = of(valueExpected);

    cacheStorageStub.getOrPut(key, valueGeneratorObservable)
                    .subscribe( value => expect(value).toBe(valueExpected));
  });

  it('6 - should CALL function which generates value and put the value in cache', () => {
    const valueExpected = 'valueGeneratedFromFunction';
    const valueGeneratorObsersvable = of(valueExpected);

    cacheStorageStub.getOrPut(key, valueGeneratorObsersvable)
                    .subscribe( value => expect(value).toBe(valueExpected));

    expect(cacheStorageStub.lastSavedCacheControl.value).toBe(JSON.stringify(valueExpected));
  });

  it('7 - should increment access on get a value from cache', () => {
    cacheStorageStub.put(key, 'valueExpected');
    expect(getAcessCountFromCacheControl(cacheStorageStub, key)).toBe(0);
    cacheStorageStub.get(key);
    expect(getAcessCountFromCacheControl(cacheStorageStub, key)).toBe(1);
  });

  it('8 - should keep the access count whether to replace value of an existent key', () => {
    const newValue = 'newValue';

    cacheStorageStub.put(key, 'oldValue');
    cacheStorageStub.get(key);
    expect(getAcessCountFromCacheControl(cacheStorageStub, key)).toBe(1);
    cacheStorageStub.put(key, newValue);
    expect(cacheStorageStub.get(key)).toBe(newValue);
    expect(getAcessCountFromCacheControl(cacheStorageStub, key)).toBe(2);
  });

  it('9 - if the value is NOT in the cache then has method should return FALSE ', () => {
    expect(cacheStorageStub.has('inexistentkey')).toBe(false);
  });

  it('10 - if the value IS in the cache then has method should return TRUE ', () => {
    setupCacheWithKey(cacheStorageStub, key, 'value');
    expect(cacheStorageStub.has(key)).toBe(true);
  });

  it('11 - should remove the least accessed itens from cache when its is full', () => {
      const mostAccessedKey = 'mostAccessed';
      const leastAccessedKey = 'leastAccessed';
      const otherKey = 'otherKey';

      // put 2 values into cache
      setupCacheWithKey(cacheStorageStub, leastAccessedKey, leastAccessedKey);
      setupCacheWithKey(cacheStorageStub, mostAccessedKey, mostAccessedKey);

      cacheStorageStub.cacheFull = true;
      cacheStorageStub.put(otherKey, otherKey);

      expect(window.localStorage.getItem(mostAccessedKey)).toBeDefined();
      expect(window.localStorage.getItem(leastAccessedKey)).toBeNull();
      expect(window.localStorage.getItem(otherKey)).toBeDefined();
  });

  it('12 - should generate hash to cache value', () => {
      const keyTest = 'hashTest';
      const value = 'test';
      const expectedHash = '303b5c8988601647873b4ffd247d83cb';

      cacheStorageStub.put(keyTest, value);
      expect(window.localStorage.getItem(keyTest)).toBeDefined();
      expect(getHashFromCacheControl(cacheStorageStub, keyTest)).toBe(expectedHash);
  });

  it('13 - should replace md5 hash to cache value', () => {
    const keyTest = 'hashChangedTest';
    const value = 'originalValue';
    const originalHash = '098f6bcd4621d373cade4e832627b4f6';

    setupCacheWithKey(cacheStorageStub, keyTest, value, originalHash);

    cacheStorageStub.put(keyTest, 'changedValue');
    expect(window.localStorage.getItem(keyTest)).toBeDefined();
    expect(getHashFromCacheControl(cacheStorageStub, keyTest)).not.toBe(originalHash);
});

});

function setupCacheWithKey(cacheStorage: AbstractCacheStorageServiceStub, key: string, value: any, hash = '') {
  cacheStorage.storage[cacheStorage.storage.length] = new CacheControl(key, JSON.stringify(value), hash);
}

function getAcessCountFromCacheControl(cacheStorage: AbstractCacheStorageServiceStub, key: string): number {
  return cacheStorage.storage.find( cacheControl => cacheControl.key === key).accessCount;
}

function getHashFromCacheControl(cacheStorage: AbstractCacheStorageServiceStub, key: string): string {
  return cacheStorage.storage.find( cacheControl => cacheControl.key === key).hash;
}

class AbstractCacheStorageServiceStub extends AbstractCacheStorageService {

  public storage: CacheControl[] = new Array();
  public lastSavedCacheControl: CacheControl;
  public cacheFull = false;

  clear() {
    this.storage = new Array();
  }

  remove(key: string) {
    let indice = -1;

    for (let i = 0; i < this.storage.length; i++) {
        if (this.storage[i].key === key) {
          indice = i;
          break;
        }
    }
    if (indice >= 0 ) {
      this.storage.splice(indice, 0);
    }
  }

  protected getCacheControl(key: string): CacheControl {
    let cacheControl = null;

    for (let i = 0; i < this.storage.length; i++) {
      if (this.storage[i].key === key) {
        cacheControl = this.storage[i];
      }
    }
    return cacheControl;
  }

  protected saveCacheControl(cacheControl: CacheControl) {
    if (this.cacheFull) {
      this.removeLeastAccessedCacheEntries();
      this.cacheFull = false;
    }
    this.storage[this.storage.length] = cacheControl;
    this.lastSavedCacheControl = cacheControl;
  }

  protected keys(): string[] {
     return this.storage
                .map(cacheControl => cacheControl.key);
  }

}

