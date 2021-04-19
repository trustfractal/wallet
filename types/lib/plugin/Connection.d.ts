/// <reference types="chrome" />
import { AsyncCallback, SyncCallback } from "./Common";
import LocalMessageDuplexStream from "post-message-stream";
export interface IResponse {
    id: string;
    method: string;
    value: any;
    success: boolean;
    port?: string;
    getMessageType: () => string;
    serialize: () => string;
}
export interface IInvokation {
    id: string;
    method: string;
    args: any[];
    port?: string;
    getMessageType: () => string;
    serialize: () => string;
}
export interface PromiseObject {
    resolve: SyncCallback;
    reject: SyncCallback;
}
export declare type Message = {
    type: string;
    message: string;
};
export interface IConnection {
    from: string;
    to: string;
    responseCallbacks: Record<string, PromiseObject>;
    invokationCallbacks: Record<string, AsyncCallback>;
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
export interface IConnectionCallbacks {
    [key: string]: (...args: any[]) => any;
}
export declare type IConnectionPorts = Record<string, IPort>;
