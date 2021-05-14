export type StringOrBoolean = string | boolean;
export type StringOrNumber = string | number;
export type StringOrNumberOrBoolean = string | number | boolean;

export type SyncCallback = (...args: any[]) => void;
export type AsyncCallback = (...args: any[]) => Promise<void>;
export type Callback = SyncCallback | AsyncCallback;

export interface ISerializable {
  serialize: () => string;
}

export interface ICollection<T> extends ISerializable, Array<T> {
  getByField: (field: string, value: any) => T | undefined;
  filterByField: (field: string, value: any) => T[];
  removeByField: (field: string, value: any) => void;
}

export interface SignedNonce {
  signer: string;
  nonce: string;
  signature: string;
}
