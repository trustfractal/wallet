import { ICredential, ISerializable } from "@pluginTypes/index";
import {
  Credential as SDKCredential,
  ICredential as ISDKCredential,
} from "@trustfractal/sdk";

export default class Credential
  extends SDKCredential
  implements ICredential, ISerializable
{
  public id: string;
  public level: string;

  public constructor(credential: ISDKCredential, id: string, level: string) {
    super({
      properties: credential.properties,
      hashTree: credential.hashTree,
      rootHash: credential.rootHash,
      subjectAddress: credential.subjectAddress,
      countryOfIDIssuance: credential.countryOfIDIssuance,
      countryOfResidence: credential.countryOfResidence,
      kycType: credential.kycType,
      issuerAddress: credential.issuerAddress,
      issuerSignature: credential.issuerSignature,
    });

    this.id = id;
    this.level = level;
  }

  public serialize(): string {
    return JSON.stringify({
      properties: this.properties,
      hashTree: this.hashTree,
      rootHash: this.rootHash,
      subjectAddress: this.subjectAddress,
      countryOfIDIssuance: this.countryOfIDIssuance,
      countryOfResidence: this.countryOfResidence,
      kycType: this.kycType,
      issuerAddress: this.issuerAddress,
      issuerSignature: this.issuerSignature,
      id: this.id,
      level: this.level,
    });
  }

  public static parse(str: string): ICredential {
    const {
      properties,
      hashTree,
      rootHash,
      subjectAddress,
      countryOfIDIssuance,
      countryOfResidence,
      kycType,
      issuerAddress,
      issuerSignature,
      id,
      level,
    } = JSON.parse(str);

    const obj = {
      properties,
      hashTree,
      rootHash,
      subjectAddress,
      countryOfIDIssuance,
      countryOfResidence,
      kycType,
      issuerAddress,
      issuerSignature,
    };

    return new Credential(obj, id, level);
  }
}
