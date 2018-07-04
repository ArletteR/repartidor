import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCamaraPage } from './modal-camara';

//PLUGINS
import { File } from "@ionic-native/file";
import { Camera } from "@ionic-native/camera";

@NgModule({
  declarations: [
    ModalCamaraPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCamaraPage),
  ],
providers: [
    Camera, File
  ]
})
export class ModalCamaraPageModule {}
