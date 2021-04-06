export type StringOrBoolean = string | boolean;
export type StringOrNumber = string | number;
export type StringOrNumberOrBoolean = string | number | boolean;

export type SyncCallback = (...args: any[]) => void;
export type AsyncCallback = (...args: any[]) => Promise<void>;
