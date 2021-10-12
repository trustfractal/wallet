import styled from "styled-components";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import Loading from "@popup/components/Loading";
import { useCachedState, useObservedState } from "@utils/ReactHooks";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";
import CredentialComponent from "@popup/components/common/Credential";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import VerificationCase from "@popup/components/common/VerificationCase";
import VerificationCasesCollection from "@models/VerificationCase/VerificationCasesCollection";
import History from "@popup/components/common/History";
import TopComponent from "@popup/components/common/TopComponent";
import EmptyCredentials from "@popup/components/EmptyCredentials";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";
import { ConnectToAccount } from "@popup/components/ConnectToAccount";

import { ICredential, IVerificationCase } from "@pluginTypes/index";
import { useUserDispatch, useUserSelector } from "@redux/stores/user/context";
import appActions from "@redux/stores/application/reducers/app";
import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";
import CredentialModel from "@models/Credential";
import VerificationCaseModel from "@models/VerificationCase";
import {
  getFractalAccountConnector,
  getMaguroService,
  getMegalodonService,
  getValueCache,
  getWindowsService,
} from "@services/Factory";
import { credentialsSubject } from "@services/Observables";
import environment from "@environment/index";

const RootContainer = styled.div`
  margin-bottom: var(--s-32);
`;
const LabelContainer = styled.div`
  margin-bottom: var(--s-20);
  color: var(--c-white);
  text-transform: uppercase;
  opacity: 0.6;
`;

function Credentials() {
  const dispatch = useAppDispatch();
  const userDispatch = useUserDispatch();
  const requests = useUserSelector(getRequests);

  const loadCredentials = async () => {
    const { credentials: rpcCredentials } =
      await getMaguroService().getCredentials();
    const credentials = CredentialsCollection.fromRpcList(rpcCredentials);
    const { verification_cases: cases } = await getMegalodonService().me();
    const verificationCases = VerificationCasesCollection.fromRpcList(
      cases,
      credentials,
    );
    return [
      credentials,
      verificationCases.filterPendingOrContactedOrIssuingSupportedVerificationCases(),
    ];
  };
  const credentialsLoading = useCachedState({
    cache: getValueCache(),
    key: "credentials",
    useFor: 10 * 60,
    loader: loadCredentials,
    cacheWhen: ([creds, upcoming]) => creds.length > 0 || upcoming.length > 0,
    onValue: ([credentials]) => {
      credentialsSubject.next(credentials);
      dispatch(credentialsActions.setCredentials(credentials));
      userDispatch(credentialsActions.setCredentials(credentials));
    },
    serialize: ([credentials, upcomingCredentials]) => {
      return JSON.stringify([
        credentials.serialize(),
        upcomingCredentials.serialize(),
      ]);
    },
    deserialize: (s) => {
      const [credentials, upcomingCredentials] = JSON.parse(s);
      return [
        CredentialsCollection.parse(credentials),
        VerificationCasesCollection.parse(upcomingCredentials),
      ];
    },
  });

  const setup = useAppSelector(isSetup);
  const connectedAccount = useObservedState(
    () => getFractalAccountConnector().connectedAccount$,
  );

  if (!connectedAccount.hasValue) return <Loading />;

  if (setup !== connectedAccount.value) {
    dispatch(appActions.setSetup(connectedAccount.value));
  }
  if (!connectedAccount.value) {
    return (
      <TopComponent>
        <ConnectToAccount />
      </TopComponent>
    );
  }

  if (!credentialsLoading.isLoaded) return <Loading />;
  const [credentials, upcomingCredentials] = credentialsLoading.value;

  if (credentials.length === 0 && upcomingCredentials.length === 0)
    return (
      <EmptyCredentials
        onClick={() => {
          getWindowsService().openTab(environment.LIVENESS_JOURNEY_URL);
        }}
      />
    );

  const getCredentialRequests = (id: string) =>
    requests.filter((request) => request.request.credential!.id === id);

  return (
    <TopComponent>
      {credentials.length > 0 && (
        <>
          <LabelContainer>
            <Text
              size={TextSizes.SMALL}
              height={TextHeights.SMALL}
              weight={TextWeights.SEMIBOLD}
            >
              Credentials
            </Text>
          </LabelContainer>
          {credentials
            .sort(CredentialModel.sortByCreatedAt)
            .map((credential: ICredential) => {
              const credentialsRequests = getCredentialRequests(credential.id);

              return (
                <RootContainer key={credential.id}>
                  <CredentialComponent
                    key={credential.level}
                    credential={credential}
                  />
                  {credentialsRequests.length > 0 && (
                    <History requests={getCredentialRequests(credential.id)} />
                  )}
                </RootContainer>
              );
            })}
        </>
      )}
      {upcomingCredentials.length > 0 && (
        <>
          <LabelContainer>
            <Text
              size={TextSizes.SMALL}
              height={TextHeights.SMALL}
              weight={TextWeights.SEMIBOLD}
            >
              Upcoming
            </Text>
          </LabelContainer>
          {upcomingCredentials
            .sort(VerificationCaseModel.sortByStatus)
            .map((verificationCase: IVerificationCase) => {
              return (
                <RootContainer key={verificationCase.id}>
                  <VerificationCase
                    key={verificationCase.level}
                    verificationCase={verificationCase}
                  />
                </RootContainer>
              );
            })}
        </>
      )}
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
