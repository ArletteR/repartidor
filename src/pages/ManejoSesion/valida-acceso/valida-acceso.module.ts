import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValidaAccesoPage } from './valida-acceso';

//Formularios
import { ReactiveFormsModule } from "@angular/forms";
import { Network } from "@ionic-native/network";

@NgModule({
  declarations: [
    ValidaAccesoPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(ValidaAccesoPage),
  ],
  providers: [
    Network
  ]
})
export class ValidaAccesoPageModule {}
