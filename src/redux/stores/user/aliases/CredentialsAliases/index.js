import AppStore from "@redux/stores/application";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";

import Credential from "@models/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCase from "@models/VerificationCase";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

import MaguroService from "@services/MaguroService";
import MegalodonService from "@services/MegalodonService";

export const fetchCredentialsAndVerificationCases = () => {
  return async (dispatch) => {
    const setup = isSetup(AppStore.getStore().getState());

    if (!setup) return;

    // fetch credentials
    const { credentials: userCredentials } =
      await MaguroService.getCredentials();

    const credentials = userCredentials.reduce((memo, credential) => {
      memo.push(
        new Credential(
          { ...credential.data },
          `${credential.verification_case_id}:${credential.level}`,
          credential.level,
          credential.verification_case_id,
          new Date(credential.created_at).getTime(),
        ),
      );

      return memo;
    }, new CredentialsCollection());

    dispatch(credentialsActions.setCredentials(credentials));

    // fetch verification cases
    const { verification_cases: verificationCases } =
      await MegalodonService.me();

    const formattedVerificationCases = verificationCases.reduce(
      (
        memo,
        { id, client_id, level, status, credential, journey_completed },
      ) => {
        let vcStatus = VerificationCase.getStatus(
          id,
          status,
          credential,
          journey_completed,
          credentials,
        );

        memo.push(new VerificationCase(id, client_id, level, vcStatus));

        return memo;
      },
      new VerificationCasesCollection(),
    );

    dispatch(credentialsActions.setCredentials(credentials));
    dispatch(
      credentialsActions.setVerificationCases(formattedVerificationCases),
    );
  };
};

const Aliases = {
  [credentialsTypes.FETCH_CREDENTIALS_AND_VERIFICATION_CASES]:
    fetchCredentialsAndVerificationCases,
};

export default Aliases;
