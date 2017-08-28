import { Mongoose, Schema, Document, model } from 'mongoose'

interface IEquipmentStatusHistory {
    name: String,
    workShift: String,
    afterStatus: String,
    beforeStatus: String,
    duration: Number,
    rpa: Number,
    rpaDescription: String,
    changedTimeStamp: Date
};

interface IEquipmentStatusHistoryModel extends IEquipmentStatusHistory, Document { }

var equipmentStatusHistorySchema = new Schema({
    name: String,
    workShift: String,
    afterStatus: String,
    beforeStatus: String,
    duration: Number,
    rpa: Number,
    rpaDescription: String,
    changedTimeStamp: Date
});

export var EquipmentStatusHistory = model<IEquipmentStatusHistoryModel>("equipment_status_hist", equipmentStatusHistorySchema);