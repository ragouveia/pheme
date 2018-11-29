import { AngularFirestoreDocument } from '@angular/fire/firestore';
import {  map } from 'rxjs/operators';

import { Observable } from 'rxjs';

/**
 * Function which extracts the data of an AngularFirestoreDocument returning a obsersable of the T type.
 * @param firebirdDoc The firebird document
 */
export function getFirebirdData<T>(firebirdDoc: AngularFirestoreDocument ): Observable<T> {
    return firebirdDoc
        .get()
        .pipe(
            map(snapshot => <T>snapshot.data())
        );
 }

