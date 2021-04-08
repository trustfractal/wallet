import requestsActions, {
  requestsTypes,
} from "@redux/stores/user/reducers/requests";
import credentialsActions from "@redux/stores/user/reducers/credentials";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

import Request from "@models/Request";
import RequestStatus from "@models/Request/RequestStatus";

import WindowsService from "@services/WindowsService";

export const addRequest = ({ payload: { id, requester, content, type } }) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // create request instance
    const request = new Request(id, requester, content, type);

    // append request
    requests.push(request);

    // update redux store
    dispatch(requestsActions.setRequests(requests));

    // open popup on a new window
    await WindowsService.createPopup(`popup.html?route=requests/${request.id}`);
  };
};

export const acceptConfirmCredentialRequest = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // get request
    const acceptedRequest = requests.getById(id);
    acceptedRequest.status = RequestStatus.ACCEPTED;

    // update request status
    requests.updateItem(id, acceptedRequest);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
    dispatch(requestsActions.requestAccepted(acceptedRequest));
    dispatch(credentialsActions.addCredential(acceptedRequest.content));

    // close new window popup if open
    const currentWindow = await WindowsService.getCurrentWindow();
    if (currentWindow.type === "popup") {
      await WindowsService.closeWindow(currentWindow.id);
    }
  };
};

export const ignoreRequest = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // get request
    const ignoredRequest = requests.getById(id);

    // remove request from redux store
    dispatch(requestsActions.removeRequest(ignoredRequest.id));

    // close new window popup if open
    const currentWindow = await WindowsService.getCurrentWindow();
    if (currentWindow.type === "popup") {
      await WindowsService.closeWindow(currentWindow.id);
    }
  };
};

export const removeRequest = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // remove requet
    requests.removeById(id);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
  };
};

export const declineRequest = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // get request
    const declinedRequest = requests.getById(id);
    declinedRequest.status = RequestStatus.DECLINED;

    // update request status
    requests.updateItem(id, declinedRequest);

    // update redux store
    dispatch(requestsActions.setRequests(requests));

    // update redux store
    dispatch(requestsActions.setRequests(requests));
    dispatch(requestsActions.requestDeclined(declinedRequest));

    // close new window popup if open
    const currentWindow = await WindowsService.getCurrentWindow();
    if (currentWindow.type === "popup") {
      await WindowsService.closeWindow(currentWindow.id);
    }
  };
};

const Aliases = {
  [requestsTypes.ADD_REQUEST]: addRequest,
  [requestsTypes.ACCEPT_CONFIRM_CREDENTIAL_REQUEST]: acceptConfirmCredentialRequest,
  [requestsTypes.IGNORE_REQUEST]: ignoreRequest,
  [requestsTypes.REMOVE_REQUEST]: removeRequest,
  [requestsTypes.DECLINE_REQUEST]: declineRequest,
};

export default Aliases;
