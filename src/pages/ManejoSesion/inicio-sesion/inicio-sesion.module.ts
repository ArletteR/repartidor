import { NgModule } from "@angular/core";
import { IonicPageModule } from 'ionic-angular';
import { InicioSesionPage } from './inicio-sesion';

//Formularios
import { ReactiveFormsModule } from "@angular/forms";
import { Network } from "@ionic-native/network";

@NgModule({
  declarations: [
    InicioSesionPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(InicioSesionPage)
  ],
  providers: [
    Network
  ]
})
export class InicioSesionPageModule {}
