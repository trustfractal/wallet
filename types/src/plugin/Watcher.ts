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

export type SubscribedAction = {
  listener: IListener;
  unlisten: () => void;
};

export type SubscribedActions = {
  listeners: SubscribedAction[];
  unlisten: () => void;
};

export type WatcherInvokation = {
  type: string;
  payload: Record<string, any>;
};

export type WatcherAction = {
  action: string;
  callback: Callback;
};

export interface IAuthWatcher extends IWatcher {
  listenForLogin: (
    onSuccess: Callback,
    onFailed: Callback,
    onTimeout: Callback,
    timeOutTime?: number
  ) => void;
}

export interface ISetupWatcher extends IWatcher {
  listenForSetup: (
    onSuccess: Callback,
    onFailed: Callback,
    onTimeout: Callback,
    timeOutTime?: number
  ) => void;
}
