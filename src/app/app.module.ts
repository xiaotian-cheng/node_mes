import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from "@angular/http";
import { MachineScrapPage } from "../pages/machine-scrap/machine-scrap";
import { MachineOeePage } from "../pages/machine-oee/machine-oee";
import { MachineServiceProvider } from '../providers/machine-service';
import { MachineListPage } from "../pages/machine-list/machine-list";
import { MachineCardComponent } from "../components/machine-card/machine-card";
import { MachineTabsPage } from "../pages/machine-tabs/machine-tabs";

@NgModule({
  declarations: [
    MyApp,
    MachineOeePage,
    MachineScrapPage,
    MachineListPage,
    MachineCardComponent,
    MachineTabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{}),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MachineOeePage,
    MachineScrapPage,
    MachineListPage,
    MachineTabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MachineServiceProvider
  ]
})
export class AppModule {}
