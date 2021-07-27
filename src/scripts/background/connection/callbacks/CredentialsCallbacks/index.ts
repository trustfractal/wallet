import { v4 as uuidv4 } from "uuid";

import UserStore from "@redux/stores/user";

import CredentialsCollection from "@models/Credential/CredentialsCollection";
import AuthMiddleware from "@models/Connection/middlewares/AuthMiddleware";
import ConnectionTypes from "@models/Connection/types";

import {
  getAttestedClaims,
  getCredentials,
} from "@redux/stores/user/reducers/credentials/selectors";
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
import CredentialsVersions from "@models/Credential/versions";
import AttestedClaim from "@models/Credential/AttestedClaim";
import SelfAttestedClaim from "@models/Credential/SelfAttestedClaim";

export const hasCredential = ([id]: [string, CredentialsVersions]) =>
  new Promise((resolve, reject) => {
    try {
      const credentials: CredentialsCollection = getAttestedClaims(
        UserStore.getStore().getState(),
      );

      const credential = credentials.getByField("id", id);

      resolve(credential !== undefined);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

export const getVerificationRequest = ([
  level,
  requester,
  fields = {},
  version,
]: [string, string, Record<string, boolean>, CredentialsVersions]) =>
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

      const filteredCredentials = credentials.filter((credential) => {
        if (credential.level !== level) {
          return false;
        }

        if (
          credential.version === CredentialsVersions.VERSION_ONE &&
          !(credential as AttestedClaim).valid
        ) {
          return false;
        } else if (
          credential.version === CredentialsVersions.VERSION_ONE &&
          (credential as SelfAttestedClaim).revoked
        ) {
          return false;
        }

        if (version && credential.version !== version) {
          return false;
        }

        return true;
      });

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
      const window = await WindowsService.createPopup(PopupSizes.LARGE);

      if (!window) {
        reject(ERROR_VERIFICATION_REQUEST_WINDOW_OPEN());
        return;
      }

      const onAccepted = (verificationRequest: IVerificationRequest) => {
        // close request popup
        WindowsService.closeWindow(window.id);

        // resolve promise
        resolve(verificationRequest.serialize());
      };

      const onDeclined = () => {
        // close request popup
        WindowsService.closeWindow(window.id);

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
  [ConnectionTypes.HAS_CREDENTIAL_BACKGROUND]: {
    callback: hasCredential,
    middlewares: [new AuthMiddleware()],
  },
  [ConnectionTypes.GET_VERIFICATION_REQUEST_BACKGROUND]: {
    callback: getVerificationRequest,
    middlewares: [new AuthMiddleware()],
  },
};

export default Callbacks;
