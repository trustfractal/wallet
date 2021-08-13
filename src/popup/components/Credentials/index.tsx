import styled from "styled-components";

import Credential from "@popup/components/common/Credential";
import History from "@popup/components/common/History";
import TopComponent from "@popup/components/common/TopComponent";

import { ICredential } from "@pluginTypes/index";
import { useUserSelector } from "@redux/stores/user/context";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";

const RootContainer = styled.div`
  margin-bottom: var(--s-32);
`;

function Credentials() {
  const requests = useUserSelector(getRequests);
  const credentials = useUserSelector(getCredentials);

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
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
