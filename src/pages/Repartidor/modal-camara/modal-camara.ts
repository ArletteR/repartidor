import { URL_ARCHIVOS } from "./../../../config/url.servicios";
import { EmbarquesProvider } from "./../../../providers/embarques/embarques";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Platform,
  LoadingController,
  Loading,
  AlertController
} from "ionic-angular";

import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Observable } from "rxjs";

import { File, FileEntry } from "@ionic-native/file";

import { Camera } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-modal-camara",
  templateUrl: "modal-camara.html"
})
export class ModalCamaraPage {
  lastImage: string = null;
  loading: Loading;
  idEmbarque: any;
  idUsuarioRepartidor: any;
  public myPhoto: any;
  public myPhotoURL: any;
  public error: string;
  public fotoName: string = "";
  public nofoto: boolean = false;
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private toastCtrl: ToastController,
    private platformCtrl: Platform,
    private file: File,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _em: EmbarquesProvider
  ) {
    this.idEmbarque = this.navParams.get("id_embarque");
    this.idUsuarioRepartidor = this.navParams.get("id_Repartidor");

    if (this.platformCtrl.is("cordova")) {
      this.camera
        .getPicture({
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.PNG,
          saveToPhotoAlbum: true
        })
        .then(
          imageData => {
            this.myPhoto = imageData;
            this.nofoto = true;
            //this.uploadPhoto(imageData);
          },
          error => {
            this.error = JSON.stringify(error);
            this.navCtrl.push("MisEmbarquesPage");
          }
        );
    }
  }

  closeModal() {
    this.navCtrl.push("MisEmbarquesPage");
  }

  private uploadPhoto(imageFileUri: any): void {
    this.error = null;
    this.loading = this.loadingCtrl.create({
      content: "Cargando imagen en el servidor..."
    });

    this.loading.present();

    this.file
      .resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      this.fotoName = file.name;
      let NombreArchConId = file.name + "@" + this.idEmbarque;
      formData.append("file", imgBlob, NombreArchConId);
      this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  private postData(formData: FormData) {


    this.http
      .post(URL_ARCHIVOS, formData)
      .catch(e => this.handleError(e))
      .map(response => response.text())
      .finally(() =>  this.loading.dismiss() )
      .subscribe( ok => this.showToast(ok));
  }

  private showToast(ok: string) {
    if (ok) {
      const toast = this.toastCtrl.create({
        message: "Archivo cargado exitosamente",
        duration: 3000,
        position: "top"
      });
      toast.present();

          this.mensaje("Embarque finalizado");
          this.navCtrl.push("MisEmbarquesPage");


    } else {
      const toast = this.toastCtrl.create({
        message:
          "Se presento un error durante la carga de la imagen al servidor",
        duration: 3000,
        position: "top"
      });
      toast.present();
    }


  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.error = errMsg;
    return Observable.throw(errMsg);
  }

  //MUESTRA MENSAJES AL USUARIO
  mensaje(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {});

    toast.present();
  }

  darPorTerminadoEmbarque() {
    if (this.myPhoto == null) {
      this.mensaje(
        "Debe tomar una foto de la entrega del embarque para poder finalizarlo"
      );
    } else {
      const alert = this.alertCtrl.create({
        title: "Mensaje",
        message:
          "¿Seguro que desea notificar la entrega del embarque?, Le recuerdo que una vez notificada la entrega del embarque, ya no tendrá acceso al mismo para efectuar cambios ",
        buttons: [
          {
            text: "Cancelar",
            handler: () => {
              //this.viewctrl.dismiss();
              this.navCtrl.push("MisEmbarquesPage");
            }
          },
          {
            text: "Aceptar",
            handler: () => {
              this.uploadPhoto(this.myPhoto);
            }
          }
        ]
      });
      alert.present();
    }
  }
}
