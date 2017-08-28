/**
import { OpcClient } from "./";
 * The server.
 *
 * @class Server
 */
import { OpcClient } from "./opc_client/opc_client";
import { RestfulServer } from "./restful_server/restful_server";

class Application_Server {
     /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return
     */
    public static bootstrap() {
        //1. Initialize and start OPC Client
        new OpcClient().start();
        //2. Initialize and start RESTful Server
        new RestfulServer().start();
    }
}

Application_Server.bootstrap();