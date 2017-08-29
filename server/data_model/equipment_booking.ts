import { Mongoose, Schema, Document, model } from 'mongoose'

interface IEquipmentBooking {
    name: String,
    workShift: String,
    workOrder: String,
    workPart: String,
    currentYield: Number,
    currentScrap: Number,
    lastChangedSince: Date
};

export interface IEquipmentBookingModel extends IEquipmentBooking, Document { }

var equipmentBookingSchema = new Schema({
    name: String,
    workShift: String,
    workOrder: String,
    workPart: String,
    currentYield: Number,
    currentScrap: Number,
    lastChangedSince: Date
});

export var EquipmentBooking = model<IEquipmentBookingModel>("equipment_booking", equipmentBookingSchema);