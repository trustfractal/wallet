import { Address, Hash } from "./base";

export interface IClaimPseudoSchema {
  $schema: string;
  properties: {
    [key: string]: {
      $ref?: string;
      type?: string;
      format?: string;
    };
  };
  title: string;
  type: "object";
}

export interface IClaimSchema extends IClaimPseudoSchema {
  $id: string;
}

export interface IClaimType {
  hash: Hash;
  owner: Address | null;
  schema: IClaimSchema;
}
