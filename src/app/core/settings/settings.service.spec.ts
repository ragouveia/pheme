import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';
import { ICacheServiceProvider} from '../cache/icache.service.provider';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFirestoreModule,
      AngularFireModule.initializeApp(environment.firebase)
    ],
    providers: [ICacheServiceProvider]

  }));

  it('should be created', () => {
    const service: SettingsService = TestBed.get(SettingsService);
    expect(service).toBeTruthy();
  });
});
