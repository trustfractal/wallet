import requestsActions, {
  requestsTypes,
} from "@redux/stores/user/reducers/requests";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

import Credential from "@models/Credential";
import Request from "@models/Request";
import Requester from "@models/Request/Requester";
import RequestsTypes from "@models/Request/types";
import VerificationRequest from "@models/VerificationRequest";
import RequestsStatus from "@models/Request/status";

export const addVerificationRequest = ({
  payload: { id, requester, request: serializedVerificationRequest },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const parsedRequester = Requester.parse(requester);
    let verificationRequest = VerificationRequest.parse(
      serializedVerificationRequest,
    );

    // create request instance
    const request = new Request(
      id,
      parsedRequester,
      verificationRequest,
      RequestsTypes.VERIFICATION_REQUEST,
    );

    // append request
    requests.push(request);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
  };
};

export const acceptVerificationRequest = ({
  payload: { id, credential: serializedCredential, properties },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const credential = Credential.fromString(serializedCredential);

    // remove unselected properties
    Object.keys(credential.properties).forEach(
      (property) =>
        !properties[property] && credential.removeProperty(property),
    );

    // get request
    const request = requests.getByField("id", id);
    if (!request) {
      return;
    }

    const verificationRequest = request.request;

    // add fields
    verificationRequest.credential = credential;

    // update request
    request.request = verificationRequest;
    request.status = RequestsStatus.ACCEPTED;
    request.updatedAt = new Date().getTime();
    requests.updateByField("id", request.id, request);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
    dispatch(requestsActions.requestAccepted(request));
  };
};

export const declineVerificationRequest = ({
  payload: { id, credential: serializedCredential },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const credential = Credential.fromString(serializedCredential);

    // get request
    const request = requests.getByField("id", id);
    if (!request) {
      return;
    }

    const verificationRequest = request.request;

    // add fields
    verificationRequest.credential = credential;

    // update request
    request.request = verificationRequest;
    request.status = RequestsStatus.DECLINED;
    request.updatedAt = new Date().getTime();
    requests.updateByField("id", request.id, request);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
    dispatch(requestsActions.requestDeclined(request));
  };
};

const Aliases = {
  [requestsTypes.ADD_VERIFICATION_REQUEST]: addVerificationRequest,
  [requestsTypes.ACCEPT_VERIFICATION_REQUEST]: acceptVerificationRequest,
  [requestsTypes.DECLINE_VERIFICATION_REQUEST]: declineVerificationRequest,
};

export default Aliases;
