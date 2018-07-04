import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { DetalleEmbarquePage } from "./detalle-embarque";

import { PipesModule } from "./../../../pipes/pipes.module";

@NgModule({
  declarations: [DetalleEmbarquePage],
  imports: [IonicPageModule.forChild(DetalleEmbarquePage), PipesModule]
})
export class DetalleEmbarquePageModule {}
