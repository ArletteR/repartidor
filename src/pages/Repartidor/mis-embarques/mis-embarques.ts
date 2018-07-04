import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ToastController,
  LoadingController
} from "ionic-angular";

import { EmbarquesProvider } from "./../../../providers/embarques/embarques";
import { UsuariosProvider } from "./../../../providers/usuarios/usuarios";

//DETECCION DE RED
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: "page-mis-embarques",
  templateUrl: "mis-embarques.html"
})
export class MisEmbarquesPage {
  existenEmbarques: boolean = false;
  embarquesObtenidos: any = [];
  mensajeatraso: string = "";

  connected: Subscription;
  disconnected: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _us: UsuariosProvider,
    private _em: EmbarquesProvider,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private network: Network
  ) {


  }

  irPagEmbarques() {
    this.navCtrl.push("EmbarquesPage");
  }

  misEmbarques() {
    //  console.log(this._us.establecimiento_id);

    let loading = this.loadingCtrl.create({
      spinner: "hide",
      content:
        "<img src='assets/img/Cargando_Samba.gif' /> <br/> Estamos actualizando su lista de embarques ..."
    });

    loading.present().then(() => {
      this._em
        .obtenerMisEmbarquesPorEstablecimiento(this._us.idUsuario)
        .subscribe(
          data => {
            this.embarquesObtenidos = this._em.misEmbarquesExistentes;
            this.existenEmbarques = true;
             loading.dismiss();
          },
          (err: Response) => {
            this.existenEmbarques == false;
             loading.dismiss();
          }
        );


    });
  } //fin de valida usuario

  //FINALIZACION DEL EMBARQUE
  //Si hay que hacer cambios esta es la función con la que hay que trabajar
  finalizarEmbarque(embarque_id: any) {
    //this._em.entregarEmbarque(datos);
    //this.tomarFoto(embarque_id);
    //this.mensaje("Embarque entregado");

    const alert = this.alertCtrl.create({
      title: "Mensaje",
      message:
        "Para finalizar el embarque, deberá tomar una foto para verificar que los productos han sido entregados ",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {}
        },
        {
          text: "Aceptar",
          handler: () => {
            this.navCtrl.push("ModalCamaraPage", {
              id_embarque: embarque_id,
              id_Repartidor: this._us.idUsuario
            });
          }
        }
      ]
    });
    alert.present();
  }

  //QUITA EL EMBARQUE DE MI LISTA DE EMBARQUES
  desasignarEmbarque(embarque_id: any) {
    let datos = {
      id_Embarque: embarque_id,
      id_Repartidor: this._us.idUsuario
    };

    this._em.desasignarEmbarque(datos);
  }

  //METODO QUE SE ENCARGA DE MOSTRAR EL MODAL CON LA CARATULA DE RELOJ
  //UNA VEZ SELECCIONADO EL TIEMPO, LO MUESTRA EN A UN LADO DEL ICONO DEL RELOJ Y
  //MANDA UN MENSAJE
  notificarRetraso(embarque_id: any) {
    let modal = this.modalCtrl.create("ModalRelojPage", {
      id_embarque: embarque_id
    });
    modal.present();

    modal.onDidDismiss(retraso => {
      if (retraso != "") {
        this.mensajeatraso = "+" + retraso + " min";

        let datos = { id_Embarque: embarque_id, demora: retraso };
        this._em.demoraEmbarque(datos);
        this.mensaje("Demora reportada");
        this._us._loadStorage();
      }
    });
  }

  //PRESENTA UN MENSAJE DE ALERTA ADVIRTIENDO AL USUARIO QUE EL EMBARQUE SELECCIONADO SE REGRESARA
  //A LA LISTA DE EMBARQUES
  confirmaAccion(embarque_id: any) {
    const alert = this.alertCtrl.create({
      title: "Mensaje",
      message:
        "¿Seguro que desea quitar este embarque de su lista de embarques ?",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {}
        },
        {
          text: "Aceptar",
          handler: () => {
            this.desasignarEmbarque(embarque_id);

            let loading = this.loadingCtrl.create({
              content: "Estamos actualizando su lista de embarques ..."
            });

            loading.present().then(() => {
              this.navCtrl.push("EmbarquesPage");
              setTimeout(() => {
                loading.dismiss();
              }, 1000);
            });
          }
        }
      ]
    });
    alert.present();
  }

  /*
  //MUESTRA MODAL PARA TOMAR LA FOTO, RECUPERA EL NOMBRE DE LA IMAGEN Y LO GUARDA EN LA BD
  tomarFoto(embarque_id: any) {
    let modal = this.modalCtrl.create("ModalCamaraPage", {
      id_embarque: embarque_id
    });

    modal.present();

    modal.onDidDismiss(foto => {
      if (foto != "") {
        let datos = { id_Embarque: embarque_id, foto: foto };

        this._em.fotoEmbarque(datos);
        this.mensaje("Evidencia de entrega de embarque registrada");
        this._us._loadStorage();
      }
    });
  }
*/
  //MUESTRA MENSAJES AL USUARIO
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



  finalizarSesion() {
    const alert = this.alertCtrl.create({
      title: "Mensaje",
      message: "¿Seguro que desea salir de la aplicación? ",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {}
        },
        {
          text: "Aceptar",
          handler: () => {
            this._us._removeStorage();
            this._em.embarquesExistentes = [];
            this._em.misEmbarquesExistentes = [];
            this._em.detalleEmbarque = [];
            this.navCtrl.push("InicioSesionPage");
          }
        }
      ]
    });
    alert.present();
  }


  ionViewWillEnter() {

    this._us._loadStorage();

    if (this._us.idUsuario == "") {
      this.mensaje("Error en conexión, favor de ingresar nuevamente a la aplicación");
      this.navCtrl.push("InicioSesionPage");
    } else {
      this.misEmbarques();
    }

  }

  ionViewDidEnter() {

    this.connected = this.network.onConnect().subscribe(
      data => {
        //En caso de que la conexión es exitosa, algún mensaje se puede enviar
        //this.displayNetworkUpdate("data.type");
      },
      error => {
        this.displayNetworkUpdate(
          "Algo se encuentra mal con su conexión. Volver a cargar"
        );
      }
    );

    this.disconnected = this.network.onDisconnect().subscribe(
      data => {
        //En caso de que la conexión es exitosa, algún mensaje se puede enviar
        //console.log(data)
        //this.displayNetworkUpdate(data.type);
      },
      error => {
        this.displayNetworkUpdate(
          "Algo se encuentra mal con su conexión. Volver a cargar"
        );
      }
    );
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  displayNetworkUpdate(connectionState: string) {
    this.toastCtrl
      .create({ message: connectionState, duration: 3000, position: "top" })
      .present();
  }

  soloAvisaNoRegreso() {
    const alert = this.alertCtrl.create({
      title: "Mensaje",
      message:
        "Este embarque tiene una demora registrada, no puede regresarlo a la lista de embarques",
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
