import { URL_IMAGENES } from './../../config/url.servicios';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ImagenesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "imagenes"
})
export class ImagenesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(codigo: string) {
    return URL_IMAGENES + codigo;
  }
}
