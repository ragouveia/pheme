import { of } from 'rxjs';

import { CacheControl } from '../cache-control';
import { LocalCacheStorageService } from './local-cache-storage.service';

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

});

function setupCacheWithKey(key: string, value: string, hash: string = '') {
  const storedKey = LocalCacheStorageService.CACHE_CONTROL_PREFIX_KEY + key;
  window.localStorage.setItem(storedKey , JSON.stringify(new CacheControl(key, JSON.stringify(value), hash)));
}

function getValueFromCacheControl(key: string): string {
  const storeKey = LocalCacheStorageService.CACHE_CONTROL_PREFIX_KEY + key;

  /**
   * Thre are two JSON "stringfied" values: one is the cache control stored in the localstorage and the other one is the value
   * itself that the cache control save
   */
  return JSON.parse(JSON.parse(window.localStorage[storeKey]).value);
}
