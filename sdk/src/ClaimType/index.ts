import type { IClaimPseudoSchema, IClaimType } from "@src/types";

import Crypto from "@src/Crypto";

// TODO: what to do about schema versioning?
const DEFAULT_SCHEMA_VERSION = "http://kilt-protocol.org/draft-01/ctype#";

export default class ClaimType implements IClaimType {
  public hash: IClaimType["hash"];
  public owner: IClaimType["owner"];
  public schema: IClaimType["schema"];

  public constructor({ hash, owner, schema }: IClaimType) {
    this.hash = hash;
    this.owner = owner;
    this.schema = schema;
  }

  public static fromSchema(
    schema: IClaimPseudoSchema,
    owner?: IClaimType["owner"]
  ) {
    const hash = Crypto.hash(schema);

    return new ClaimType({
      hash,
      owner: owner || null,
      schema: {
        ...schema,
        $id: `fractal:ctype:${hash}`,
        type: "object",
      },
    });
  }

  public static buildSchema(
    title: string,
    properties: Record<string, object>,
    schema?: string
  ): IClaimPseudoSchema {
    return {
      $schema: schema || DEFAULT_SCHEMA_VERSION,
      title,
      properties,
    };
  }
}
