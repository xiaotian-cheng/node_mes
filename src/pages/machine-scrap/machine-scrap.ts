import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-machine-scrap',
  templateUrl: 'machine-scrap.html',
})
export class MachineScrapPage {
  machine : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.machine = this.navParams.data.machine;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MachineScrapPage');
  }
}
