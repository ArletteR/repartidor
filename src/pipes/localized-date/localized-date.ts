import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the LocalizedDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "localizedDate"
})
export class LocalizedDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    let sub1 = value.substring(5, 7);
    let sub2 = value.substring(8, 10);

    if (sub1 == "01") sub1 = "Enero";
    if (sub1 == "02") sub1 = "Febrero";
    if (sub1 == "03") sub1 = "Marzo";
    if (sub1 == "04") sub1 = "Abril";
    if (sub1 == "05") sub1 = "Mayo";
    if (sub1 == "06") sub1 = "Junio";
    if (sub1 == "07") sub1 = "Julio";
    if (sub1 == "08") sub1 = "Agosto";
    if (sub1 == "09") sub1 = "Septiembre";
    if (sub1 == "10") sub1 = "Octubre";
    if (sub1 == "11") sub1 = "Noviembre";
    if (sub1 == "12") sub1 = "Diciembre";

    /// var datePipe = new DatePipe("es-mx");
    value = sub2 + "/" + sub1;
    return value;
  }
}
