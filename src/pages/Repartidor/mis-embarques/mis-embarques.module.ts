import { PipesModule } from "./../../../pipes/pipes.module";

import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MisEmbarquesPage } from "./mis-embarques";


import { Network } from "@ionic-native/network";

@NgModule({
  declarations: [MisEmbarquesPage],
  imports: [IonicPageModule.forChild(MisEmbarquesPage), PipesModule],
   providers: [
    Network
  ]
})
export class MisEmbarquesPageModule {}
