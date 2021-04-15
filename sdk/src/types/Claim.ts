import { Address, Hash, Property } from "./base";

export type IClaimProperties = Record<
  string,
  Property | Record<string, Property>
>;

export interface IClaim {
  claimTypeHash: Hash;
  owner: Address | null;
  properties: IClaimProperties;
}

export interface IClaimHashNode {
  hash: Hash;
  nonce?: string;
}

export type IClaimHashTree = Record<string, IClaimHashNode>;
