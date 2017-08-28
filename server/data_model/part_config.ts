import { Mongoose, Schema, Document, model } from 'mongoose'

export interface IPartConfig {
    name: String,
    defaultCycleTime: Number,
    partSepc: [{equipment: String, tooling: String, cycleTime: Number}]
};

export interface IPartConfigModel extends IPartConfig, Document { }

var partConfigSchema = new Schema({
    name: String,
    defaultCycleTime: Number,
    partSepc: [{equipment: String, tooling: String, cycleTime: Number}]
});

export var PartConfig = model<IPartConfigModel>("part_config", partConfigSchema);