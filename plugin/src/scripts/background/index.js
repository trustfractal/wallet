import { v4 as uuidv4 } from "uuid";

import redux from "@redux";
import appActions from "@redux/app";
import requestsActions from "@redux/requests";
import { getCredentials } from "@redux/selectors";
import { requestsWatcher } from "@redux/middleware/watcher";

import RequestStatus from "@models/Request/RequestStatus";
import RequestTypes from "@models/Request/RequestTypes";
import ContentScriptConnection from "@models/Connection/ContentScriptConnection";

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

        // create callbacks
        const onAccept = (acceptedRequest) => {
          const credential = credentials.getById(
            acceptedRequest.content.credential,
          );

          resolve(credential);
        };
        const onDecline = () => reject(RequestStatus.DECLINED);
        const onTimeout = () => {
          store.dispatch(requestsActions.removeRequest(request.id));

          reject(RequestStatus.TIMED_OUT);
        };

        requestsWatcher.listenForRequest(
          request.id,
          onAccept,
          onDecline,
          onTimeout,
        );
      }),
  );
}

init();
