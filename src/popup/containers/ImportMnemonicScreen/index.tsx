import { ChangeEvent, useState } from "react";
import styled from "styled-components";

import {
  encodeAddress,
  mnemonicToMiniSecret,
  schnorrkelKeypairFromSeed,
} from "@polkadot/util-crypto";

import Text, {
  TextHeights,
  TextSizes,
  TextWeights,
} from "@popup/components/common/Text";

import TopComponent from "@popup/components/common/TopComponent";
import { Subsubtitle } from "@popup/components/common/Subtitle";
import Button from "@popup/components/common/Button";
import Logo from "@popup/components/common/Logo";
import Input from "@popup/components/common/Input";

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Spacing = styled.div<{ size?: string }>`
  margin-bottom: ${(props) => props.size || "var(--s-20)"};
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--s-38) 0 var(--s-24);
`;

const CTA = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const ClickableText = styled.button`
  outline: none;
  background: none;
  margin: 0;
  padding: 0;
  color: inherit;
`;

function HeaderWithLogo() {
  return (
    <HeaderContainer>
      <Logo />
    </HeaderContainer>
  );
}

export interface ImportProps {
  onMnemonic: (mnemonic: string) => void;
  onCancel: () => void;
}

function Import({ onMnemonic, onCancel }: ImportProps) {
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const onClick = () => {
    if (!mnemonic) return;

    onMnemonic(mnemonic);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const seed = mnemonicToMiniSecret(e.target.value);
      const { publicKey } = schnorrkelKeypairFromSeed(seed);
      const address = encodeAddress(publicKey);

      setMnemonic(e.target.value);
      setAddress(address);
    } catch (e) {
      setMnemonic(null);
      setAddress(null);
    }
  };

  return (
    <Container>
      <Container>
        <HeaderWithLogo />

        <Text
          height={TextHeights.EXTRA_LARGE}
          size={TextSizes.LARGE}
          weight={TextWeights.BOLD}
        >
          Enter your mnemonic to recover your wallet.
        </Text>

        <Spacing />

        <Input onChange={onChange} placeholder="Enter your mnemonic" />

        <Spacing />

        <CTA>
          <Button disabled={mnemonic == null} onClick={onClick}>
            Recover my wallet
          </Button>
        </CTA>

        <Spacing size="var(--s-12)" />

        {address && <Subsubtitle>Your address is</Subsubtitle>}

        <Spacing size="var(--s-3)" />

        {address && <Text>{address}</Text>}

        <Spacing size="var(--s-12)" />

        <Subsubtitle underline>
          <ClickableText onClick={onCancel}>Create new instead</ClickableText>
        </Subsubtitle>
      </Container>
    </Container>
  );
}

function ImportMnemonicScreen(props: ImportProps) {
  return (
    <TopComponent>
      <Import {...props} />
    </TopComponent>
  );
}

export default ImportMnemonicScreen;
