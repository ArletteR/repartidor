import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerminosCondicionesPage } from './terminos-condiciones';

import { EmailComposer } from "@ionic-native/email-composer";

@NgModule({
  declarations: [
    TerminosCondicionesPage,
  ],
  imports: [
    IonicPageModule.forChild(TerminosCondicionesPage),
  ],
  providers: [
    EmailComposer,
  ]
})
export class TerminosCondicionesPageModule {}
