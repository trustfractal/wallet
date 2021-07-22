import AppStore from "@redux/stores/application";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";

import Credential from "@models/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import MaguroService from "@services/MaguroService";

export const fetchCredentials = () => {
  return async (dispatch) => {
    const setup = isSetup(AppStore.getStore().getState());

    if (!setup) return;

    const { credentials: userCredentials } =
      await MaguroService.getCredentials();

    const credentials = userCredentials.reduce((memo, credential) => {
      memo.push(
        new Credential(
          { ...credential.data },
          `${credential.verification_case_id}:${credential.level}`,
          credential.level,
        ),
      );

      return memo;
    }, new CredentialsCollection());

    dispatch(credentialsActions.setCredentials(credentials));
  };
};

const Aliases = {
  [credentialsTypes.FETCH_CREDENTIALS]: fetchCredentials,
};

export default Aliases;
