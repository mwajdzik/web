import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import {MultiComboBoxComponent} from './multi-combobox/multi-combo-box.component';
import {createCustomElement} from "@angular/elements";

@NgModule({
  declarations: [
    MultiComboBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [MultiComboBoxComponent]
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const customElement = createCustomElement(MultiComboBoxComponent, {injector: this.injector});
    customElements.define('ro-multi-combobox', customElement);
  }
}
