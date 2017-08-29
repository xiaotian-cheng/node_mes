import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import { MachineTabsPage } from "../../pages/machine-tabs/machine-tabs";

@Component({
  selector: 'machine-card',
  templateUrl: 'machine-card.html',
  inputs: ['machine']
})
export class MachineCardComponent {
  machine : any;
  
  constructor(public navCtrl: NavController){
  }

  get machineNameColor()
  {
    if (this.machine.currentStatus == 'Mechanical Repair') return 'red';

    if (this.machine.currentStatus == 'Setup') return 'orangered';

    if (this.machine.currentStatus == 'Production') return 'limegreen';

    if (this.machine.currentStatus == 'Electrical Repair') return 'red';

    if (this.machine.currentStatus == 'Peripheries Repair') return 'red';

    if (this.machine.currentStatus == 'Planned Maintenance') return 'red';

    if (this.machine.currentStatus == 'Waiting for new Order') return 'dimgray';

    if (this.machine.currentStatus == 'Break') return 'dimgray';

  }

  gotoMachineDetailTab(){
    let params = { machine: this.machine };

    this.navCtrl.push(MachineTabsPage,params);;

    // this.navCtrl.setRoot('MachineTabsPage', params).catch((err: any) => {
    //     console.log(`Didn't set nav root: ${err}`);
    //   });
  }
}
