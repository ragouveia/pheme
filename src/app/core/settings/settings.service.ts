import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {GeneralSiteSettings} from '../../shared/model/index';
import {ICacheStorageService} from '../cache/icache-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  static readonly GENERAL_SITE_SETTINGS_DOCUMENT = 'settings/general';

  private siteSettings: GeneralSiteSettings;

  constructor(private firestore: AngularFirestore,
              @Inject('ICacheServiceProvider') private cache: ICacheStorageService) {  }

  getGeneralSiteSettings(): Observable<GeneralSiteSettings> {
    const dataFromFirebird =  this
          .firestore
          .doc<GeneralSiteSettings>(SettingsService.GENERAL_SITE_SETTINGS_DOCUMENT)
          .get()
          .pipe(
            map(generalSiteSettings => this.siteSettings = <GeneralSiteSettings>generalSiteSettings.data())
          );

    return this.siteSettings
      ? of(this.siteSettings)
      : this.cache.getOrPut(SettingsService.GENERAL_SITE_SETTINGS_DOCUMENT, dataFromFirebird);
  }
}
