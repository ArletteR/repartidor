import { URL_SERVICIOS } from './../../config/url.servicios';
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

import { Platform,   ToastController } from "ionic-angular";

// PLUGIN STORAGE PARA ALMACENAMIENTO LOCAL
import { Storage } from "@ionic/storage";


@Injectable()
export class UsuariosProvider {
  datosIngreso: any = {};

  //DATOS QUE REQUIERO CONSERVAR UNA VEZ QUE INGRESA EL USUARIO
  username: string = "";
  password_plain: string = "";
  establecimiento_id: string = "";
  nombre: string = "";
  usuario_validado: number = -1;
  idUsuario: string = "";

  constructor(
    public http: Http,
    private platform: Platform,
    private storage: Storage,
    private toastCtrl: ToastController
  ) {
    this._loadStorage();
  }

  //VALIDA INGRESO PRIMERO SE VERIFICA QUE EL CORREO EXISTA
  validaIngreso(correo: string) {
    //let data = new URLSearchParams();
    //data.append("email", correo);

    //SE USA EL SERVICIO DE VALIDA EN WS_UserLG
    let url = URL_SERVICIOS + "/WS_UserLG/valida?email=" + correo;

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    return this.http.post(url, options).map(resp => {
      let data_resp = resp.json();



      if(data_resp.establecimiento != null){
      this.username = data_resp.username;
      this.password_plain = data_resp.session_id;
      this.establecimiento_id = data_resp.establecimiento.id;
      this.nombre = data_resp.nombre;
      this.idUsuario = data_resp.id;

      if (data_resp.enabled == true) {
        this.usuario_validado = 1;
        this._saveStorage();
      } else {
        this.usuario_validado = 0;
      }
    }else{
      this.usuario_validado = 4;
    }
    });
  } //FIN VALIDA INGRESO

  recuperaPassword(idUsuario: string) {
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    let options = new RequestOptions({ headers: headers });

    //SE USA EL SERVICIO DE VALIDA EN WS_UserLG
    let url = URL_SERVICIOS + "/WS_UserLG/recuperaPassword?email=" + idUsuario;

    return this.http.post(url, options).map(resp => {
     // let data_resp = resp.json();
    });
  } //FIN VALIDA INGRESO

  private _saveStorage() {
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.set("username", this.username);
      this.storage.set("nombre", this.nombre);
      this.storage.set("establecimiento_id", this.establecimiento_id);
      this.storage.set("password_plain", this.password_plain);
    } else {
      // computadora
      if (this.username) {
        localStorage.setItem("username", this.username);
        localStorage.setItem("nombre", this.nombre);
        localStorage.setItem("establecimiento_id", this.establecimiento_id);
        localStorage.setItem("password_plain", this.password_plain);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("nombre");
        localStorage.removeItem("establecimiento_id");
        localStorage.removeItem("password_plain");
      }
    }
  }

  public _removeStorage() {
    this.username = "";
    this.password_plain = "";
    this.establecimiento_id = "";
    this.nombre = "";
    this.usuario_validado = -1;
    this.idUsuario = "";

    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.remove("username");
      this.storage.remove("nombre");
      this.storage.remove("establecimiento_id");
      this.storage.remove("password_plain");
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("nombre");
      localStorage.removeItem("establecimiento_id");
      localStorage.removeItem("password_plain");
    }
  }

  _loadStorage() {
    let promesa = new Promise((resolve, reject) => {
      if (this.platform.is("cordova")) {
        // dispositivo
        this.storage.ready().then(() => {
          this.storage.get("username").then(username => {
            if (username) {
              this.username = username;
            }
          });

          this.storage.get("nombre").then(nombre => {
            if (nombre) {
              this.nombre = nombre;
            }
            resolve();
          });

          this.storage.get("establecimiento_id").then(establecimiento_id => {
            if (establecimiento_id) {
              this.establecimiento_id = establecimiento_id;
            }
            resolve();
          });

          this.storage.get("password_plain").then(password_plain => {
            if (password_plain) {
              this.password_plain = password_plain;
            }
            resolve();
          });
        });
      } else {
        // computadora
        if (localStorage.getItem("username")) {
          //Existe items en el localstorage
          this.username = localStorage.getItem("username");
          this.nombre = localStorage.getItem("nombre");
          this.establecimiento_id = localStorage.getItem("establecimiento_id");
          this.password_plain = localStorage.getItem("password_plain");
        }
        resolve();
      }
    });
    return promesa;
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
}
