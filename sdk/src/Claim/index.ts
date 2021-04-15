import Validator from "@src/ClaimType/Validator";
import type { Address, IClaim, IClaimProperties, IClaimType } from "@src/types";

export default class Claim implements IClaim {
  public claimTypeHash: IClaim["claimTypeHash"];
  public owner: IClaim["owner"];
  public properties: IClaim["properties"];

  public constructor(
    claimType: IClaimType,
    properties: IClaimProperties,
    owner: Address
  ) {
    Validator.validate(claimType.schema, properties);

    this.claimTypeHash = claimType.hash;
    this.owner = owner;
    this.properties = properties;
  }
}
