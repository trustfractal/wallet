import type { IClaimSchema, IClaimType } from "../types";

import Crypto from "../Crypto";

export class ClaimType implements IClaimType {
  public hash: IClaimType["hash"];
  public owner: IClaimType["owner"];
  public schema: IClaimType["schema"];

  public constructor({ hash, owner, schema }: IClaimType) {
    this.hash = hash;
    this.owner = owner;
    this.schema = schema;
  }

  public static fromSchema(schema: IClaimSchema, owner?: IClaimType["owner"]) {
    const hash = Crypto.hash(schema);

    return new ClaimType({
      hash,
      owner: owner || null,
      schema: {
        ...schema,
        $id: `fractal:ctype:${hash}`,
      },
    });
  }
}
