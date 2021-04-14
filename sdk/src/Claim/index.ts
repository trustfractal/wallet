import { validateSchema } from "@src/ClaimType/ClaimType.utils";
import type { Address, IClaim, IClaimProperties, IClaimType } from "@src/types";

export default class Claim implements IClaim {
  public claimTypeHash: IClaim["claimTypeHash"];
  public owner: IClaim["owner"];
  public properties: IClaim["properties"];

  public constructor({ claimTypeHash, owner, properties }: IClaim) {
    this.claimTypeHash = claimTypeHash;
    this.owner = owner;
    this.properties = properties;
  }

  public static build(
    claimType: IClaimType,
    properties: IClaimProperties,
    owner: Address
  ) {
    validateSchema(claimType.schema, properties);

    return new Claim({
      claimTypeHash: claimType.hash,
      properties,
      owner,
    });
  }
}
