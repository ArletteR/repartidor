import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController
} from "ionic-angular";

/**
 * Generated class for the ModalRelojPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modal-reloj",
  templateUrl: "modal-reloj.html"
})
export class ModalRelojPage {
  tiempo: string = "";

  public minutos = [
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ];
  public minutosRetraso: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewctrl: ViewController,
    private toastCtrl: ToastController
  ) {}




  closeModal() {
    this.viewctrl.dismiss("");
  }

  minutosActuales(indice) {
    for (let i = 0; i < this.minutos.length; i++) {
      this.minutos[i] = false;
    }
    this.minutos[indice] = true;
    let valor = indice * 5;
    this.minutosRetraso = valor;
    //console.log("tiempo " + indice + " - valor:" + valor);
  }

  enviaRetraso() {
    if (this.minutosRetraso == 0 ) {
      this.mensaje("Si desea notificar un atraso, selecione el número de minutos que va atrasado");
    } else {
      this.viewctrl.dismiss(this.minutosRetraso);
    }
  }

  mensaje(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 4000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      // console.log("Dismissed toast");
    });

    toast.present();
  }
}
