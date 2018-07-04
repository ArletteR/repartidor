import { UsuariosProvider } from "./../../../providers/usuarios/usuarios";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
} from "ionic-angular";


import { FormGroup, FormBuilder, Validators } from "@angular/forms";

//DETECCION DE RED
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: "page-valida-acceso",
  templateUrl: "valida-acceso.html"
})
export class ValidaAccesoPage {
  user: FormGroup;

  connected: Subscription;
  disconnected: Subscription;

  errorObtenido: number = -1;

  nombreUsuario: string = "";
  contadorEquivocaciones: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _us: UsuariosProvider,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private network: Network,
    private toast: ToastController
  ) {
    this.user = this.fb.group({
      password: ["", [Validators.required, Validators.maxLength(12)]]
    });

    this.nombreUsuario = this._us.nombre;

    const nameControl = this.user.get("password");
    nameControl.valueChanges.forEach(() => {
      if (this.errorObtenido >= 0) {
        this.errorObtenido = -1;
      }
    });
  }

  //VA A LA SECCION EN DONDE SE MUESTRAN LOS EMBARQUES
  goToEmbarques() {
    if (this._us.usuario_validado == 1) {
      if (this._us.password_plain == this.user.value.password) {
        this.navCtrl.push("EmbarquesPage");
      } else {
        this.errorObtenido = 0;
        this.contadorEquivocaciones = this.contadorEquivocaciones + 1;

        if (this.contadorEquivocaciones > 3) {
          this.mensajes(
            "Parece que olvidaste tu contraseña, puedes restablecerla aquí"
          );
          this.contadorEquivocaciones = 0;
        }
      }
    } else {
      this.errorObtenido = 1;
    }
  } //PASA A LA PÁGINA DE TABS

  //VALIDA SI EL CONTROL, EN ESTE CASO LOS VALORES INGRESADOS EN EL CAMPO SON VALIDOS
  isInvalidControl(name: string) {
	if(this.user.value.password == ""){
		return false;
	}else{
		return this.user.get(name).invalid && this.user.get(name).dirty;
	}   
  }

  //RECUPERAR CONTRASEÑA
  irARecuperaPassword() {
    let modal = this.modalCtrl.create("TerminosCondicionesPage", {
      correo: this._us.username,
      clave: this._us.password_plain
    });
    modal.present();

    modal.onDidDismiss(parametros => {
       this._us._loadStorage();
    });
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
    //let networkType = this.network.type;
    this.toast
      .create({
        //message: `You are now ${connectionState} via ${networkType}`,
        message: connectionState,
        duration: 3000,
        position: "top"
      })
      .present();
  }

  mensajes(mensajeAyuda: string) {
    //let networkType = this.network.type;
    this.toast
      .create({
        //message: `You are now ${connectionState} via ${networkType}`,
        message: mensajeAyuda,
        duration: 5000,
        position: "bottom"
      })
      .present();
  }

  //REGRESA A LA PÁGINA DE LOGIN
  goBack = "InicioSesionPage";

  //OCULTA Y/O MUESTRA CONTRASEÑA
  type = "password";
  showPass = false;

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }
}
