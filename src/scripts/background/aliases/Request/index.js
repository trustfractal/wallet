/* global chrome */

import requestsActions, { requestsTypes } from "@redux/requests";
import kiltActions from "@redux/kilt";
import { getRequests } from "@redux/selectors";

import Request from "@models/Request";
import RequestStatus from "@models/Request/RequestStatus";

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
    await chrome.windows.create({
      focused: true,
      height: 600,
      width: 400,
      left: 0,
      top: 0,
      type: "popup",
      url: `popup.html?route=requests/${request.id}`,
    });
  };
};

export const acceptShareCredentialRequest = ({
  payload: { id, credential, properties },
}) => {
  return async (dispatch, getState) => {
    const requests = getRequests(getState());

    // get request
    const acceptedRequest = requests.getById(id);
    acceptedRequest.status = RequestStatus.ACCEPTED;
    acceptedRequest.content.credential = credential;
    acceptedRequest.content.properties = properties;

    // update request status
    requests.updateItem(id, acceptedRequest);

    // update redux store
    dispatch(requestsActions.setRequests(requests));
    dispatch(requestsActions.requestAccepted(acceptedRequest));

    // close new window popup if open
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.type === "popup") {
      await chrome.windows.remove(currentWindow.id);
    }
  };
};

export const acceptShareDataRequest = ({ payload: id }) => {
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

    // close new window popup if open
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.type === "popup") {
      await chrome.windows.remove(currentWindow.id);
    }
  };
};

export const acceptStoreCredentialRequest = ({ payload: id }) => {
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
    dispatch(kiltActions.addCredential(acceptedRequest.content));

    // close new window popup if open
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.type === "popup") {
      await chrome.windows.remove(currentWindow.id);
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
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.type === "popup") {
      await chrome.windows.remove(currentWindow.id);
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
    const currentWindow = await chrome.windows.getCurrent();
    if (currentWindow.type === "popup") {
      await chrome.windows.remove(currentWindow.id);
    }
  };
};

const Aliases = {
  [requestsTypes.ADD_REQUEST]: addRequest,
  [requestsTypes.ACCEPT_SHARE_CREDENTIAL_REQUEST]: acceptShareCredentialRequest,
  [requestsTypes.ACCEPT_SHARE_DATA_REQUEST]: acceptShareDataRequest,
  [requestsTypes.ACCEPT_STORE_CREDENTIAL_REQUEST]: acceptStoreCredentialRequest,
  [requestsTypes.IGNORE_REQUEST]: ignoreRequest,
  [requestsTypes.REMOVE_REQUEST]: removeRequest,
  [requestsTypes.DECLINE_REQUEST]: declineRequest,
};

export default Aliases;
