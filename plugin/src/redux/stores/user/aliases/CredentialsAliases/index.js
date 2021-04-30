import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import Credential from "@models/Credential";

export const addCredential = ({
  payload: {
    id,
    attester,
    claimer,
    properties,
    ctype,
    claim,
    status,
    createdAt,
  },
}) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // create credential instance
    const credential = new Credential(
      id,
      attester,
      claimer,
      properties,
      ctype,
      claim,
      status,
      createdAt,
    );

    // append credential
    credentials.push(credential);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

export const updateCredential = ({ payload: updatedCredential }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // update credential
    credentials.updateByField(
      "level",
      updatedCredential.level,
      updatedCredential,
    );

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
  [credentialsTypes.REMOVE_CREDENTIAL]: removeCredential,
};

export default Aliases;
