import { InMemoryCacheStorageService } from './inmemory-cache-storage/inmemory-cache-storage.service';
import { LocalCacheStorageService } from './local-cache-storage/local-cache-storage.service';

const iCacheServiceFactory = () => {

  if (window.localStorage) {
    return new LocalCacheStorageService();
  } else {
    return new InMemoryCacheStorageService();
  }
};

export const ICacheServiceProvider = {
  provide: 'ICacheServiceProvider',
  useFactory: iCacheServiceFactory,
  deps: []
};
