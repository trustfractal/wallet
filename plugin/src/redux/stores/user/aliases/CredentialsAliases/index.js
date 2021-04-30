import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import Credential from "@models/Credential";

export const addCredential = ({ payload: serializedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const credential = Credential.parse(serializedCredential);

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const updateCredential = ({ payload: serializedUpdatedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    const credential = Credential.parse(serializedUpdatedCredential);

    // update credential
    const updatedCredential = credentials.updateByField(
      "level",
      credential.level,
      credential,
    );

    if (!updatedCredential) {
      return;
    }

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const removeCredential = ({ payload: level }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // get request
    const credential = credentials.getByField("level", level);

    if (!credential) {
      return;
    }

    // remove credential
    credentials.removeByField("level", credential.level);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

const Aliases = {
  [credentialsTypes.ADD_CREDENTIAL]: addCredential,
  [credentialsTypes.UPDATE_CREDENTIAL]: updateCredential,
  [credentialsTypes.REMOVE_CREDENTIAL]: removeCredential,
};

export default Aliases;
