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

import WindowsService from "@services/WindowsService";

export const addVerificationRequest = ({
  payload: { id, level, requester },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const parsedRequester = Requester.parse(requester);
    let verificationRequest = new VerificationRequest(level);

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

    // open popup on a new window
    await WindowsService.createPopup();
  };
};

export const acceptVerificationRequest = ({
  payload: { id, credential: serializedCredential, properties },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const credential = Credential.parse(serializedCredential);

    // remove unselected properties
    Object.keys(properties).forEach(
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

    WindowsService.closeAllPopups();
  };
};

export const declineVerificationRequest = ({
  payload: { id, credential: serializedCredential },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // parse data
    const credential = Credential.parse(serializedCredential);

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

    WindowsService.closeAllPopups();
  };
};

const Aliases = {
  [requestsTypes.ADD_VERIFICATION_REQUEST]: addVerificationRequest,
  [requestsTypes.ACCEPT_VERIFICATION_REQUEST]: acceptVerificationRequest,
  [requestsTypes.DECLINE_VERIFICATION_REQUEST]: declineVerificationRequest,
};

export default Aliases;