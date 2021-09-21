import styled from "styled-components";

import Credential from "@popup/components/common/Credential";
import VerificationCase from "@popup/components/common/VerificationCase";
import History from "@popup/components/common/History";
import TopComponent from "@popup/components/common/TopComponent";

import { ICredential, IVerificationCase } from "@pluginTypes/index";
import { useUserSelector } from "@redux/stores/user/context";
import {
  getCredentials,
  getPendingSupportedVerificationCases,
} from "@redux/stores/user/reducers/credentials/selectors";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

const RootContainer = styled.div`
  margin-bottom: var(--s-32);
`;

function Credentials() {
  const requests = useUserSelector(getRequests);
  const credentials = useUserSelector(getCredentials);
  const pendingVerificationCases = useUserSelector(
    getPendingSupportedVerificationCases,
  );

  const getCredentialRequests = (id: string) =>
    requests.filter((request) => request.request.credential!.id === id);

  return (
    <TopComponent>
      {credentials.map((credential: ICredential) => {
        const credentialsRequests = getCredentialRequests(credential.id);

        return (
          <RootContainer key={credential.id}>
            <Credential key={credential.level} credential={credential} />
            {credentialsRequests.length > 0 && (
              <History requests={getCredentialRequests(credential.id)} />
            )}
          </RootContainer>
        );
      })}
      {pendingVerificationCases.map((verificationCase: IVerificationCase) => {
        return (
          <RootContainer key={verificationCase.id}>
            <VerificationCase
              key={verificationCase.level}
              verificationCase={verificationCase}
            />
          </RootContainer>
        );
      })}
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
