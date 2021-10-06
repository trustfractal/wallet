import { ChangeEvent, useState } from "react";

import {
  ClickableText,
  Input,
  Text,
  BoldText,
  Cta,
  VerticalSequence,
  Icon,
  IconNames,
  Subtitle,
  Subsubtitle,
} from "@popup/components/Protocol/common";

import {
  encodeAddress,
  mnemonicToMiniSecret,
  schnorrkelKeypairFromSeed,
} from "@polkadot/util-crypto";

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

      <Subtitle center>
        Only recover if the address is not being used on another installation of
        the extension. Multiple installations with the same address will
        conflict with each other.
      </Subtitle>

      <Input
        onChange={onChange}
        placeholder="Enter your mnemonic"
        style={{ alignSelf: "stretch" }}
      />

      {address && <Subsubtitle>Your address is</Subsubtitle>}
      {address && <Text>{address}</Text>}

      <Cta disabled={mnemonic == null} onClick={onClick}>
        Recover
      </Cta>

      <Subtitle underline>
        <ClickableText onClick={onCancel}>Back to Create New</ClickableText>
      </Subtitle>
    </VerticalSequence>
  );
}

function ImportMnemonicScreen(props: ImportProps) {
  return <Import {...props} />;
}

export default ImportMnemonicScreen;
