import { NextFunction, Request, Response, Router } from "express";
import { EquipmentBookingHistory } from "../../data_model/equipment_booking_history";
import { EquipmentBooking } from "../../data_model/equipment_booking";
import { EquipmentStatusHistory } from "../../data_model/equipment_status_history";
import { WorkOrderStatus } from "../../data_model/workOrder_status";

import { EquipmentStatus } from "../../data_model/equipment_status";
import { EquipmentConfig } from "../../data_model/equipment_config";
import { IMasterStatusConfig, MasterStatusConfig } from "../../data_model/master_status";
import { EquipmentService } from "../business/equipmentService";

export class EquipmentRoute {
    public static create(router: Router) {
        //log
        console.log("[EquipmentRoute::create] Creating equipment route.");

        //add status route
        router.put("/equipment/:equipmentId/status", (req: Request, res: Response, next: NextFunction) => {
            EquipmentRoute.status(req, res, next);
        });

        //add equipments route
        router.get("/equipments", (req: Request, res: Response, next: NextFunction) => {
            EquipmentRoute.fetchEquipments(req, res, next);
        });
    }

    public static fetchEquipments(req: Request, res: Response, next: NextFunction) {
        EquipmentService.fetchEquipments()
            .then(eqps => {
                res.json(eqps);
            })
            .catch(err => {
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