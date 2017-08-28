import { server_data_prepare } from "./data_prepare";
import { ConnectionMgr, DataContext } from "../opc_connection";
import { IEquipmentConfig, EquipmentConfig } from "../data_model/equipment_config";
import { IPartConfig, PartConfig } from "../data_model/part_config";
import { IMasterStatusConfig, MasterStatusConfig } from "../data_model/master_status";
import { DataValue } from "node-opcua/node-opcua";
import { Observable } from "Rxjs";
import * as request from "request";
import { connect,connection } from 'mongoose'

export class OpcClient {
    private PORT : number = 3000;
    private CYCLE: number = 3000;
    private connection: ConnectionMgr;
    private equipmentCache: Map<String, IEquipmentConfig>;
    private partCache: Map<String, IPartConfig>;
    private statusCache : Map<String, IMasterStatusConfig>;

    private equipmentStatusChange: Observable<DataContext>;
    private equipmentYieldChange: Observable<DataContext>;
    private equipmentScrapChange: Observable<DataContext>;

    private webAPIHost : string ="http://localhost:" + this.PORT + "/";

    constructor() {
        this.equipmentCache = new Map<String, IEquipmentConfig>();
        this.partCache = new Map<String, IPartConfig>();
        this.statusCache = new Map<String, IMasterStatusConfig>();

        this.equipmentStatusChange = Observable.empty();
        this.equipmentYieldChange = Observable.empty();
        this.equipmentScrapChange = Observable.empty();
    }

    private equipmentStatusChanged(valueContext: DataContext): void {
        let eqp = valueContext.Tag as IEquipmentConfig;
        let nodeId = valueContext.NodeId;
        let value = valueContext.Value.value;
        let newStatus = null;

        if (!value.value) return;

        //Find out new Status
        eqp.statusSignal.forEach(pair => {
            if (pair.signal === nodeId) newStatus = pair.status;
        });

        if (newStatus != null) {
            let object = { newStatus: newStatus };
            request.put(this.webAPIHost + "equipment/" + eqp.name + "/status",
                {
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(object)
                }).on("error",err => {
                    console.log(err);
                });
        }
    }

    private equipmentYieldChanged(valueContext: DataContext): void {
        let eqp = valueContext.Tag as IEquipmentConfig;
        let nodeId = valueContext.NodeId;
        let value = valueContext.Value.value;
        let valueChanged: number;

        if (value.value >= eqp.initYield) {
            valueChanged = value.value - eqp.initYield;
        }
        else {
            valueChanged = value.value + this.CYCLE - eqp.initYield;
        }

        if (valueChanged <= 0) return;

        let object = { yield: valueChanged };
        request.put(this.webAPIHost + "equipment/" + eqp.name + "/yield",
            {
                headers: { "content-type": "application/json" },
                body: JSON.stringify(object)
            }).on("error",err => {
                    console.log(err);
                });

        eqp.initYield = value.value;
    }

    private equipmentScrapChanged(valueContext: DataContext): void {
        let eqp = valueContext.Tag as IEquipmentConfig;
        let nodeId = valueContext.NodeId;
        let value = valueContext.Value.value;
        let valueChanged: number;

        if (value.value >= eqp.initScrap) {
            valueChanged = value.value - eqp.initScrap;
        }
        else {
            valueChanged = value.value + this.CYCLE - eqp.initScrap;
        }

        if (valueChanged <= 0) return;

        let object = { scrap: valueChanged };
        request.put(this.webAPIHost + "equipment/" + eqp.name + "/scrap",
            {
                headers: { "content-type": "application/json" },
                body: JSON.stringify(object)
            }).on("error",err => {
                    console.log(err);
                });

        eqp.initScrap = value.value;
    }

    public start(): void {
        connect('mongodb://localhost/local',{useMongoClient: true});
        
        this.connection = new ConnectionMgr("opc.tcp://127.0.0.1:49320");

        //1. Prepare data
        server_data_prepare()
        //2. Connect to OPC UA
        .concatMap(x => this.connection.Connect())
        //3. Fetch Equipment into Cache
        .concatMap(x => Observable.defer(() => {
            return EquipmentConfig.find().exec().then(eqps => {
                eqps.forEach(eqp => {
                this.equipmentCache.set(eqp.name, eqp);
                });
            })
        }))
        //4. Fetch Part into Cache
        .concatMap(x => Observable.defer(() => {
            return PartConfig.find().exec().then(parts => {
                parts.forEach(part => {
                this.partCache.set(part.name, part);
                });
            })
        }))
        //5. Fetch Equipment Status into Cache
        .concatMap(x => Observable.defer(() => {
            return MasterStatusConfig.find().exec().then(statues => {
                statues.forEach(status => {
                    this.statusCache.set(status.name, status);
                });
            })
        }))
        //5. Init Yield Count
        .map(() => {
            this.equipmentCache.forEach(equipment => {
                this.connection.ReadValue(equipment.yieldCounter.toString()).subscribe(x => equipment.initYield = x.value.value);
            });
        })
        //6. Init Scrap Count
        .map(() => {
            this.equipmentCache.forEach(equipment => {
                this.connection.ReadValue(equipment.scrapCounter.toString()).subscribe(x => equipment.initScrap = x.value.value);
            });
        })
        //7. Create Observable for Status Change
        .map(() => {
            this.equipmentCache.forEach(equipment => {
                this.ObserveStatusChange(equipment);
            });
            this.equipmentStatusChange.subscribe(x => this.equipmentStatusChanged(x));
        })
        //8. Create Observable for Quantity Change
        .map(() => {
            this.equipmentCache.forEach(equipment => {
                this.ObserveOutputChange(equipment);
            });
            this.equipmentYieldChange.subscribe(x => this.equipmentYieldChanged(x));
            this.equipmentScrapChange.subscribe(x => this.equipmentScrapChanged(x));
        })
        .subscribe(x => { console.log('OPC Client Initialized successfully'); }, err => { console.log(err); process.exit(0) });
    }

    private ObserveStatusChange(eqp: IEquipmentConfig): any {
        eqp.statusSignal.forEach(signal => {
            this.equipmentStatusChange = this.equipmentStatusChange.merge(this.connection.Monitor(signal.signal.toString(), eqp));
        });
    }

    private ObserveOutputChange(eqp: IEquipmentConfig): any {
        this.equipmentYieldChange = this.equipmentYieldChange.merge(this.connection.Monitor(eqp.yieldCounter.toString(), eqp));
        this.equipmentScrapChange = this.equipmentScrapChange.merge(this.connection.Monitor(eqp.scrapCounter.toString(), eqp));
    }
}