import { NextFunction, Request, Response, Router } from "express";
import { EquipmentBookingHistory } from "../../data_model/equipment_booking_history";
import { EquipmentBooking } from "../../data_model/equipment_booking";
import { EquipmentStatusHistory } from "../../data_model/equipment_status_history";
import { WorkOrderStatus } from "../../data_model/workOrder_status";

import { EquipmentStatus } from "../../data_model/equipment_status";
import { EquipmentConfig } from "../../data_model/equipment_config";
import { IMasterStatusConfig, MasterStatusConfig } from "../../data_model/master_status";
import { EquipmentService } from "../business/equipmentService";
import { ConnectionMgr } from "../../opc_connection";
import { Variant, DataType } from "node-opcua";

export class OpcRoute {
    private static connection: ConnectionMgr;

    public static create(router: Router, connection: ConnectionMgr) {
        OpcRoute.connection = connection;

        //log
        console.log("[OpcRoute::create] Creating opc route.");

        //add write route
        router.put("/opc/write", (req: Request, res: Response, next: NextFunction) => {
            OpcRoute.writeValue(req, res, next);
        });
    }

    public static writeValue(req: Request, res: Response, next: NextFunction) {
        let nodeId = req.body.nodeId;
        let value = req.body.newValue;

        OpcRoute.connection.WriteValue(nodeId, new Variant({ dataType: DataType.Int32, value: value }))
            .subscribe(x => {
                res.json(true);
            }
            , err => {
                next(err);
            });
    }

    public static status(req: Request, res: Response, next: NextFunction) {
        let eqpId = req.params.equipmentId;
        let newStatusName = req.body.newStatus;

        EquipmentService.changeStatus(eqpId, newStatusName)
            .then(() => {
                res.json(true);
            })
            .catch(err => {
                next(err);
            });
    }
}