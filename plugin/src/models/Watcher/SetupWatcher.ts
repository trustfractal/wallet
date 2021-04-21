import Watcher from ".";

import {
  Callback,
  IListener,
  ISetupWatcher,
  SubscribedActions,
  WatcherInvokation,
} from "@fractalwallet/types";

import { walletTypes } from "@redux/stores/user/reducers/wallet";

const SETUP_TIME_UT = 10 * 60 * 1000; // 10 minutes

export default class SetupWatcher extends Watcher implements ISetupWatcher {
  public invoke({ type, payload }: WatcherInvokation): void {
    if (!(walletTypes[type] && this.listeners[type])) return;

    this.listeners[type].forEach((listener: IListener) =>
      listener.callback(payload),
    );
  }

  public listenForSetup(
    onSuccess: Callback,
    onFailed: Callback,
    onTimeout: Callback,
    timeOutTime: number = SETUP_TIME_UT,
  ): SubscribedActions {
    let unlisten = () => {};
    const timeout = setTimeout(() => {
      unlisten();

      onTimeout();
    }, timeOutTime);

    const success = {
      action: walletTypes.CONNECT_WALLET_SUCCESS,
      callback: () => {
        unlisten();
        clearTimeout(timeout);

        onSuccess();
      },
    };

    const failed = {
      action: walletTypes.CONNECT_WALLET_FAILED,
      callback: onFailed,
    };

    // wait the user to finish the setup
    const subscribed = this.listenForActions([success, failed]);

    unlisten = subscribed.unlisten;

    return subscribed;
  }
}
