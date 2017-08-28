import { Mongoose, Schema, Document, model } from 'mongoose'

interface IEquipmentBookingHistory {
    name: String,
    bookingType: String,
    workShift: String,
    workOrder: String,
    workPart: String,
    yield: Number,
    scrap: Number,
    duration: Number,
    createTimeStamp: Date
};

interface IEquipmentBookingHistoryModel extends IEquipmentBookingHistory, Document { }

var equipmentBookingHistorySchema = new Schema({
    name: String,
    bookingType: String,
    workShift: String,
    workOrder: String,
    workPart: String,
    yield: Number,
    scrap: Number,
    duration: Number,
    createTimeStamp: Date
});

export var EquipmentBookingHistory = model<IEquipmentBookingHistoryModel>("equipment_booking_hist", equipmentBookingHistorySchema);