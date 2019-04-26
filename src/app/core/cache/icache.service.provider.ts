import { InMemoryCacheStorageService } from './inmemory-cache-storage/inmemory-cache-storage.service';
import { LocalCacheStorageService } from './local-cache-storage/local-cache-storage.service';

const iCacheServiceFactory = () => {
  return window.localStorage
    ? new LocalCacheStorageService()
    : new InMemoryCacheStorageService();
};

export const ICacheServiceProvider = {
  provide: 'ICacheServiceProvider',
  useFactory: iCacheServiceFactory,
  deps: []
};
