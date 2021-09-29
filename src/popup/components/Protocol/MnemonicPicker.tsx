import { mnemonicGenerate } from "@polkadot/util-crypto";

import { useEffect, useState } from "react";

import {
  Cta,
  Icon,
  IconNames,
  BoldText,
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
        You should only register a new identity if it isn't already associated
        with an account. If you already have registered please recover your
        account.
      </BoldText>

      <Cta onClick={onCtaClicked}>Create</Cta>
    </VerticalSequence>
  );
}
