import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {GeneralSiteSettings} from '../../shared/model/index';
import {getFirebirdData} from '../firebird/firebird-helper';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  static readonly GENERAL_SITE_SETTINGS_DOCUMENT = 'settings/general';

  private siteSettings: GeneralSiteSettings;

  constructor(private firestore: AngularFirestore) {  }

  getGeneralSiteSettings(): Observable<GeneralSiteSettings> {
    return this.siteSettings
      ? of(this.siteSettings)
      : getFirebirdData<GeneralSiteSettings>(this.firestore.doc<GeneralSiteSettings>(SettingsService.GENERAL_SITE_SETTINGS_DOCUMENT))
        .pipe(
          map(generalSiteSettings => this.siteSettings = generalSiteSettings)
        );
  }
}
