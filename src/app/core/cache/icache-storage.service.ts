import { Observable } from 'rxjs';

export interface ICacheStorageService {

    put<T>(key: string, value: T): T;

    get<T>(key: string): T;

    getOrPut<T>(key: string, valueGeneratorObservable: Observable<T>): Observable<T>;

    clear();

    remove(key: string);

    has(key: string): boolean;
}
