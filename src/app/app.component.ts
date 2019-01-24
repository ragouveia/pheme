import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import {SettingsService} from './core/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pheme';

  constructor(private settingsService: SettingsService) {
    const generalSettings = settingsService.getGeneralSiteSettings();

    generalSettings.subscribe(general => {
        console.log(general.title);
    });
  }
}
