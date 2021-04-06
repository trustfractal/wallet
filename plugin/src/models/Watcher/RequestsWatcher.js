import Watcher from ".";

import { requestsTypes } from "@redux/requests";

const REQUESTS_TIME_OUT = 30 * 1000;

export default class RequestsWatcher extends Watcher {
  invoke({ type, payload }) {
    if (!(requestsTypes[type] && this.subscribers[type])) return;

    this.subscribers[type].forEach((subscriber) =>
      subscriber.callback(payload),
    );
  }

  listenForRequest(
    id,
    onAcceptCallback,
    onDeclineCallback,
    onTimeoutCallback,
    timeOutTime = REQUESTS_TIME_OUT,
  ) {
    let unlisten;
    const timeout = setTimeout(() => {
      unlisten();

      onTimeoutCallback();
    }, timeOutTime);

    const accepted = {
      action: requestsTypes.REQUEST_ACCEPTED,
      callback: (acceptedRequest) => {
        if (acceptedRequest.id === id) {
          unlisten();
          clearTimeout(timeout);

          onAcceptCallback(acceptedRequest);
        }
      },
    };
    const declined = {
      action: requestsTypes.REQUEST_DECLINED,
      callback: (declinedRequest) => {
        if (declinedRequest.id === id) {
          unlisten();
          clearTimeout(timeout);

          onDeclineCallback(declinedRequest);
        }
      },
    };

    // wait the request to resolved
    unlisten = this.listenForActions([accepted, declined]).unlisten;
  }
}
