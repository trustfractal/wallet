import { IVerificationCase, ISerializable } from "@pluginTypes/index";

export default class VerificationCase
  implements IVerificationCase, ISerializable
{
  public id: string;
  public clientId: string;
  public level: string;
  public status: string;

  public constructor(
    id: string,
    clientId: string,
    level: string,
    status: string,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.level = level;
    this.status = status;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      clientId: this.clientId,
      level: this.level,
      status: this.status,
    });
  }

  public static parse(str: string): IVerificationCase {
    const { id, clientId, level, status } = JSON.parse(str);

    return new VerificationCase(id, clientId, level, status);
  }
}
