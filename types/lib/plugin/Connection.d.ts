/// <reference types="chrome" />
import { AsyncCallback, Callback, ISerializable, SyncCallback } from "./Common";
import LocalMessageDuplexStream from "post-message-stream";
export interface IResponse extends ISerializable {
    id: string;
    method: string;
    value: any;
    success: boolean;
    port?: string;
    getMessageType: () => string;
}
export interface IInvokation extends ISerializable {
    id: string;
    method: string;
    args: any[];
    port?: string;
    getMessageType: () => string;
}
export declare type IMiddleware = {
    apply(invokation: IInvokation): Promise<void>;
};
export interface ConnectionResponse {
    resolve: SyncCallback;
    reject: SyncCallback;
}
export interface ConnectionInvokation {
    callback: AsyncCallback;
    middlewares: IMiddleware[];
}
export declare type Message = {
    type: string;
    message: string;
};
export interface IConnection {
    from: string;
    to: string;
    responses: Record<string, ConnectionResponse>;
    invokations: Record<string, ConnectionInvokation>;
    postMessage: (message: IResponse | IInvokation) => void;
    on: (method: string, callback: any) => IConnection;
    invoke: (method: string, ...args: any[]) => Promise<any>;
    listen(id: string): Promise<any>;
}
export interface IProxyConnection {
    sourceConnection: IConnection;
    destinationConnection: IConnection;
    sourceName: string;
    destinationName: string;
}
export declare type DuplexConnectionParams = {
    name: string;
    target: string;
    targetWindow?: Window;
};
export interface IBackgroundConnection extends IConnection {
    port: chrome.runtime.Port;
}
export interface IPort {
    id: string;
    port: chrome.runtime.Port;
}
export interface IContentScriptConnection extends IConnection {
    ports: Record<string, IPort>;
}
export interface IExtensionConnection extends IConnection {
    extension: LocalMessageDuplexStream;
}
export interface IInpageConnection extends IConnection {
    inpage: LocalMessageDuplexStream;
}
export interface ConnectionCallback {
    callback: Callback;
    middlewares?: IMiddleware[];
}
export interface ConnectionCallbacks {
    [key: string]: ConnectionCallback;
}
export declare type IConnectionPorts = Record<string, IPort>;
