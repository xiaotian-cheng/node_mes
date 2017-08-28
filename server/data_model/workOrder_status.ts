import { Mongoose, Schema, Document, model } from 'mongoose'

//Status:
//NEW,RUNNING,INTERUPTED,FINISHED

export interface IWorkOrderStatus {
    name: String,
    status: String,
    partNo:String,
    equipmentUsed: String,
    toolingUsed: String,
    yield: Number,
    scrap: Number,
    targetQty: Number,
    lastLoggedOn: Date
};

export interface IWorkOrderStatusModel extends IWorkOrderStatus, Document { }

var workOrderStatusSchema = new Schema({
    name: String,
    status: String,
    partNo:String,
    equipmentUsed: String,
    toolingUsed: String,
    yield: Number,
    scrap: Number,
    targetQty: Number,
    lastLoggedOn: Date
});

export var WorkOrderStatus = model<IWorkOrderStatusModel>("workorder_status", workOrderStatusSchema);