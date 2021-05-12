import styled from "styled-components";

import { ICredential, IRequest } from "@pluginTypes/index";

import TopComponent from "@popup/components/common/TopComponent";
import Credential from "@popup/components/common/Credential";
import History from "@popup/components/common/History";

const RootContainer = styled.div`
  margin-bottom: var(--s-32);
`;

export type CredentialsProps = {
  credentials: ICredential[];
  requests: IRequest[];
};

function Credentials(props: CredentialsProps) {
  const { credentials, requests } = props;

  const getCredentialRequests = (id: string) =>
    requests.filter((request) => request.request.credential!.id === id);

  return (
    <TopComponent>
      {credentials.map((credential: ICredential) => (
        <RootContainer key={credential.id}>
          <Credential key={credential.level} credential={credential} />
          {requests.length > 0 && (
            <History requests={getCredentialRequests(credential.id)} />
          )}
        </RootContainer>
      ))}
    </TopComponent>
  );
}

Credentials.defaultProps = {
  credentials: [],
};

export default Credentials;
