import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

let singletonModule = null;

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
})
export class CoreModule {

    constructor() {
        if (singletonModule) {
          throw new Error('Module can\'t be imported twice');
        }
        singletonModule = this;
    }

}
