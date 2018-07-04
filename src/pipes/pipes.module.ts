import { NgModule } from "@angular/core";
import { ImagenesPipe } from "./imagenes/imagenes";
import { LocalizedDatePipe } from "./localized-date/localized-date";
@NgModule({
  declarations: [ImagenesPipe, LocalizedDatePipe],
  imports: [],
  exports: [ImagenesPipe, LocalizedDatePipe]
})
export class PipesModule {}
