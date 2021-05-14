import Watcher from ".";

import { requestsTypes } from "@redux/stores/user/reducers/requests";

import {
  Callback,
  IListener,
  IRequest,
  IRequestsWatcher,
  SubscribedActions,
  WatcherInvokation,
} from "@pluginTypes/index";

const REQUESTS_TIME_OUT = 30 * 1000; // 30 seconds

export default class RequestsWatcher
  extends Watcher
  implements IRequestsWatcher {
  public invoke({ type, payload }: WatcherInvokation): void {
    if (!(requestsTypes[type] && this.listeners[type])) return;

    this.listeners[type].forEach((listener: IListener) =>
      listener.callback(payload),
    );
  }

  public listenForRequest(
    id: string,
    onAccepted: Callback,
    onDeclined: Callback,
    onTimeout: Callback,
    timeOutTime: number = REQUESTS_TIME_OUT,
  ): SubscribedActions {
    let unlisten = () => {};
    const timeout = setTimeout(() => {
      unlisten();

      onTimeout();
    }, timeOutTime);

    const accepted = {
      action: requestsTypes.REQUEST_ACCEPTED,
      callback: (request: IRequest) => {
        if (id === request.id) {
          unlisten();
          clearTimeout(timeout);

          onAccepted(request.request);
        }
      },
    };

    const declined = {
      action: requestsTypes.REQUEST_DECLINED,
      callback: (request: IRequest) => {
        if (id === request.id) {
          unlisten();
          clearTimeout(timeout);

          onDeclined();
        }
      },
    };

    // wait the user to login
    const subscribed = this.listenForActions([accepted, declined]);

    unlisten = subscribed.unlisten;

    return subscribed;
  }
}
