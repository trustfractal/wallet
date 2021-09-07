import { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import {
  encodeAddress,
  mnemonicToMiniSecret,
  schnorrkelKeypairFromSeed,
} from "@polkadot/util-crypto";

import RoutesPaths from "@popup/routes/paths";

import protocolActions from "@redux/stores/user/reducers/protocol";
import { useUserDispatch } from "@redux/stores/user/context";

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

import { ProtocolProvider } from "@services/ProtocolService/";

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

function Import() {
  const dispatch = useUserDispatch();
  const history = useHistory();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [enabled, setEnabled] = useState<boolean>(false);

  const goToProtocolTab = () =>
    history.push(`${RoutesPaths.WALLET}?activeTab=protocol-tab`);

  const onClick = () => {
    if (!mnemonic) return;

    dispatch(protocolActions.importWallet(mnemonic));
    goToProtocolTab();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const seed = mnemonicToMiniSecret(e.target.value);
      const { publicKey } = schnorrkelKeypairFromSeed(seed);
      const address = encodeAddress(publicKey);

      setMnemonic(e.target.value);
      setAddress(address);
      setEnabled(true);
    } catch (e) {
      setMnemonic(null);
      setAddress(null);
      setEnabled(false);
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
          <Button disabled={!enabled} onClick={onClick}>
            Recover my wallet
          </Button>
        </CTA>

        <Spacing size="var(--s-12)" />

        {address && <Subsubtitle>Your address is</Subsubtitle>}

        <Spacing size="var(--s-3)" />

        {address && <Text>{address}</Text>}

        <Spacing size="var(--s-12)" />

        <Subsubtitle underline>
          <ClickableText onClick={goToProtocolTab}>
            Create new instead
          </ClickableText>
        </Subsubtitle>
      </Container>
    </Container>
  );
}

function ImportMnemonicScreen() {
  return (
    <TopComponent>
      <ProtocolProvider>
        <Import />
      </ProtocolProvider>
    </TopComponent>
  );
}

export default ImportMnemonicScreen;
