export declare type StringOrBoolean = string | boolean;
export declare type StringOrNumber = string | number;
export declare type StringOrNumberOrBoolean = string | number | boolean;
export declare type SyncCallback = (...args: any[]) => void;
export declare type AsyncCallback = (...args: any[]) => Promise<void>;
export declare type Callback = SyncCallback | AsyncCallback;
