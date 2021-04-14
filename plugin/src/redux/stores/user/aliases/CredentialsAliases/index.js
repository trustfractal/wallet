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

export const removeCredential = ({ payload: id }) => {
  return async (dispatch, getState) => {
    const credentials = getCredentials(getState());

    // get request
    const credential = credentials.getById(id);

    // remove credential
    credentials.removeById(credential.id);

    // update redux store
    dispatch(credentialsActions.setCredentials(credentials));
  };
};

const Aliases = {
  [credentialsTypes.ADD_CREDENTIAL]: addCredential,
  [credentialsTypes.REMOVE_CREDENTIAL]: removeCredential,
};

export default Aliases;
