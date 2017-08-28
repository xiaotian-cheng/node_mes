import { Mongoose, Schema, Document, model } from 'mongoose'

export interface IEquipmentConfig {
    name: String,
    yieldCounter: String,
    scrapCounter: String,
    initYield: number,
    initScrap: number,
    statusSignal: [{ status: String, signal: String }]
};

export interface IEquipmentConfigModel extends IEquipmentConfig, Document { }

var equipmentConfigSchema = new Schema({
    name: String,
    yieldCounter: String,
    scrapCounter: String,
    initYield: Number,
    initScrap: Number,
    statusSignal: [{ status: String, signal: String }]
});

export var EquipmentConfig = model<IEquipmentConfigModel>("equipment_config", equipmentConfigSchema);