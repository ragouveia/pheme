import { of } from 'rxjs';

import {CacheControl} from './cache-control';
import {LocalCacheStorageService} from './local-cache-storage.service';

describe('LocalCacheStorage', () => {

  const key = 'keyTest';
  const localCacheStorage = new LocalCacheStorageService();

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterAll( () => {
    window.localStorage.clear();
  });

  it('1- should save a cache control object in the cache', () => {
    const value = 'valueTest';

    localCacheStorage.put(key, value);
    expect(getValueFromCacheControl(key)).toBe(value);
  });

  it('2- should get a cache control object from the cache', () => {
    const value = 'valueTest';

    setupCacheWithKey(key, 'valueTest');
    expect(localCacheStorage.get<string>(key)).toBe(value);
  });

  it('3 - should return undefined whether try to get a inexistent cache control from cache', () => {
    expect(localCacheStorage.get(key)).toBeUndefined();
  });

  it('4 - should remove a cache control from cache', () => {
    setupCacheWithKey(key, 'valueTest');
    localCacheStorage.remove(key);
    expect(window.localStorage.getItem(key)).toBeNull();
  });

  it('5 - should clear the cache', () => {
    setupCacheWithKey(key, 'valueTest');
    localCacheStorage.clear();
    expect(window.localStorage.getItem(key)).toBeNull();
  });

  it('6 - should remove the least accessed itens from cache when its is full', () => {
    const mostAccessedKey = 'mostAccessed';
    const leastAccessedKey = 'leastAccessed';
    const otherKey = 'otherKey';

    // put 2 values into cache
    setupCacheWithKey(leastAccessedKey, leastAccessedKey);
    setupCacheWithKey(mostAccessedKey, mostAccessedKey);

    for (let i = 0; i < 100; i++) {
      localCacheStorage.get(mostAccessedKey);

      if (i < 50 ) {
        localCacheStorage.get(leastAccessedKey);
      }
    }

    const spyObj = simulateLocalStorageQuotaExceededError();
    localCacheStorage.put(otherKey, otherKey);

    expect(window.localStorage.getItem(mostAccessedKey)).toBeDefined();
    expect(window.localStorage.getItem(leastAccessedKey)).toBeNull();
    expect(window.localStorage.getItem(otherKey)).toBeDefined();
  });

  });

function setupCacheWithKey(key: string, value: string, hash = '') {
  window.localStorage.setItem(key, JSON.stringify(new CacheControl(key, JSON.stringify(value), hash)));
}

function simulateLocalStorageQuotaExceededError(count = 1) {
  const originalFunction = window.localStorage.setItem.bind(window.localStorage);

  return spyOn(window.localStorage, 'setItem').and.callFake((key, value) => {
      if (count > 0 ) {
          count--;
          throw new Error('QuotaExceededError');
      } else {
          originalFunction(key, value);
      }
  });
}

function getValueFromCacheControl(key: string): string {
  return JSON.parse(JSON.parse(window.localStorage[key]).value);
}
