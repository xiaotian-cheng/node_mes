import { Mongoose, Schema, Document, model } from 'mongoose'

export interface IEquipmentStatus {
    name: String,
    workShift: String,
    currentStatus: String,
    lastChangedSince: Date
};

export interface IEquipmentStatusModel extends IEquipmentStatus, Document { }

var equipmentStatusSchema = new Schema({
    name: String,
    workShift: String,
    currentStatus: String,
    lastChangedSince: Date
});

export var EquipmentStatus = model<IEquipmentStatusModel>("equipment_status", equipmentStatusSchema);