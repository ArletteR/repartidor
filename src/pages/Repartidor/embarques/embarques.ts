import { EmbarquesProvider } from "./../../../providers/embarques/embarques";
import { UsuariosProvider } from "./../../../providers/usuarios/usuarios";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController,
  ToastController
} from "ionic-angular";

//DETECCION DE RED
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: "page-embarques",
  templateUrl: "embarques.html"
})
export class EmbarquesPage {
  existenEmbarques: boolean = false;
  embarquesObtenidos: any = [];

  connected: Subscription;
  disconnected: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private _us: UsuariosProvider,
    private _em: EmbarquesProvider,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private network: Network
  ) {
    this._us._loadStorage();


  }

  irPagMisEmbarques() {
    this.navCtrl.push("MisEmbarquesPage");
  }

  embarque() {
    //  console.log(this._us.establecimiento_id);

    let loading = this.loadingCtrl.create({
      spinner: "hide",
      content:
        "<img src='assets/img/Cargando_Samba.gif' /> <br/> Estamos actualizando la lista de embarques ..."
    });

    loading.present().then(() => {
      this._em
        .obtenerEmbarquesPorEstablecimiento(this._us.establecimiento_id)
        .subscribe(
          data => {
            this.embarquesObtenidos = this._em.embarquesExistentes;
            this.existenEmbarques = true;
            //console.log(this.embarquesObtenidos);
             loading.dismiss();
          },
          (err: Response) => {
            this.existenEmbarques == false;
             loading.dismiss();
          }
        );


    });

    // console.log(this._us.idUsuario);
  } //fin de valida usuario

  irADetalle(
    id: any,
    codigo: any,
    empresa: any,
    lugar: any,
    cp: any,
    ciudad: any,
    hora_entrega: any,
    hora_salida: any,
    archivo_foto: any
  ) {
    let modal = this.modalCtrl.create("DetalleEmbarquePage", {
      id: id,
      codigo: codigo,
      nombre: empresa,
      domicilio: lugar,
      codigoPostal: cp,
      ciudad: ciudad,
      hora_entrega: hora_entrega,
      hora_salida: hora_salida,
      archivo_foto: archivo_foto
    });
    modal.present();
    modal.onDidDismiss(() => {});
  }

  aceptarEmbarque(embarque_id: any) {
    let datos = {
      id_Embarque: embarque_id,
      id_Repartidor: this._us.idUsuario
    };

    this._em.asignarEmbarque(datos);
  }

  confirmaAccion(embarque_id: any) {
    const alert = this.alertCtrl.create({
      title: "Aceptar embarque",
      message:
        "¿Seguro que desea agregar este embarque a su lista de embarques?",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {}
        },
        {
          text: "Aceptar",
          handler: () => {
            this.aceptarEmbarque(embarque_id);

            let loading = this.loadingCtrl.create({
              content: "Estamos actualizando su lista de embarques ..."
            });

            loading.present().then(() => {
              this.navCtrl.push("MisEmbarquesPage");
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

  finalizarSesion() {

      const alert = this.alertCtrl.create({
        title: "Mensaje",
        message:
          "¿Seguro que desea salir de la aplicación? ",
        buttons: [
          {
            text: "Cancelar",
            handler: () => {  }
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


  ionViewWillEnter() {

    this._us._loadStorage();

    if (this._us.idUsuario == "") {
      this.mensaje("Error en conexión, favor de ingresar nuevamente a la aplicación");
      this.navCtrl.push("InicioSesionPage");
    } else {
      this.embarque();
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
}
