import { Address, Hash, Property } from "./Common";

export type IClaimProperties = Record<
  string,
  Property | Record<string, Property>
>;

export interface IClaim {
  claimTypeHash: Hash;
  owner: Address | null;
  properties: IClaimProperties;
}
