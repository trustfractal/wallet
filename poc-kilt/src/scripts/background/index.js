import { v4 as uuidv4 } from "uuid";

import redux from "@redux";
import appActions from "@redux/app";
import {
  getCredentials,
  getData,
  getPublicIdentity,
  getIdentity,
} from "@redux/selectors";
import requestsActions, { requestsTypes } from "@redux/requests";
import { watcher } from "@redux/middleware/watcher";

import KiltService from "@services/kilt";

import ContentScriptConnection from "@models/Connection/ContentScriptConnection";
import RequestStatus from "@models/Request/RequestStatus";
import RequestTypes from "@models/Request/RequestTypes";

const REQUESTS_TIME_OUT = 30 * 1000;

async function init() {
  const contentScript = new ContentScriptConnection();
  await KiltService.init();
  const store = await redux.init();

  store.dispatch(appActions.startup());

  contentScript.on(
    "getProperties",
    (content, { address: requester }) =>
      new Promise((resolve, reject) => {
        const data = getData(store.getState());

        const request = {
          id: uuidv4(),
          requester,
          content,
          type: RequestTypes.SHARE_DATA,
        };

        store.dispatch(requestsActions.addRequest(request));

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
          (acceptedRequest) => {
            if (acceptedRequest.id === request.id) {
              // unsubscribe redux watchers and clear timeout
              acceptedListener.unsubscribe();
              acceptedListener.unsubscribe();
              clearTimeout(requestTimeout);

              resolve(data.getProperties(acceptedRequest.content));
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

  contentScript.on(
    "broadcastCredential",
    ({ attestedClaim }, { address: requester }) => {
      const identity = getIdentity(store.getState());

      const {
        body: { content },
      } = KiltService.decryptMessage(identity, attestedClaim);

      const request = {
        requester,
        content: {
          attester: content.attestation.owner,
          claimer: content.request.claim.owner,
          properties: content.request.claim.contents,
          ctype: content.request.claim.cTypeHash,
          claim: content,
        },
        type: RequestTypes.STORE_CREDENTIAL,
      };

      store.dispatch(requestsActions.addRequest(request));
    },
  );

  contentScript.on("getPublicIdentity", () =>
    getPublicIdentity(store.getState()),
  );

  contentScript.on("requestAttestation", async (ctype, target) => {
    const identity = getIdentity(store.getState());
    const data = getData(store.getState());
    const propertyNames = Object.keys(ctype.schema.properties);
    const properties = data.getProperties(propertyNames);

    const request = await KiltService.buildAttestationRequest(
      identity,
      ctype,
      properties,
    );

    const response = await KiltService.buildAttestationRequestMessage(
      identity,
      request,
      target,
    );

    return response;
  });

  contentScript.on(
    "getCredential",
    (message, target) =>
      new Promise((resolve, reject) => {
        const identity = getIdentity(store.getState());

        const {
          body: {
            content: {
              ctypes: [cTypeHash],
            },
          },
        } = KiltService.decryptMessage(identity, message);

        const credentials = getCredentials(store.getState())
        .filterByCType(
          cTypeHash,
        );

        const request = {
          id: uuidv4(),
          requester: target.address,
          content: {
            cTypeHash,
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

              const credential = credentials.getById(acceptedRequest.content.credential);
              const response = await KiltService.buildPresentationMessage(
                identity,
                credential,
                acceptedRequest.content.properties,
                target,
              );

              resolve(response);
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
