import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text, { TextSizes, TextHeights } from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Logo from "@popup/components/common/Logo";
import Anchor from "@popup/components/common/Anchor";

import WindowsService from "@services/WindowsService";
import environment from "@environment/index";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--s-24);
  padding-bottom: var(--s-48);
`;
const ContentContainer = styled.div`
  margin-bottom: var(--s-10);
`;
const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
  margin-bottom: var(--s-32);
`;
const FooterContainer = styled.div``;

function EmptyValidCredentials() {
  const onNext = () => WindowsService.openTab(environment.JOURNEY_URL);

  return (
    <TopComponent>
      <IconContainer>
        <Logo />
      </IconContainer>
      <ContentContainer>
        <Title>You haven’t verified your identity yet.</Title>
        <Text>
          <br />
        </Text>
        <Text>To earn FCL start by providing a valid liveness.</Text>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onNext}>Verify Identity</Button>
      </ActionContainer>
      <FooterContainer>
        <Text size={TextSizes.SMALL} height={TextHeights.SMALL}>
          If you need help on anything related to Fractal ID Wallet, please
          contact us at{" "}
          <Anchor link="mailto:support@fractal.id">support@fractal.id</Anchor>.
        </Text>
      </FooterContainer>
    </TopComponent>
  );
}

export default EmptyValidCredentials;
