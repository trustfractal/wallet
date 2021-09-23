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
  public verificationCaseId: string;
  public createdAt: number;

  public constructor(
    credential: ISDKCredential,
    id: string,
    level: string,
    verificationCaseId: string,
    createdAt: number,
  ) {
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
    this.verificationCaseId = verificationCaseId;
    this.createdAt = createdAt;
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
      verificationCaseId: this.verificationCaseId,
      createdAt: this.createdAt,
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
      verificationCaseId,
      createdAt,
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

    return new Credential(obj, id, level, verificationCaseId, createdAt);
  }

  public static sortByCreatedAt(
    credentialA: ICredential,
    credentialB: ICredential,
  ) {
    return credentialB.createdAt - credentialA.createdAt;
  }
}
