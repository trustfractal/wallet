import { useState } from "react";
import { mnemonicGenerate } from "@polkadot/util-crypto";

import { useLoadedState } from "@utils/ReactHooks";
import { getProtocolOptIn } from "@services/Factory";
import { getMnemonicSave } from "@services/Factory";
import {
  CatfishServiceError,
  ErrorCode,
} from "@services/CatfishService/Errors";
import TopComponent from "@popup/components/common/TopComponent";

import { MnemonicSavedCheck } from "./MnemonicSavedCheck";
import Loading from "@popup/components/Loading";
import DataScreen from "./DataScreen";
import { OptInForm } from "./OptInForm";
import { SetupSuccess, SetupInProgress, SetupError } from "./SetupScreen";
import { NoLiveness } from "./NoLiveness";

function ProtocolState() {
  const [pageOverride, setPageOverride] = useState<JSX.Element | null>(null);

  const serviceOptedIn = useLoadedState(() => getProtocolOptIn().isOptedIn());
  const completedLiveness = useLoadedState(() =>
    getProtocolOptIn().hasCompletedLiveness(),
  );

  const mnemonicSaved = useLoadedState(() =>
    getMnemonicSave().isMnemonicSaved(),
  );

  const handleError = (err: Error, retry: () => void) => {
    console.error(err);
    if (
      err instanceof CatfishServiceError &&
      err.errorCode === ErrorCode.ERRORS_CATFISH_TOKEN_EXPIRED
    ) {
      // Catfish token expiring means user needs to reconnect the extension.
      // NoLiveness page handles showing the user that prompt when necessary.
      setPageOverride(null);
    } else {
      setPageOverride(<SetupError onRetry={retry} />);
    }
  };

  const optInWithMnemonic = async (mnemonic?: string) => {
    mnemonic = mnemonic || mnemonicGenerate();
    try {
      setPageOverride(
        <SetupInProgress onRetry={() => optInWithMnemonic(mnemonic)} />,
      );

      await getProtocolOptIn().optIn(mnemonic);
      serviceOptedIn.reload();
      completedLiveness.reload();
      getMnemonicSave().mnemonicArr = mnemonic.split(" ");
      setPageOverride(
        <SetupSuccess
          mnemonic={mnemonic}
          onContinue={() => setPageOverride(null)}
        />,
      );
    } catch (e) {
      handleError(e, () => optInWithMnemonic(mnemonic));
    }
  };

  const mnemonicCheck = (phase: string): boolean => {
    const result = getMnemonicSave().checkPhrase(phase);
    if (getMnemonicSave().checked()) {
      mnemonicSaved.reload();
    }
    return result;
  };
  const skip = () => {
    getMnemonicSave()
      .checkMnemonic()
      .then(() => {
        mnemonicSaved.reload();
      });
  };

  const doLiveness = async () => {
    try {
      setPageOverride(<SetupInProgress onRetry={doLiveness} />);

      await getProtocolOptIn().postOptInLiveness();
      completedLiveness.reload();

      setPageOverride(null);
    } catch (e) {
      handleError(e, doLiveness);
    }
  };

  if (pageOverride != null) {
    return pageOverride;
  }

  if (!serviceOptedIn.isLoaded) return <Loading />;
  if (!serviceOptedIn.value) {
    return <OptInForm onOptIn={() => optInWithMnemonic()} />;
  }

  if (!mnemonicSaved.isLoaded) return <Loading />;
  if (!mnemonicSaved.value) {
    const mnemonicArr = getMnemonicSave().getMnemonicArr().slice();
    const shuffled = mnemonicArr.sort(() => Math.random() - 0.5);
    return (
      <MnemonicSavedCheck
        skip={skip}
        checkPhase={mnemonicCheck}
        mnemonic={shuffled}
      />
    );
  }

  if (!completedLiveness.isLoaded) return <Loading />;
  if (!completedLiveness.value) {
    return <NoLiveness onClick={doLiveness} />;
  }

  return <DataScreen />;
}

export function Protocol() {
  return (
    <TopComponent>
      <ProtocolState />
    </TopComponent>
  );
}
