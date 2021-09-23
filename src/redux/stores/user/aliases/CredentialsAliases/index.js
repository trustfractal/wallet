import AppStore from "@redux/stores/application";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";

import Credential from "@models/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCase from "@models/VerificationCase";
import VerificationCaseStatus from "@models/VerificationCase/status";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import protocolActions, {
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import MaguroService from "@services/MaguroService";
import MegalodonService from "@services/MegalodonService";

export const fetchCredentialsAndVerificationCases = () => {
  return async (dispatch, getState) => {
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

    // Check registration type
    const registrationState = getRegistrationState(getState());

    if (registrationState === protocolRegistrationTypes.MISSING_CREDENTIAL) {
      const filteredCredentials = formattedVerificationCases.filter(
        (vc) =>
          vc.status === VerificationCaseStatus.APPROVED &&
          vc.level.split("+").includes("protocol"),
      );

      if (filteredCredentials.length > 0) {
        dispatch(
          protocolActions.setRegistrationState(
            protocolRegistrationTypes.ADDRESS_GENERATED,
          ),
        );
        dispatch(protocolActions.resumeWalletCreation());
      }
    }
  };
};

const Aliases = {
  [credentialsTypes.FETCH_CREDENTIALS_AND_VERIFICATION_CASES]:
    fetchCredentialsAndVerificationCases,
};

export default Aliases;
