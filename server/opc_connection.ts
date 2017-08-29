import { Subject, Observable } from 'Rxjs'
import { OPCUAClient, ClientSession, ClientSubscription, AttributeIds, ReadResponse, DataValue, resolveNodeId, read_service } from 'node-opcua'

export interface DataContext
{
    Value : any
    NodeId : string
    Tag : any
}

//TODO: Change Callback to Promise with Blurbird
export class ConnectionMgr {
    private the_session: ClientSession;
    private the_client: OPCUAClient;
    private the_endpointUrl: string;
    private the_subscription: ClientSubscription;

    private connect$: any;
    private createSession$: any;
    private readValue$: any;
    private writeValue$: any;

    constructor(endpointUrl: string) {
        this.the_endpointUrl = endpointUrl;

        this.the_client = new OPCUAClient({
            connectionStrategy: {
                maxRetry: 1
            }
        });
        this.the_session = new ClientSession();

        this.connect$ = Observable.bindNodeCallback(this.the_client.connect);
        this.createSession$ = Observable.bindNodeCallback(this.the_client.createSession);
        this.readValue$ = Observable.bindNodeCallback(this.the_session.readVariableValue);
        this.writeValue$ = Observable.bindNodeCallback(this.the_session.writeSingleNode);
    }

    get subscription(): ClientSubscription {
        return this.the_subscription;
    }

    public Connect(): Observable<ClientSession> {
        return this.connect$.call(this.the_client, this.the_endpointUrl)
                .concatMap(x => this.createSession$.call(this.the_client))
                .map(session => {
                    this.the_session = session as ClientSession;
                    //Create SubScription
                    this.the_subscription = new ClientSubscription(this.the_session, {
                        requestedPublishingInterval: 1000,
                        requestedLifetimeCount: 10,
                        requestedMaxKeepAliveCount: 2,
                        maxNotificationsPerPublish: 10,
                        publishingEnabled: true,
                        priority: 10
                    });
                    console.log("OPC UA Connect successfully !");
            });
    }

    public WriteValue(nodeId: string, value: any) : Observable<any> {
        if (this.the_session.hasBeenClosed()) throw Error("Not Connected yet !");
        return this.writeValue$.call(this.the_session, nodeId,value);
    }

    public ReadValue(nodeId: string | [string]): Observable<DataValue> {
        if (this.the_session.hasBeenClosed()) throw Error("Not Connected yet !");
        return this.readValue$.call(this.the_session, nodeId).map(value => {
            return value[0];
        });
    }

    public Monitor(nodeId: string, tag: any): Observable<DataContext> {
        if (this.the_session.hasBeenClosed()) throw Error("Not Connected yet !");
        if (!this.the_subscription) throw Error("Not Connected yet !");

        // install monitored item
        var monitoredItem = this.the_subscription.monitor({
            nodeId: resolveNodeId(nodeId),
            attributeId: AttributeIds.Value
            },
            {
                samplingInterval: 100,
                discardOldest: true,
                queueSize: 10
            },
            read_service.TimestampsToReturn.Neither
        );

        return Observable.fromEvent(monitoredItem, "changed").
            map(value => {return {Value: value,Tag: tag,NodeId: nodeId}});
    }

    public Disconnect(): Observable<any> {
        if (this.the_session.hasBeenClosed()) throw Error("Not Connected yet !");
        if (!this.the_subscription) throw Error("Not Connected yet !");

        var terminate$ = Observable.bindNodeCallback(this.the_subscription.terminate);
        var sessionClose$ = Observable.bindNodeCallback(this.the_session.close);
        var disconnect$ = Observable.bindNodeCallback(this.the_client.disconnect);

        return terminate$.call(this.the_subscription)
                .concatMap(x => sessionClose$.call(this.the_session))
                .concatMap(x => disconnect$.call(this.the_client))
                .map(() => {console.log("OPC UA Disconnected successfully !");});            
    }
};