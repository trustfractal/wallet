export declare type StringOrBoolean = string | boolean;
export declare type StringOrNumber = string | number;
export declare type StringOrNumberOrBoolean = string | number | boolean;
export declare type SyncCallback = (...args: any[]) => void;
export declare type AsyncCallback = (...args: any[]) => Promise<void>;
export declare type Callback = SyncCallback | AsyncCallback;
export declare type Property = number | string | boolean;
export declare type Address = string;
export declare type Hash = string;
export declare type HashWithNonce = {
    hash: string;
    nonce?: string;
};
export declare type Signature = string;
export declare type HashTree = Record<string, HashWithNonce>;
export interface ISerializable {
    serialize: () => string;
}
export interface ICollection<T> extends ISerializable, Array<T> {
    getByField: (field: string, value: any) => T | undefined;
    filterByField: (field: string, value: any) => T[];
    removeByField: (field: string, value: any) => void;
}
