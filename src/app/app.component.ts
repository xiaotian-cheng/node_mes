import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MachineListPage } from "../pages/machine-list/machine-list";

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Machine List', icon: 'calendar', component: MachineListPage}
  ];
  rootPage: any;

  constructor(
    public events: Events,
    public menu: MenuController,
    public platform: Platform,
    public storage: Storage
  ) {
    platform.ready().then(() => {
      this.rootPage = MachineListPage;
    });
  }

  openPage(page: PageInterface) {
    let params = {};

    this.nav.setRoot(page.component, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
}

