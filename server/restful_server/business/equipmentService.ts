import { MasterStatusConfig } from "../../data_model/master_status";
import { EquipmentConfig } from "../../data_model/equipment_config";
import { EquipmentStatus } from "../../data_model/equipment_status";
import { EquipmentStatusHistory } from "../../data_model/equipment_status_history";
import { EquipmentBooking } from "../../data_model/equipment_booking";

export class EquipmentService {
    public static changeStatus(eqpId : string, newStatusName : string) : Promise<any> {
        let timeStamp: any = new Date();

        let eqpConfig;
        let eqpCurrentStatus;
        let eqpBeforeStatusMaster;

        return MasterStatusConfig.findOne({ name: newStatusName }).exec()
            .then(ret => {
                if (ret == null) throw new Error("Status " + newStatusName + " not exist");
                return EquipmentConfig.findOne({ name: eqpId }).exec();
            })
            .then(ret => {
                if (ret == null) throw new Error(eqpId + " not exist");
                eqpConfig = ret;
                return EquipmentStatus.findOne({ name: eqpId }).exec();
            })
            .then(ret => {
                if (ret == null) throw new Error(eqpId + " has no status");
                eqpCurrentStatus = ret;

                return MasterStatusConfig.findOne({ name: eqpCurrentStatus.currentStatus }).exec();
            })
            .then(ret => {
                if (ret == null) throw new Error(eqpCurrentStatus.currentStatus + " not exist");
                eqpBeforeStatusMaster = ret;

                //1. Update equipment_status
                let beforeStatusName = eqpCurrentStatus.currentStatus;
                let beforeTimeStamp: any = eqpCurrentStatus.lastChangedSince;
                if (beforeStatusName === newStatusName) {
                    return;
                }

                eqpCurrentStatus.workShift = "Day Shift";
                eqpCurrentStatus.currentStatus = newStatusName;
                eqpCurrentStatus.lastChangedSince = timeStamp;
                eqpCurrentStatus.save();

                //2. Insert equipment_status_history
                let statusHist = new EquipmentStatusHistory();
                statusHist.name = eqpId;
                statusHist.workShift = "Day Shift";
                statusHist.afterStatus = newStatusName;
                statusHist.beforeStatus = beforeStatusName;
                statusHist.rpa = eqpBeforeStatusMaster.rpa;
                statusHist.rpaDescription = eqpBeforeStatusMaster.rpaDescription;
                statusHist.changedTimeStamp = timeStamp;
                statusHist.duration = ((timeStamp - beforeTimeStamp) / 1000);
                statusHist.save();
            });
    }

    public static fetchEquipments() : Promise<any> {
        let results = [];
        let eqpNames = [];
        //1. Find equipment_status
        return EquipmentStatus.find().exec()
            .then(eqps => {
                eqps.forEach(eqp => {
                    var ret = {
                        name: eqp.name,
                        currentStatus: eqp.currentStatus,
                        currentShift: eqp.workShift,
                        shiftYield: 0,
                        shiftScrap: 0,
                        currentOrder: ''
                    };
                    results.push(ret);
                    eqpNames.push(eqp.name);
                });
                return EquipmentBooking.find({ name: { $in: eqpNames } }).exec();
            })
            //2. Find equipment_bookings
            .then(bookings => {
                results.forEach(result => {
                    bookings.forEach(booking => {
                        if (result.name == booking.name) {
                            result.shiftYield = booking.currentYield;
                            result.shiftScrap = booking.currentScrap;
                            result.currentOrder = booking.workOrder;
                        }
                    });
                });

                return results;
            });
    }
}
