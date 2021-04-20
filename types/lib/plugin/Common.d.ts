export declare type StringOrBoolean = string | boolean;
export declare type StringOrNumber = string | number;
export declare type StringOrNumberOrBoolean = string | number | boolean;
export declare type SyncCallback = (...args: any[]) => void;
export declare type AsyncCallback = (...args: any[]) => Promise<void>;
export declare type Callback = SyncCallback | AsyncCallback;
export interface ISerializable {
    serialize: () => string;
}
export interface ICollection<T> extends ISerializable, Array<T> {
    getByField: (field: string, value: any) => T | undefined;
    filterByField: (field: string, value: any) => T[];
    removeByField: (field: string, value: any) => void;
}
