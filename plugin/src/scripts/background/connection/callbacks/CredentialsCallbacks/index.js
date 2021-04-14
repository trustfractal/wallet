import { v4 as uuidv4 } from "uuid";

import UserStore from "@redux/stores/user";

import requestsActions from "@redux/stores/user/reducers/requests";

import { requestsWatcher } from "@redux/middleware/watcher";

import RequestStatus from "@models/Request/RequestStatus";
import RequestTypes from "@models/Request/RequestTypes";

import ConnectionTypes from "@models/Connection/types";

import ContentScriptConnection from "@background/connection";

export const confirmCredential = ([content, target], port) =>
  new Promise((resolve, reject) => {
    try {
      const request = {
        id: uuidv4(),
        requester: target.address,
        content: {
          attester: content.attestation.owner,
          claimer: content.request.claim.owner,
          properties: content.request.claim.contents,
          ctype: content.request.claim.cTypeHash,
          claim: content,
        },
        type: RequestTypes.CONFIRM_CREDENTIAL,
      };

      UserStore.getStore().dispatch(requestsActions.addRequest(request));

      // create callbacks
      const onAccept = async (acceptedRequest) => {
        // commit credential to the blockchain
        const transactionHash = await ContentScriptConnection.invoke(
          ConnectionTypes.COMMIT_CREDENTIAL,
          [acceptedRequest.content],
          port,
        );

        resolve(transactionHash);
      };
      const onDecline = () => reject(RequestStatus.DECLINED);

      const onTimeout = () => {
        UserStore.getStore().dispatch(
          requestsActions.removeRequest(request.id),
        );

        reject(RequestStatus.TIMED_OUT);
      };

      requestsWatcher.listenForRequest(
        request.id,
        onAccept,
        onDecline,
        onTimeout,
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.CONFIRM_CREDENTIAL]: confirmCredential,
};

export default Callbacks;
