import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

//SERVICIOS
import { EmbarquesProvider } from "./../../../providers/embarques/embarques";

@IonicPage()
@Component({
  selector: "page-detalle-embarque",
  templateUrl: "detalle-embarque.html"
})
export class DetalleEmbarquePage {
  id: string = "";
  codigo: string = "";
  nombre: string = "";
  domicilio: string = "";
  codigoPostal: string = "";
  ciudad: string = "";
  archivo_foto: string = "";
  hora_entrega: string = "";
  hora_salida: string = "";
  numprods:number = 0;
  ordenesEmbarque: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private _em: EmbarquesProvider
  ) {
    this.id = this.navParams.get("id");
    this.codigo = this.navParams.get("codigo");

    this.nombre = this.navParams.get("nombre");
    this.domicilio = this.navParams.get("domicilio");
    this.codigoPostal = this.navParams.get("codigoPostal");

    this.ciudad = this.navParams.get("ciudad");
    this.hora_entrega = this.navParams.get("hora_entrega");
    this.hora_salida = this.navParams.get("hora_salida");
    this.archivo_foto = this.navParams.get("archivo_foto");

    //console.log("modal " + this.id);
    this.detalleEmbarque(this.id);
    //this._em.obtenerDetalleEmbarque(this.id);
    //this.ordenesEmbarque = this._em.detalleEmbarque;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DetalleEmbarquePage");
  }

  cerrarModal() {
    this.viewCtrl.dismiss();
  }

  detalleEmbarque(id: string) {
    //  console.log(this._us.establecimiento_id);
    this._em.obtenerDetalleEmbarque(id).subscribe(
      data => {
        this.ordenesEmbarque = this._em.detalleEmbarque;
        this.numprods = this._em.numeroProductos;
      },
      (err: Response) => {}
    );

    // console.log(this._us.idUsuario);
  } //fin de valida usuario
}
