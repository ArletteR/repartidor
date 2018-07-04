import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController
} from "ionic-angular";

//Envio de correos
import { UsuariosProvider } from "./../../../providers/usuarios/usuarios";

@IonicPage()
@Component({
  selector: "page-terminos-condiciones",
  templateUrl: "terminos-condiciones.html"
})
export class TerminosCondicionesPage {
  correoUsuario: string = "";
  passwrod: string = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private usuarioCtrl: UsuariosProvider,
    private viewCtrl: ViewController,
    private toast: ToastController
  ) {
    this.correoUsuario = this.navParams.get("correo");
    this.passwrod = this.navParams.get("clave");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TerminosCondicionesPage");
  }

  cerrarModal() {
    this.viewCtrl.dismiss();
  }

  enviaCorreo() {
    console.log("envia correo ");
    this.usuarioCtrl.recuperaPassword(this.correoUsuario).subscribe(
      () => {},
      (err: Response) => {
        this.mensaje("Su contraseña ha sido enviada a su correo eléctronico");
        this.viewCtrl.dismiss();
      }
    );
  }

  mensaje(connectionState: string) {
    this.toast
      .create({
        message: connectionState,
        duration: 5000
      })
      .present();
  }
}
