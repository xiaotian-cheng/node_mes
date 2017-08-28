import { Mongoose, Schema, Document, model } from 'mongoose'

export interface IMasterStatusConfig {
    name: String,
    statusId: Number,
    rpa: Number,
    rpaDescription: String
};

export interface IMasterStatusConfigModel extends IMasterStatusConfig, Document { }

var masterStatusSchema = new Schema({
    name: String,
    statusId: Number,
    rpa: Number,
    rpaDescription: String
});

export var MasterStatusConfig = model<IMasterStatusConfigModel>("master_status", masterStatusSchema);