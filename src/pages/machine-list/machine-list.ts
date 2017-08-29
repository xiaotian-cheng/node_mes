import { Component } from '@angular/core';
import { NavController, ActionSheetController, Config } from 'ionic-angular';
import { MachineServiceProvider } from "../../providers/machine-service";

@Component({
  selector: 'page-machine-list',
  templateUrl: 'machine-list.html'
})
export class MachineListPage {
  machines: any[] = [];
  machinesKPI: any[] = [];
  loaded : boolean = false;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public machineSvc: MachineServiceProvider,
    public config: Config
  ) { }

  ionViewDidLoad() {
    if (!this.loaded)
    {
      this.loaded = true;
      this.machineSvc.getMachines().subscribe((machines: any[]) => {
        this.machines = machines;
      });      
    }
  }
}
