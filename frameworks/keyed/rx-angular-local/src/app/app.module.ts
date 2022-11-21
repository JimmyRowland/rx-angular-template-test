import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ForModule, PushModule} from "@rx-angular/template";

import {RxRenderStrategiesConfig, RX_RENDER_STRATEGIES_CONFIG} from '@rx-angular/cdk/render-strategies';

const CUSTOM_RX_ANGULAR_CONFIG: RxRenderStrategiesConfig<string> = {
    primaryStrategy: 'global',
    patchZone: false
}

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        PushModule,
        ForModule
    ],
  providers: [{
      provide: RX_RENDER_STRATEGIES_CONFIG,
      useValue: CUSTOM_RX_ANGULAR_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
