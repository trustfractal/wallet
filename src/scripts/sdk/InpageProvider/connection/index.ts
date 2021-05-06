import ExtensionConnection from "@models/Connection/ExtensionConnection";
import ConnectionTypes from "@models/Connection/types";
import { extension } from "@models/Connection/params";

import callbacks from "@sdk/InpageProvider/connection/callbacks";
import { ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED } from "@sdk/InpageProvider/Errors";

class Connection {
  private static instance?: Connection;
  private connection?: ExtensionConnection;

  public static getInstance(): Connection {
    if (!Connection.instance) {
      Connection.instance = new Connection();
    }

    return Connection.instance;
  }

  public init(): ExtensionConnection {
    this.connection = new ExtensionConnection(extension);

    // register callbacks
    for (let index = 0; index < Object.keys(callbacks).length; index++) {
      const connectionType = Object.keys(callbacks)[index];
      const { callback, middlewares } = callbacks[connectionType];

      this.connection.on(connectionType, callback, middlewares);
    }

    return this.connection;
  }

  public getConnection(): ExtensionConnection {
    this.ensureConnectionIsInitialized();

    return this.connection!;
  }

  public invoke(method: ConnectionTypes, args?: any[]): any {
    return this.getConnection().invoke(method, args);
  }

  private ensureConnectionIsInitialized() {
    if (this.connection === undefined) {
      throw ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED();
    }
  }
}

const connection: Connection = Connection.getInstance();

export default connection;
