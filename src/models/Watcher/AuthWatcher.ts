import Watcher from ".";

import {
  Callback,
  IListener,
  IAuthWatcher,
  SubscribedActions,
  WatcherInvokation,
} from "@pluginTypes/index";

import { authTypes } from "@redux/stores/application/reducers/auth";

const LOGIN_TIME_UT = 5 * 60 * 1000; // 5 minutes

export default class AuthWatcher extends Watcher implements IAuthWatcher {
  public invoke({ type, payload }: WatcherInvokation): void {
    if (!(authTypes[type] && this.listeners[type])) return;

    this.listeners[type].forEach((listener: IListener) =>
      listener.callback(payload),
    );
  }

  public listenForLogin(
    onSuccess: Callback,
    onFailed: Callback,
    onTimeout: Callback,
    timeOutTime: number = LOGIN_TIME_UT,
  ): SubscribedActions {
    let unlisten = () => {};
    const timeout = setTimeout(() => {
      unlisten();

      onTimeout();
    }, timeOutTime);

    const success = {
      action: authTypes.SIGN_IN_SUCCESS,
      callback: () => {
        unlisten();
        clearTimeout(timeout);

        onSuccess();
      },
    };

    const failed = {
      action: authTypes.SIGN_IN_FAILED,
      callback: onFailed,
    };

    // wait the user to login
    const subscribed = this.listenForActions([success, failed]);

    unlisten = subscribed.unlisten;

    return subscribed;
  }
}
