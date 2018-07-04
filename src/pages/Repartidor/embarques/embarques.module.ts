import { PipesModule } from "./../../../pipes/pipes.module";

import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { EmbarquesPage } from "./embarques";


import { Network } from "@ionic-native/network";

@NgModule({
  declarations: [EmbarquesPage],
  imports: [IonicPageModule.forChild(EmbarquesPage), PipesModule],
   providers: [
    Network
  ]
})
export class EmbarquesPageModule {}
