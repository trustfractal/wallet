export type StringOrBoolean = string | boolean;
export type StringOrNumber = string | number;
export type StringOrNumberOrBoolean = string | number | boolean;

export type SyncCallback = (...args: any[]) => void;
export type AsyncCallback = (...args: any[]) => Promise<void>;
export type Callback = SyncCallback | AsyncCallback;

export type Property = number | string | boolean;
export type Address = string;
export type Hash = string;
export type HashWithNonce = {
  hash: string;
  nonce?: string;
};
export type Signature = string;
export type HashTree = Record<string, HashWithNonce>;

export interface ISerializable {
  serialize: () => string;
}

export interface ICollection<T> extends ISerializable, Array<T> {
  getByField: (field: string, value: any) => T | undefined;
  filterByField: (field: string, value: any) => T[];
  removeByField: (field: string, value: any) => void;
}
