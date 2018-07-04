import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation} from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';

//PLUGINS
import { IonicStorageModule } from "@ionic/storage";
import { HttpModule } from "@angular/http";

//SERVICIOS
import { EmbarquesProvider } from '../providers/embarques/embarques';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { TrackProvider } from '../providers/track/track';


export var config = {
    apiKey: "AIzaSyBOenyqAkUg1FZHV_kXWmjHvbwupbCx6B4",
    authDomain: "localizacion-bb51a.firebaseapp.com",
    databaseURL: "https://localizacion-bb51a.firebaseio.com",
    projectId: "localizacion-bb51a",
    storageBucket: "localizacion-bb51a.appspot.com",
    messagingSenderId: "808811026182"
  };

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFireDatabaseModule,
    AngularFireModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmbarquesProvider,
    UsuariosProvider,
    TrackProvider
  ]
})
export class AppModule {}
