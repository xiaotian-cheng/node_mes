import { Mongoose,createConnection, Document, model } from 'mongoose'
import { EquipmentBookingHistory } from "../data_model/equipment_booking_history";
import { EquipmentBooking } from "../data_model/equipment_booking";
import { EquipmentStatusHistory } from "../data_model/equipment_status_history";
import { EquipmentStatus } from "../data_model/equipment_status";
import { EquipmentConfig, IEquipmentConfigModel } from "../data_model/equipment_config";
import { PartConfig, IPartConfigModel } from "../data_model/part_config";
import { WorkOrderStatus, IWorkOrderStatusModel } from "../data_model/workOrder_status";
import { Observable } from "Rxjs";
import { MasterStatusConfig } from "../data_model/master_status";
import { MasterShift } from "../data_model/master_shift";

function createStatusMaster(): Promise<any> {
    //Production: rpa = 1
    let run = new MasterStatusConfig();
    run.statusId = 200;
    run.name = "Production";
    run.rpa = 1;
    run.rpaDescription = "Production";

    //Non-Planned Downtime: rpa = 2
    let repairMechanical = new MasterStatusConfig();
    repairMechanical.statusId = 301;
    repairMechanical.name = "Mechanical Repair";
    repairMechanical.rpa = 2;
    repairMechanical.rpaDescription = "Non-Planned Downtime";

    let repairElectrical = new MasterStatusConfig();
    repairElectrical.statusId = 302;
    repairElectrical.name = "Electrical Repair";
    repairElectrical.rpa = 2;
    repairElectrical.rpaDescription = "Non-Planned Downtime";

    let repairPeripheries = new MasterStatusConfig();
    repairPeripheries.statusId = 303;
    repairPeripheries.name = "Peripheries Repair";
    repairPeripheries.rpa = 2;
    repairPeripheries.rpaDescription = "Non-Planned Downtime";

	let setup = new MasterStatusConfig();
    setup.statusId = 100;
    setup.name = "Setup";
    setup.rpa = 2;
    setup.rpaDescription = "Setup";
	
    //Planned Downtime: rpa = 3
    let plannedMaintenance = new MasterStatusConfig();
    plannedMaintenance.statusId = 311;
    plannedMaintenance.name = "Planned Maintenance";
    plannedMaintenance.rpa = 3;
    plannedMaintenance.rpaDescription = "Planned Downtime";

    let waitingOrder = new MasterStatusConfig();
    waitingOrder.statusId = 312;
    waitingOrder.name = "Waiting for new Order";
    waitingOrder.rpa = 3;
    waitingOrder.rpaDescription = "Planned Downtime";

    let breaking = new MasterStatusConfig();
    breaking.statusId = 313;
    breaking.name = "Break";
    breaking.rpa = 3;
    breaking.rpaDescription = "Planned Downtime";

    return MasterStatusConfig.insertMany([run,setup, repairMechanical, repairElectrical,repairPeripheries,plannedMaintenance,waitingOrder,breaking]);
}

function createShiftMaster(): Promise<any>{
    let day = new MasterShift();
    day.name = "Day Shift";
    day.shiftStart = 28800;
    day.shiftEnd = 720000;
    day.duration = 43200;

    let night = new MasterShift();
    night.name = "Night Shift";
    night.shiftStart = 720000;
    night.shiftEnd = 28800;
    night.duration = 43200;
    
    return MasterShift.insertMany([day, night]);
}

function createEquipmentConfig(): Promise<any> {
    var m100 = new EquipmentConfig();
    m100.name = 'M100';
    m100.yieldCounter = 'ns=2;s=Simulator.Device1.M100-Good';
    m100.scrapCounter = 'ns=2;s=Simulator.Device1.M100-Bad';
    m100.statusSignal.push({ status: "Production", signal: "ns=2;s=Simulator.Device1.M100-S-RUNNING" });
    m100.statusSignal.push({ status: "Mechanical Repair", signal: "ns=2;s=Simulator.Device1.M100-S-ERROR-001" });
    m100.statusSignal.push({ status: "Electrical Repair", signal: "ns=2;s=Simulator.Device1.M100-S-ERROR-002" });
    m100.statusSignal.push({ status: "Peripheries Repair", signal: "ns=2;s=Simulator.Device1.M100-S-ERROR-003" });

    var m101 = new EquipmentConfig();
    m101.name = 'M101';
    m101.yieldCounter = 'ns=2;s=Simulator.Device1.M101-Good';
    m101.scrapCounter = 'ns=2;s=Simulator.Device1.M101-Bad';
    m101.statusSignal.push({ status: "Production", signal: "ns=2;s=Simulator.Device1.M101-S-RUNNING" });
    m101.statusSignal.push({ status: "Mechanical Repair", signal: "ns=2;s=Simulator.Device1.M101-S-ERROR-001" });
    m101.statusSignal.push({ status: "Electrical Repair", signal: "ns=2;s=Simulator.Device1.M101-S-ERROR-002" });
    m101.statusSignal.push({ status: "Peripheries Repair", signal: "ns=2;s=Simulator.Device1.M101-S-ERROR-003" });

    var m102 = new EquipmentConfig();
    m102.name = 'M102';
    m102.yieldCounter = 'ns=2;s=Simulator.Device1.M102-Good';
    m102.scrapCounter = 'ns=2;s=Simulator.Device1.M102-Bad';
    m102.statusSignal.push({ status: "Production", signal: "ns=2;s=Simulator.Device1.M102-S-RUNNING" });
    m102.statusSignal.push({ status: "Mechanical Repair", signal: "ns=2;s=Simulator.Device1.M102-S-ERROR-001" });
    m102.statusSignal.push({ status: "Electrical Repair", signal: "ns=2;s=Simulator.Device1.M102-S-ERROR-002" });
    m102.statusSignal.push({ status: "Peripheries Repair", signal: "ns=2;s=Simulator.Device1.M102-S-ERROR-003" });

    return EquipmentConfig.insertMany([m100, m101, m102]);
}

function createEquipmentStatus(): Promise<any> {
    var m100 = new EquipmentStatus();
    m100.name = 'M100';
    m100.workShift = "Day Shift";
    m100.currentStatus = 'Waiting for new Order';
    m100.lastChangedSince = new Date();

    var m101 = new EquipmentStatus();
    m101.name = 'M101';
    m101.workShift = "Day Shift";
    m101.currentStatus = 'Waiting for new Order';
    m101.lastChangedSince = new Date();

    var m102 = new EquipmentStatus();
    m102.name = 'M102';
    m102.workShift = "Day Shift";
    m102.currentStatus = 'Waiting for new Order';
    m102.lastChangedSince = new Date();

    return EquipmentStatus.insertMany([m100, m101, m102]);
}

function createPartConfig(): Promise<any> {
    var part01 = new PartConfig();
    part01.name = 'Part01';
    part01.defaultCycleTime = 5;
    part01.partSepc.push({ equipment: 'M100', tooling: 'Tooling1', cycleTime: 5 });
    part01.partSepc.push({ equipment: 'M101', tooling: 'Tooling1', cycleTime: 15 });
    part01.partSepc.push({ equipment: 'M102', tooling: 'Tooling1', cycleTime: 7 });

    var part02 = new PartConfig();
    part02.name = 'Part02';
    part02.defaultCycleTime = 9;
    part02.partSepc.push({ equipment: 'M100', tooling: 'Tooling1', cycleTime: 25 });
    part02.partSepc.push({ equipment: 'M101', tooling: 'Tooling1', cycleTime: 9 });
    part02.partSepc.push({ equipment: 'M102', tooling: 'Tooling1', cycleTime: 9 });

    var part03 = new PartConfig();
    part03.name = 'Part03';
    part03.defaultCycleTime = 1;
    part03.partSepc.push({ equipment: 'M100', tooling: 'Tooling1', cycleTime: 1 });
    part03.partSepc.push({ equipment: 'M101', tooling: 'Tooling1', cycleTime: 3 });
    part03.partSepc.push({ equipment: 'M102', tooling: 'Tooling1', cycleTime: 4 });

    return PartConfig.insertMany([part01, part02, part03]);
}

function createOrderStatus(): Promise<any> {
    var workOrder01 = new WorkOrderStatus();
    workOrder01.name = "WO001";
    workOrder01.status = "NEW";
    workOrder01.targetQty = 1000;
    workOrder01.partNo = "Part01";
    workOrder01.yield = 0;
    workOrder01.scrap = 0;

    var workOrder02 = new WorkOrderStatus();
    workOrder02.name = "WO002";
    workOrder02.status = "NEW";
    workOrder02.targetQty = 5000;
    workOrder02.partNo = "Part02";
    workOrder02.yield = 0;
    workOrder02.scrap = 0;

    var workOrder03 = new WorkOrderStatus();
    workOrder03.name = "WO003";
    workOrder03.status = "NEW";
    workOrder03.targetQty = 8000;
    workOrder03.partNo = "Part03";
    workOrder03.yield = 0;
    workOrder03.scrap = 0;

    return WorkOrderStatus.insertMany([workOrder01, workOrder02, workOrder03]);
}

function initializeData() : Promise<any> {
    let inits : Array<any> = new Array<any>();
    let date : Date = new Date();

    //1. Logon WorkOrder to machine (WO001->M100, WO002->M101, WO003->M102)
    inits.push(WorkOrderStatus.findOneAndUpdate({name: 'WO001'},
        {$set: {status: "RUNNING",equipmentUsed: 'M100', lastLoggedOn: date}},{new: true}).exec());
    inits.push(WorkOrderStatus.findOneAndUpdate({name: 'WO002'},
        {$set: {status: "RUNNING",equipmentUsed: 'M101', lastLoggedOn: date}},{new: true}).exec());
    inits.push(WorkOrderStatus.findOneAndUpdate({name: 'WO003'},
        {$set: {status: "RUNNING",equipmentUsed: 'M102', lastLoggedOn: date}},{new: true}).exec());
    
    //2. Add new Equipment Booking record
    let booking1 = new EquipmentBooking();
    booking1.name = 'M100';
    booking1.workShift = "Day Shift";
    booking1.workOrder = 'WO001';
    booking1.workPart = 'Part01';
    booking1.currentYield = booking1.currentScrap = 0;
    booking1.lastChangedSince = date;

    let booking2 = new EquipmentBooking();
    booking2.name = 'M101';
    booking2.workShift = "Day Shift";
    booking2.workOrder = 'WO002';
    booking2.workPart = 'Part02';
    booking2.currentYield = booking2.currentScrap = 0;
    booking2.lastChangedSince = date;
   
    let booking3 = new EquipmentBooking();
    booking3.name = 'M102';
    booking3.workShift = "Day Shift";
    booking3.workOrder = 'WO003';
    booking3.workPart = 'Part03';
    booking3.currentYield = booking3.currentScrap = 0;
    booking3.lastChangedSince = date;
   
    //2. Change Equipment Status to Setup
    inits.push(EquipmentStatus.findOneAndUpdate({name: 'M100'},
        {$set: {currentStatus: "Setup", lastChangedSince: date}},{new: true}).exec());
    inits.push(EquipmentStatus.findOneAndUpdate({name: 'M101'},
        {$set: {currentStatus: "Setup", lastChangedSince: date}},{new: true}).exec());
    inits.push(EquipmentStatus.findOneAndUpdate({name: 'M102'},
        {$set: {currentStatus: "Setup", lastChangedSince: date}},{new: true}).exec());

    inits.push(EquipmentBooking.insertMany([booking1,booking2,booking3]));

    return Promise.all(inits);
}

export function server_data_prepare(): Observable<void | {}> {
    return Observable.defer<void>(() => { return MasterStatusConfig.remove({}).exec(); }) 
    .concatMap(x => Observable.defer<void>(() => { return createStatusMaster(); }))
        .concatMap(x => Observable.defer<void>(() => { return MasterShift.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return createShiftMaster(); }))  
        .concatMap(x => Observable.defer<void>(() => { return EquipmentConfig.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return createEquipmentConfig(); }))
        .concatMap(x => Observable.defer<void>(() => { return EquipmentStatus.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return createEquipmentStatus(); }))
        .concatMap(x => Observable.defer<void>(() => { return EquipmentStatusHistory.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return EquipmentBooking.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return EquipmentBookingHistory.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return PartConfig.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return createPartConfig(); }))
        .concatMap(x => Observable.defer<void>(() => { return WorkOrderStatus.remove({}).exec(); }))
        .concatMap(x => Observable.defer<void>(() => { return createOrderStatus(); }))
        .concatMap(x => Observable.defer<void>(() => { return initializeData(); }))
        .map(x => {
            console.log("(Prepare Data) successfully !");
        })
        .catch((err) => {
            throw Error("(Prepare Data) error: " + err);
        });
}

