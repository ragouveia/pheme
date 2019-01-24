import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ICacheServiceProvider} from './cache/icache.service.provider';

let singletonModule = null;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [ICacheServiceProvider],

})
export class CoreModule {

    constructor() {
        if (singletonModule) {
          throw new Error('Module can\'t be imported twice');
        }
        singletonModule = this;
    }

}
