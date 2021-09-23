import styled from "styled-components";

import Credential from "@popup/components/common/Credential";
import VerificationCase from "@popup/components/common/VerificationCase";
import History from "@popup/components/common/History";
import TopComponent from "@popup/components/common/TopComponent";
import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

import { ICredential, IVerificationCase } from "@pluginTypes/index";
import { useUserSelector } from "@redux/stores/user/context";
import {
  getCredentials,
  getUpcomingCredentials,
} from "@redux/stores/user/reducers/credentials/selectors";
import { getRequests } from "@redux/stores/user/reducers/requests/selectors";
import CredentialModel from "@models/Credential";
import VerificationCaseModel from "@models/VerificationCase";

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
  const requests = useUserSelector(getRequests);
  const credentials = useUserSelector(getCredentials);
  const upcomingCredentials = useUserSelector(getUpcomingCredentials);

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
                  <Credential key={credential.level} credential={credential} />
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
