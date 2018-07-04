import { URL_SERVICIOS } from "./../../config/url.servicios";
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

import { ToastController, AlertController } from "ionic-angular";

@Injectable()
export class EmbarquesProvider {
  resultado: boolean = false;
  embarquesExistentes: any = [];
  misEmbarquesExistentes: any = [];
  detalleEmbarque: any = [];
  numeroProductos: number = 0;

  constructor(
    public http: Http,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {}
  obtenerEmbarquesPorEstablecimiento(id: string) {
    this.embarquesExistentes = [];

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    //SERVICIO DE CONSULTA
    let url = URL_SERVICIOS + "/WS_Embarque/obtenEmbarques?id=" + id;

    return this.http.post(url, options).map(resp => {
      let data_resp = resp.json();

      if (data_resp.error) {
        //console.log("Error al obtener los datos");
      } else {
        //console.log(data_resp);
        this.resultado = true;
        this.embarquesExistentes = this.obtenHoraEntrega(data_resp);
      }
    });
  }

  //VALIDA INGRESO
  obtenerMisEmbarquesPorEstablecimiento(id: string) {
    this.misEmbarquesExistentes = [];
    //let data = new URLSearchParams();

    //SERVICIO DE CONSULTA
    let url = URL_SERVICIOS + "/WS_Embarque/obtenMisEmbarques?id=" + id;

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, options).map(resp => {
      let data_resp = resp.json();

      if (data_resp.error) {
        //console.log("Error al obtener los datos");
      } else {
        //console.log(data_resp);
        this.resultado = true;
        this.misEmbarquesExistentes = this.obtenHoraEntrega(data_resp);
      }
    });
  } //Obtención de los embarques por establecimiento, del usuario
  //logeado se obtiene el establecimiento del que depende

  asignarEmbarque(obj: any) {
    //SERVICIO DE CONSULTA
    let url2 = URL_SERVICIOS + "/WS_Embarque/asignarEmbarque";
    var myData = JSON.stringify(obj);

    this.http
      .post(url2, myData)
      .map(resp => resp.json())
      .subscribe(
        data => {
          this.mensaje("No se pudo asignar el embarque");
        },
        error => {
          this.mensaje("Embarque aceptado");

          let indice = 0;
          for (let i = 0; i < this.embarquesExistentes.length; i++) {
            if (this.embarquesExistentes[i].id == obj.id_Embarque) {
              indice = i;
            }
          }

          if (indice > -1) {
            this.embarquesExistentes.splice(indice, 1);
          }
        }
      );
  }

  demoraEmbarque(obj: any) {
    //SERVICIO DE CONSULTA
    let url2 = URL_SERVICIOS + "/WS_Embarque/demoraEmbarque";
    var myData = JSON.stringify(obj);

    this.http
      .post(url2, myData)
      .map(resp => resp.json())
      .subscribe(
        data => {
          this.mensaje(
            "Se presento un problema al actualizar el estatus del embarque"
          );
        },
        error => {
          this.mensaje("Demora registrada");

          for (let i = 0; i < this.misEmbarquesExistentes.length; i++) {
            if (this.misEmbarquesExistentes[i].id == obj.id_Embarque) {
              this.misEmbarquesExistentes[i].demora = obj.demora;
            }
          }
        }
      );
  }

  fotoEmbarque(obj: any) {
    //SERVICIO DE CONSULTA
    let url2 = URL_SERVICIOS + "/WS_Embarque/fotoEmbarque";
    var myData = JSON.stringify(obj);

    return this.http.post(url2, myData).map(resp => resp.json());
    /*
      .subscribe(
        data => {
		  //this.mensaje("Se presento un problema al registrar la evidencia de entrega del embarque");
        },
        error => {
          //this.mensaje("Evidencia de entrega registrada exitosamente");

		  let indice = 0;
          for (let i = 0; i < this.misEmbarquesExistentes.length; i++) {
            if (this.misEmbarquesExistentes[i].id == obj.id_Embarque) {
              indice = i;
            }
          }
          if (indice > -1) {
            this.misEmbarquesExistentes.splice(indice, 1);
          }

        }
      );
      */
  }

  desasignarEmbarque(obj: any) {
    //SERVICIO DE CONSULTA
    let url2 = URL_SERVICIOS + "/WS_Embarque/desasignarEmbarque";
    var myData = JSON.stringify(obj);

    this.http
      .post(url2, myData)
      .map(resp => resp.json())
      .subscribe(
        data => {
          this.mensaje("Error al actualizar el estatus del embarque");
        },
        error => {
          this.mensaje("Embarque actualizado correctamente");

          let indice = 0;
          for (let i = 0; i < this.misEmbarquesExistentes.length; i++) {
            if (this.misEmbarquesExistentes[i].id == obj.id_Embarque) {
              indice = i;
            }
          }

          if (indice > -1) {
            this.misEmbarquesExistentes.splice(indice, 1);
          }
        }
      );
  }

  entregarEmbarque(obj: any) {
    //let data = new URLSearchParams();
    //data.append("id_Embarque", obj.id_Embarque);

    //SERVICIO DE CONSULTA
    let url2 = URL_SERVICIOS + "/WS_Embarque/entregadoEmbarque";
    var myData = JSON.stringify(obj);

    this.http
      .post(url2, myData)
      .map(resp => resp.json())
      .subscribe(
        data => {
          //this.mensaje("Error al actualizar el estatus del embarque");
          //console.log(data);
        },
        error => {
          //this.mensaje("Embarque entregado");
          //this.soloAvisa();

          let indice = 0;
          for (let i = 0; i < this.misEmbarquesExistentes.length; i++) {
            if (this.misEmbarquesExistentes[i].id == obj.id_Embarque) {
              indice = i;
            }
          }
          if (indice > -1) {
            this.misEmbarquesExistentes.splice(indice, 1);
          }
        }
      );
  }

  obtenerDetalleEmbarque(id: string) {
    //let data = new URLSearchParams();

    //SERVICIO DE CONSULTA
    let url =
      URL_SERVICIOS + "/WS_OrdenDetalle/ordenPorEmbarqueAgrupado?id=" + id;

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({
      headers: headers
    });

    return this.http.post(url, options).map(resp => {
      let data_resp = resp.json();

      if (data_resp.error) {
        this.mensaje("Se presento un error al cargar el detalle del embarque");
      } else {
        let cant = 0;

        this.detalleEmbarque = data_resp;
        for (let i = 0; i < this.detalleEmbarque.length; i++) {
          cant = cant + this.detalleEmbarque[i].cantidad;
        }
        this.numeroProductos = cant;
      }
    });
  } //Fin del método para obtener detalles del embarque

  private obtenHoraEntrega(arr: any) {
    let cadena = "";
    for (let i = 0; i < arr.length; i += 1) {
      for (let obj of Object(arr[i].ordenes)) {
        cadena = obj.horaEntrega;
      }

      let horafecha = "01/01/2000 " + cadena;

      let temp1 = new Date(horafecha);

      let hora = "";
      let diferencia = temp1.getHours() - 1;
      if (diferencia < 10) {
        hora = "0" + diferencia + ":00";
      } else {
        hora = diferencia + ":00";
      }

      arr[i].horaEntrega = cadena;
      arr[i].horaSalida = hora;

      cadena = "";
    }
    return arr;
  }

  mensaje(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      // console.log("Dismissed toast");
    });

    toast.present();
  }

  soloAvisa() {
    const alert = this.alertCtrl.create({
      title: "Mensaje",
      message: "Tu embarque ha quedado registrado como entregado",
      buttons: [
        {
          text: "Aceptar",
          handler: () => {}
        }
      ]
    });
    alert.present();
  }
}
