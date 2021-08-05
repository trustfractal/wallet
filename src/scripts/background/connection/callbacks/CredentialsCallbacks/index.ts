import { v4 as uuidv4 } from "uuid";

import UserStore from "@redux/stores/user";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import requestsActions from "@redux/stores/user/reducers/requests";

import { requestsWatcher } from "@redux/middlewares/watchers";

import { ERROR_CREDENTIALS_NOT_FOUND } from "@background/Errors";

import {
  ERROR_VERIFICATION_REQUEST_INVALID_FIELDS,
  ERROR_VERIFICATION_REQUEST_TIME_OUT,
  ERROR_VERIFICATION_REQUEST_DECLINED,
  ERROR_VERIFICATION_REQUEST_WINDOW_OPEN,
} from "@background/Errors";

import WindowsService, { PopupSizes } from "@services/WindowsService";

import { IVerificationRequest } from "@pluginTypes/plugin";
import VerificationRequest from "@models/VerificationRequest";

export const getVerificationRequest = ([level, requester, fields = {}]: [
  string,
  string,
  Record<string, boolean>,
]) =>
  new Promise(async (resolve, reject) => {
    try {
      // create verification request instance
      const verificationRequest = new VerificationRequest(level, fields);

      if (!verificationRequest.validate()) {
        reject(ERROR_VERIFICATION_REQUEST_INVALID_FIELDS());
        return;
      }

      // check if the user has any level credential
      const credentials: CredentialsCollection = getCredentials(
        UserStore.getStore().getState(),
      );

      const filteredCredentials = credentials.filter(
        (credential) => credential.level === level,
      );

      if (filteredCredentials.length === 0) {
        reject(ERROR_CREDENTIALS_NOT_FOUND());
        return;
      }

      // generate an id
      const id = uuidv4();

      // add request to store
      await UserStore.getStore().dispatch(
        requestsActions.addVerificationRequest({
          id,
          requester,
          request: verificationRequest.serialize(),
        }),
      );

      // open popup on a new window
      const window = await WindowsService.createPopup(PopupSizes.MEDIUM);

      if (!window) {
        reject(ERROR_VERIFICATION_REQUEST_WINDOW_OPEN());
        return;
      }

      const onAccepted = (verificationRequest: IVerificationRequest) => {
        // resolve promise
        resolve(verificationRequest.serialize());
      };

      const onDeclined = () => {
        // reject promise
        reject(ERROR_VERIFICATION_REQUEST_DECLINED());
      };

      const onTimeout = async () => {
        // close request popup
        WindowsService.closeWindow(window.id);

        await UserStore.getStore().dispatch(
          requestsActions.declineVerificationRequest({
            id,
            credential: filteredCredentials[0].serialize(),
          }),
        );

        reject(ERROR_VERIFICATION_REQUEST_TIME_OUT());
      };

      requestsWatcher.listenForRequest(id, onAccepted, onDeclined, onTimeout);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const Callbacks = {
  [ConnectionTypes.GET_VERIFICATION_REQUEST_BACKGROUND]: {
    callback: getVerificationRequest,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
