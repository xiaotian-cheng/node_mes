import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { Mongoose, createConnection, Schema, Document, model, connect, connection } from 'mongoose'
import { Observable } from "Rxjs";
import { EquipmentRoute } from "./routes/equipmentRoute";

//import * as http from "http";
import { Server, createServer } from "http";
import { ConnectionMgr } from "../opc_connection";
import { OpcRoute } from "./routes/opcRoute";

/**
 * The server.
 *
 * @class RestfulServer
 */
export class RestfulServer {

    public app: express.Application;
    private port: any;
    private httpServer: Server
    public connection: ConnectionMgr;

    /**
     * start the restful server
     *
     * @class Server
     * @method start
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public start() {
        this.httpServer = createServer(this.app);

        //listen on provided ports
        this.httpServer.listen(this.port);

        //add error handler
        this.httpServer.on("error", this.onError);

        //start listening on port
        this.httpServer.on("listening", this.onListening.bind(this));
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();
        this.port = this.normalizePort(process.env.PORT || 3000);
        this.app.set("port", this.port);

        this.connection = new ConnectionMgr("opc.tcp://127.0.0.1:49320");

        this.connectOpc()
        .concat(this.connectDb())
        .concat(this.preRoute())
        .concat(this.routes())
        .concat(this.postRoute())
        .subscribe(x => console.log("RESTful Server Initialized!"));        
    }

    private connectOpc() {
        return this.connection.Connect();
    }

    private connectDb() {
        return Observable.create(observer => {
            connect('mongodb://localhost/local', { useMongoClient: true });
            observer.complete();
        })
    }

    private preRoute() {
        return Observable.create(observer => {
            //use logger middlware
            this.app.use(logger("dev"));
            //use json form parser middlware
            this.app.use(bodyParser.json());
            //CORS on ExpressJS
            this.app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
            observer.complete();
        })
    }

    private postRoute() {
        return Observable.create(observer => {
            this.app.use(errorHandler());
            observer.complete();
        })
    }

    private routes() {
        let router: express.Router;

        return Observable.create(observer => {
            router = express.Router();

            //Route create
            EquipmentRoute.create(router);
            OpcRoute.create(router, this.connection);
            //use router middleware
            this.app.use(router);
            observer.complete();
        })
    }

    private normalizePort(val: any) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    private onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        var bind = typeof this.port === "string"
            ? "Pipe " + this.port
            : "Port " + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private onListening() {
        var addr = this.httpServer.address();
        var bind = typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr.port;
        console.log("Listening on " + bind);
    }
}