import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import  * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBOenyqAkUg1FZHV_kXWmjHvbwupbCx6B4",
  authDomain: "localizacion-bb51a.firebaseapp.com",
  databaseURL: "https://localizacion-bb51a.firebaseio.com",
  projectId: "localizacion-bb51a",
  storageBucket: "localizacion-bb51a.appspot.com",
  messagingSenderId: "808811026182"
};


@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = "InicioSesionPage";
  //rootPage: any = "ModalCamaraPage";

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
