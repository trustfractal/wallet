import { mnemonicGenerate } from "@polkadot/util-crypto";

import { useEffect, useState } from "react";

import {
  BoldText,
  ClickableText,
  Cta,
  Icon,
  IconNames,
  Subtitle,
  VerticalSequence,
} from "@popup/components/Protocol/common";

import ImportMnemonicScreen from "@popup/containers/ImportMnemonicScreen";

import { getRecoverMnemonicService } from "@services/Factory";

export default function MnemonicPicker({
  onMnemonicPicked,
}: {
  onMnemonicPicked: (mnemonic: string) => void;
}) {
  const onCtaClicked = () => {
    onMnemonicPicked(mnemonicGenerate());
  };

  const [showRecoverPage, setShowRecoverPage] = useState(false);

  useEffect(() => {
    const service = getRecoverMnemonicService();
    service.onShowPage = (show) => {
      setShowRecoverPage(show);
    };
    service.showInMenu();
    return () => service.dontShowInMenu();
  });

  if (showRecoverPage) {
    return (
      <ImportMnemonicScreen
        onMnemonic={onMnemonicPicked}
        onCancel={() => setShowRecoverPage(false)}
      />
    );
  }

  return (
    <VerticalSequence>
      <Icon name={IconNames.PROTOCOL} />

      <BoldText center>
        Create a new address for interacting with the Protocol.
      </BoldText>

      <Cta onClick={onCtaClicked}>Create</Cta>

      <Subtitle center>
        <ClickableText onClick={() => setShowRecoverPage(true)}>
          Recover Instead
        </ClickableText>
      </Subtitle>
    </VerticalSequence>
  );
}
