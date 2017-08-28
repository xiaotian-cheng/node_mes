import { Mongoose, Schema, Document, model } from 'mongoose'

export interface IMasterShift {
    name: String,
    shiftStart: Number,
    shiftEnd: Number,
    duration: Number
};

export interface IMasterShiftModel extends IMasterShift, Document { }

var masterShiftSchema = new Schema({
    name: String,
    shiftStart: Number,
    shiftEnd: Number,
    duration: Number
});

export var MasterShift = model<IMasterShiftModel>("master_shift", masterShiftSchema);