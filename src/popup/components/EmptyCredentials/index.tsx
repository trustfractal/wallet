import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Icon, { IconNames } from "@popup/components/common/Icon";

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
`;

function EmptyCredentials() {
  const onNext = () => WindowsService.openTab(environment.JOURNEY_URL);

  return (
    <TopComponent>
      <IconContainer>
        <Icon name={IconNames.ROBOT} />
      </IconContainer>
      <ContentContainer>
        <Title>You don't have a credential yet.</Title>
        <Text>
          <br />
        </Text>
        <Text>
          Once you complete a valid KYC, your credentials will appear here
          automatically.
        </Text>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onNext}>Go to Fractal</Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default EmptyCredentials;
