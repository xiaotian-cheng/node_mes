import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { MachineOeePage } from "../machine-oee/machine-oee";
import { MachineScrapPage } from "../machine-scrap/machine-scrap";

@Component({
  templateUrl: 'machine-tabs.html'
})
export class MachineTabsPage {
  // set the root pages for each tab
  oeeRoot: any = MachineOeePage;
  scrapRoot: any = MachineScrapPage;
  mySelectedIndex: number;
  machine: any;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = 0;
    this.machine = navParams.data.machine;
  }
}
