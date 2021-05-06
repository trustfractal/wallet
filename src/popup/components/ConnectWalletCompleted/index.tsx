import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import Icon, { IconNames } from "@popup/components/common/Icon";
import { withNavBar } from "@popup/components/common/NavBar";
import { TextWeights } from "../common/Text";

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: var(--s-24);
  padding-bottom: var(--s-48);
`;
const AddressContainer = styled.div`
  text-align: center;
`;
const LabelContainer = styled.div`
  opacity: 0.6;
  margin-top: var(--s-32);
  margin-bottom: var(--s-8);
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

export type ConnectWalletCompletedProps = {
  account: string;
  onNext: () => void;
};

function ConnectWalletCompleted(props: ConnectWalletCompletedProps) {
  const { account, onNext } = props;

  return (
    <TopComponent>
      <IconContainer>
        <Icon name={IconNames.SUCCESS} />
      </IconContainer>
      <ContentContainer>
        <Title>Fractal is now connected to your wallet</Title>
        <AddressContainer>
          <LabelContainer>
            <Text>Detected Address</Text>
          </LabelContainer>
          <Text weight={TextWeights.BOLD}>{account}</Text>
        </AddressContainer>
      </ContentContainer>
      <ActionContainer>
        <Button onClick={onNext}>Got it</Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default withNavBar(ConnectWalletCompleted);
