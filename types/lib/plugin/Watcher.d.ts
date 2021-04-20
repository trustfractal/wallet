import { Callback, ISerializable, ICollection } from "./Common";
export interface IListener extends ISerializable {
    id: string;
    action: string;
    callback: Callback;
}
export interface IWatcher {
    listeners: Record<string, ICollection<IListener>>;
    invoke(invokation: WatcherInvokation): void;
    unlisten(action: string, id: string): void;
    listen(action: string, callback: Callback): SubscribedAction;
    listenForActions(actions: WatcherAction[]): SubscribedActions;
}
export declare type SubscribedAction = {
    listener: IListener;
    unlisten: () => void;
};
export declare type SubscribedActions = {
    listeners: SubscribedAction[];
    unlisten: () => void;
};
export declare type WatcherInvokation = {
    type: string;
    payload: Record<string, any>;
};
export declare type WatcherAction = {
    action: string;
    callback: Callback;
};
export interface IAuthWatcher extends IWatcher {
    listenForLogin: (onSuccess: Callback, onFailed: Callback, onTimeout: Callback, timeOutTime?: number) => void;
}
