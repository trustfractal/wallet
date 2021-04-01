import { v4 as uuidv4 } from "uuid";

import redux from "@redux";
import appActions from "@redux/app";
import requestsActions, { requestsTypes } from "@redux/requests";
import { getCredentials } from "@redux/selectors";
import { watcher } from "@redux/middleware/watcher";

import RequestStatus from "@models/Request/RequestStatus";
import RequestTypes from "@models/Request/RequestTypes";
import ContentScriptConnection from "@models/Connection/ContentScriptConnection";

const REQUESTS_TIME_OUT = 30 * 1000;

async function init() {
  const contentScript = new ContentScriptConnection();
  const store = await redux.init();

  store.dispatch(appActions.startup());

  contentScript.on(
    "requestCredential",
    (ctypeHash, target) =>
      new Promise((resolve, reject) => {
        const credentials = getCredentials(store.getState()).filterByCType(
          ctypeHash,
        );

        const request = {
          id: uuidv4(),
          requester: target.address,
          content: {
            ctypeHash,
            credential: credentials[0].id,
            properties: Object.keys(credentials[0].properties).reduce(
              (previous, current) => ({
                ...previous,
                [current]: true,
              }),
              {},
            ),
          },
          type: RequestTypes.SHARE_CREDENTIAL,
        };

        store.dispatch(requestsActions.addRequest(request));

        // TODO: Refactor this duplicated code
        // assign timeout to the request
        let acceptedListener, declinedListener;
        const requestTimeout = setTimeout(() => {
          store.dispatch(requestsActions.removeRequest(request.id));

          // unsubscribe redux watchers and reject
          acceptedListener.unsubscribe();
          declinedListener.unsubscribe();

          reject(RequestStatus.TIMED_OUT);
        }, REQUESTS_TIME_OUT);

        acceptedListener = watcher.subscribe(
          requestsTypes.REQUEST_ACCEPTED,
          async (acceptedRequest) => {
            if (acceptedRequest.id === request.id) {
              // unsubscribe redux watchers and clear timeout
              acceptedListener.unsubscribe();
              acceptedListener.unsubscribe();
              clearTimeout(requestTimeout);

              const credential = credentials.getById(
                acceptedRequest.content.credential,
              );

              resolve(credential);
            }
          },
        );

        declinedListener = watcher.subscribe(
          requestsTypes.REQUEST_DECLINED,
          (declinedRequest) => {
            if (declinedRequest.id === request.id) {
              // unsubscribe redux watchers and clear timeout
              acceptedListener.unsubscribe();
              declinedListener.unsubscribe();
              clearTimeout(requestTimeout);

              reject(RequestStatus.DECLINED);
            }
          },
        );
      }),
  );
}

init();
