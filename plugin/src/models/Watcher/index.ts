import {
  IWatcher,
  IListener,
  Callback,
  WatcherInvokation,
  SubscribedAction,
  SubscribedActions,
  WatcherAction,
} from "@pluginTypes/index";

import Listener from "./Listener";
import ListenersCollection from "./ListenersCollection";

export default class Watcher implements IWatcher {
  public listeners: IWatcher["listeners"];

  constructor() {
    this.listeners = {};
  }

  public invoke({ type, payload }: WatcherInvokation): void {
    if (!this.listeners[type]) return;

    this.listeners[type].forEach((listener: IListener) =>
      listener.callback(payload),
    );
  }

  private addListener(action: string, callback: Callback): IListener {
    if (!this.listeners[action]) {
      this.listeners[action] = new ListenersCollection();
    }

    const listener = new Listener(action, callback);

    this.listeners[action].push(listener);

    return listener;
  }

  public unlisten(action: string, id: string): void {
    const registeredListeners = this.listeners[action];

    registeredListeners.removeByField("id", id);
  }

  public listen(action: string, callback: Callback): SubscribedAction {
    const listener = this.addListener(action, callback);

    return {
      listener,
      unlisten: () => this.unlisten(action, listener.id),
    };
  }

  public listenForActions(actions: WatcherAction[]): SubscribedActions {
    const listeners = actions.map(({ action, callback }) =>
      this.listen(action, callback),
    );

    return {
      listeners,
      unlisten: () => listeners.map((listener) => listener.unlisten()),
    };
  }
}
