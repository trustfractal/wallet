import AppStore from "@redux/stores/application";

import credentialsActions, {
  credentialsTypes,
} from "@redux/stores/user/reducers/credentials";

import profileActions from "@redux/stores/user/reducers/profile";

import Credential from "@models/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCase from "@models/VerificationCase";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import protocolActions, {
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import { getMaguroService, getMegalodonService } from "@services/Factory";

const fetchCredentialsAndVerificationCases = () => {
  return async (dispatch, getState) => {
    const setup = isSetup(AppStore.getStore().getState());

    if (!setup) return;

    // fetch credentials
    const { credentials: userCredentials } =
      await getMaguroService().getCredentials();

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
    const {
      verification_cases: verificationCases,
      phones: phoneNumbers,
      emails,
    } = await getMegalodonService().me();

    const formattedVerificationCases = verificationCases.reduce(
      (
        memo,
        { id, client_id, level, status, credential, journey_completed },
      ) => {
        let vcStatus = VerificationCase.getStatus({
          id,
          level,
          status,
          credential,
          journey_completed,
          credentials,
        });

        memo.push(new VerificationCase(id, client_id, level, vcStatus));

        return memo;
      },
      new VerificationCasesCollection(),
    );

    dispatch(
      credentialsActions.setVerificationCases(formattedVerificationCases),
    );

    dispatch(profileActions.setEmails(emails));
    dispatch(profileActions.setPhoneNumbers(phoneNumbers));

    // Check registration type
    const registrationState = getRegistrationState(getState());

    if (registrationState === protocolRegistrationTypes.MISSING_CREDENTIAL) {
      const filteredCredentials =
        formattedVerificationCases.filterApprovedProtocolVerificationCases();

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
