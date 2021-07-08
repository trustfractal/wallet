import { IConnectionStatus, ISerializable } from "@pluginTypes/index";

export default class ConnectionStatus
  implements IConnectionStatus, ISerializable
{
  public version: string;
  public registered: boolean;
  public locked: boolean;
  public setup: boolean;

  public constructor(
    version: string,
    registered: boolean,
    locked: boolean,
    setup: boolean,
  ) {
    this.version = version;
    this.registered = registered;
    this.locked = locked;
    this.setup = setup;
  }

  public serialize(): string {
    return JSON.stringify({
      version: this.version,
      registered: this.registered,
      locked: this.locked,
      setup: this.setup,
    });
  }

  public static parse(str: string): ConnectionStatus {
    const { version, registered, locked, setup } = JSON.parse(str);

    return new ConnectionStatus(version, registered, locked, setup);
  }
}
