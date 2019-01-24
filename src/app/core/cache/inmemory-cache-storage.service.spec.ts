import { of } from 'rxjs';

import {InMemoryCacheStorageService} from './inmemory-cache-storage.service';

let inMemoryCacheStorage = new InMemoryCacheStorageService();

describe('InMemoryCacheStorage', () => {

  const key = 'keyTest';

  beforeEach(() => {
    inMemoryCacheStorage = new InMemoryCacheStorageService();
  });

  it('1 - should save a cache control in the cache', () => {
    const value = 'valueTest';

    inMemoryCacheStorage.put(key, value);
    expect(inMemoryCacheStorage.get(key)).toBe(value);
  });

  it('2 - should return undefined whether try to get a inexistent cache control from cache', () => {
    expect(inMemoryCacheStorage.get(key)).toBeUndefined();
  });

  it('3 - should remove a cache control from cache', () => {
    setupCacheWithKey(key, 'valueTest');
    inMemoryCacheStorage.remove(key);
    expect(inMemoryCacheStorage.get(key)).toBeUndefined();
  });

  it('4 - should clear the cache', () => {
    setupCacheWithKey(key, 'valueTest');
    inMemoryCacheStorage.clear();
    expect(inMemoryCacheStorage.get(key)).toBeUndefined();
  });

  it('5 - should clear cache whether it is full', () => {
    const value = 'valueTest';
    const sizeOfCacherAfterCleanup = InMemoryCacheStorageService.CACHE_SIZE -
        Math.floor(InMemoryCacheStorageService.CACHE_SIZE / 3);

    simulateInMemoryCacheFull();
    inMemoryCacheStorage.put(key, value);
    expect(inMemoryCacheStorage.size()).toBe(sizeOfCacherAfterCleanup);
  });

  it('6 - should save a cache control after cache cleaning', () => {
    const value = 'valueTest';
    const sizeOfCacherAfterCleanup = InMemoryCacheStorageService.CACHE_SIZE -
        Math.floor(InMemoryCacheStorageService.CACHE_SIZE / 3);

    simulateInMemoryCacheFull();
    inMemoryCacheStorage.put(key, value);
    expect(inMemoryCacheStorage.get(key)).toBe(value);
    expect(inMemoryCacheStorage.size()).toBe(sizeOfCacherAfterCleanup);
  });

   it('7 - should update cache size after save a cache control', () => {
    const oldSize = inMemoryCacheStorage.size();

    inMemoryCacheStorage.put(key, 'testValue');
    expect(inMemoryCacheStorage.size()).toBe(oldSize + 1);
  });

  it('8 - should update cache size after remove value', () => {
    const oldSize = inMemoryCacheStorage.size();

    inMemoryCacheStorage.put(key, 'testValue');
    inMemoryCacheStorage.remove(key);
    expect(inMemoryCacheStorage.size()).toBe(oldSize);
  });

  it('9 - should remove the least accessed itens from cache when its is full', () => {
    const mostAccessedKey = 'mostAccessed';
    const leastAccessedKey = 'leastAccessed';

    // put 2 values into cache
    setupCacheWithKey(leastAccessedKey, leastAccessedKey);
    setupCacheWithKey(mostAccessedKey, mostAccessedKey);

    for (let i = 0; i < 100; i++) {
      inMemoryCacheStorage.get(mostAccessedKey);

      if (i < 50 ) {
        inMemoryCacheStorage.get(leastAccessedKey);
      }
    }

    simulateInMemoryCacheFull();
    expect(window.localStorage.getItem(mostAccessedKey)).toBeDefined();
    expect(window.localStorage.getItem(leastAccessedKey)).toBeDefined();
  });

});

function setupCacheWithKey(key: string, value: string) {
  inMemoryCacheStorage.put(key, value);
}

function simulateInMemoryCacheFull() {
  const valueToFill = 'fill';

  for ( let i = 1; i <= InMemoryCacheStorageService.CACHE_SIZE; i++) {
    inMemoryCacheStorage.put(i + '', valueToFill);
  }

}
