import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as Rx from "rxjs/rx";
import { MachineKpi, ProducedPart } from "../utils/machine-kpi";

@Injectable()
export class MachineServiceProvider {

  constructor(public http: Http) { }

  getMachines(){
    return Rx.Observable.timer(0,10000000).switchMap((value,index) => {
      return this.http.get('http://localhost:3000/equipments');
    }).map((data: any) => {
      return data.json();
    });
  }

  getMachinesKPI(fromDateTime : Date, toDateTime : Date){
    return Rx.Observable.timer(0,1000000).switchMap((value,index) => {
      return this.http.get('assets/data/data.json');
    }).map((data: any) => {
      let tmp = data.json().machinesKPI;
      let ret = new Array<MachineKpi>();
      
      tmp.forEach(f => {
        let t = new MachineKpi();
        t.availableTime = f.availableTime;
        t.fromDateTime = f.fromDateTime;
        t.name = f.name;
        t.totalAvailableTime = f.totalAvailableTime;
        t.availableTime = f.availableTime;
        t.totalYield = f.totalYield;
        t.totalScrap = f.totalScrap;

        for (const key of Object.keys(f.planDownTime)) {
          t.planDownTime.set(key,f.planDownTime[key]);
        }

        for (const key of Object.keys(f.unPlandDownTime)) {
          t.unPlandDownTime.set(key,f.unPlandDownTime[key]);
        }

        for (const key of Object.keys(f.partProduced)) {
            let part = new ProducedPart();
            part.part = f.partProduced[key].part;
            part.produced =f.partProduced[key].produced;
            part.targetCycle = f.partProduced[key].targetCycle;
            part.workOrder = f.partProduced[key].workOrder;
            t.partProduced.set(key,part);
        }

        ret.push(t);       
      });

      return ret;
    });
  }
}
