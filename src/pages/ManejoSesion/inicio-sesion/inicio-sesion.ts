import { UsuariosProvider } from './../../../providers/usuarios/usuarios';
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";

import { FormGroup, FormBuilder } from "@angular/forms";

import { EmailValidator } from "./../../../validators/email";

//DETECCION DE RED
import { Network } from "@ionic-native/network";
import { Subscription } from "rxjs/Subscription";

@IonicPage()
@Component({
  selector: "page-inicio-sesion",
  templateUrl: "inicio-sesion.html"
})
export class InicioSesionPage {
  user: FormGroup;

  connected: Subscription;
  disconnected: Subscription;

  errorObtenido: number = -1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _us: UsuariosProvider,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    private network: Network,
    private toast: ToastController
  ) {

    this._us._removeStorage();
    this.user = this.fb.group({ email: ["", [EmailValidator.isValid]] });

    const nameControl = this.user.get("email");
    nameControl.valueChanges.forEach(() => {
      if (this.errorObtenido >= 0) {
        this.errorObtenido = -1;
      }
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
     this.toast
      .create({
        message: connectionState,
        duration: 3000,
        position: "top"
      })
      .present();
  }

  //VALIDA SI EL CONTROL, EN ESTE CASO LOS VALORES INGRESADOS EN EL CAMPO SON VALIDOS
  isInvalidControl(name: string) {
	if(this.user.value.email == ""){
		return false;
	}else{
		return this.user.get(name).invalid && this.user.get(name).dirty;
	}
  }

  consultaUsuario() {
    let loading = this.loadingCtrl.create({
       spinner: "hide",
      content: "<img src='assets/img/Cargando_Samba.gif' /> <br/> Espere mientras verificamos su cuenta  .... "

    });

    loading.present().then(() => {
      this.validUser();
      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    });
  }

  validUser() {



	this._us.validaIngreso(this.user.value.email).subscribe(
      data => {

       
	    if (this._us.usuario_validado == 1) {
              this.navCtrl.push('ValidaAccesoPage');
			  }else{
          if (this._us.usuario_validado == 4) {
            this.errorObtenido = 4;
          }

        }
      },
      (err: Response) => {
        this.errorObtenido = 2;
      }
    );


  } //fin de valida usuario
}
