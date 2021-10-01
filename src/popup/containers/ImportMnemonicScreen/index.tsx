import { ChangeEvent, useState } from "react";
import styled from "styled-components";

import {
  Input,
  Text,
  BoldText,
  Cta,
  VerticalSequence,
  Icon,
  IconNames,
} from "@popup/components/Protocol/common";

import {
  encodeAddress,
  mnemonicToMiniSecret,
  schnorrkelKeypairFromSeed,
} from "@polkadot/util-crypto";

import { Subsubtitle } from "@popup/components/common/Subtitle";

const ClickableText = styled.button`
  outline: none;
  background: none;
  margin: 0;
  padding: 0;
  color: inherit;
`;

interface ImportProps {
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
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL} />

      <BoldText>Enter your mnemonic to recover your wallet.</BoldText>

      <Input
        onChange={onChange}
        placeholder="Enter your mnemonic"
        style={{ alignSelf: "stretch" }}
      />

      <Cta disabled={mnemonic == null} onClick={onClick}>
        Recover
      </Cta>

      {address && <Subsubtitle>Your address is</Subsubtitle>}

      {address && <Text>{address}</Text>}

      <Subsubtitle underline>
        <ClickableText onClick={onCancel}>Back to Create New</ClickableText>
      </Subsubtitle>
    </VerticalSequence>
  );
}

function ImportMnemonicScreen(props: ImportProps) {
  return <Import {...props} />;
}

export default ImportMnemonicScreen;
