import { useState } from "react";
import styled from "styled-components";

import Button from "@popup/components/common/Button";
import Text from "@popup/components/common/Text";
import Title from "@popup/components/common/Title";
import TopComponent from "@popup/components/common/TopComponent";
import { withNavBar } from "@popup/components/common/NavBar";
import { useUserSelector } from "@redux/stores/user/context";
import { getWallet } from "@redux/stores/user/reducers/protocol/selectors";

const ContentContainer = styled.div`
  margin-top: var(--s-24);
  margin-bottom: var(--s-10);
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
`;

const MnemonicContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-24) 0;
`;

const MnemonicWordsContainer = styled.div`
  background-color: rgba(34, 34, 34, 0.6);
  border-radius: var(--s-12);
  padding: var(--s-12);

  font-family: monospace;
  text-align: center;
`;

const Spacing = styled.div`
  margin-bottom: var(--s-20);
`;

export type MnemonicProps = {
  onNext: () => void;
};

function MnemonicWords() {
  const wallet = useUserSelector(getWallet);

  return <MnemonicWordsContainer>{wallet!.mnemonic}</MnemonicWordsContainer>;
}

function Mnemonic(props: MnemonicProps) {
  const { onNext } = props;
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);

  const toggleMnemonic = () => setShowMnemonic(!showMnemonic);

  return (
    <TopComponent>
      <ContentContainer>
        <Title>Fractal Protocol</Title>
        <Text>
          <br />
        </Text>
        <Text>Click the button below to see your mnemonic.</Text>
      </ContentContainer>
      <MnemonicContainer>
        <Text>{showMnemonic && <MnemonicWords />}</Text>
      </MnemonicContainer>
      <ActionContainer>
        <Button onClick={toggleMnemonic}>
          {showMnemonic ? "Hide mnemonic" : "Show mnemonic"}
        </Button>
        <Spacing />
        <Button onClick={onNext}>Go Back</Button>
      </ActionContainer>
    </TopComponent>
  );
}

export default withNavBar(Mnemonic);
