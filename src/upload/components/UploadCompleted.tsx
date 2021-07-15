import styled from "styled-components";

import { ICredential } from "@pluginTypes/plugin";

import Icon, { IconNames } from "@popup/components/common/Icon";
import Credential from "@popup/components/common/Credential";

import TopComponent from "./common/TopComponent";
import Title from "./common/Title";
import Text from "./common/Text";

const Root = styled.div`
  width: 80vw;
  min-height: 82vh;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  margin-bottom: var(--s-80);
`;

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: var(--s-48);
`;

const TitleContainer = styled.div`
  margin-bottom: var(--s-24);
`;

const CredentialsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: space-between;
`;

export type UploadCompletedProps = {
  credentials: ICredential[];
};

function UploadCompleted(props: UploadCompletedProps) {
  const { credentials } = props;

  return (
    <TopComponent>
      <Root>
        <LogoContainer>
          <Icon name={IconNames.LOGO_NAME} />
        </LogoContainer>
        <HeaderContainer>
          <TitleContainer>
            <Title>Data recovered successfully!</Title>
          </TitleContainer>
          <Text>
            Below you can see the credentials you were able to recover to your
            Fractal ID Wallet.
          </Text>
        </HeaderContainer>
        <CredentialsContainer>
          {credentials.map((credential) => (
            <Credential key={credential.level} credential={credential} />
          ))}
        </CredentialsContainer>
      </Root>
    </TopComponent>
  );
}

export default UploadCompleted;
