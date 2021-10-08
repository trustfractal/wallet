import { useState } from "react";

import { useLoadedState } from "@utils/ReactHooks";
import { getProtocolOptIn } from "@services/Factory";
import {
  CatfishServiceError,
  ErrorCode,
} from "@services/CatfishService/Errors";
import TopComponent from "@popup/components/common/TopComponent";

import Loading from "@popup/components/Loading";
import DataScreen from "./DataScreen";
import { OptInForm } from "./OptInForm";
import MnemonicPicker from "./MnemonicPicker";
import { SetupSuccess, SetupInProgress, SetupError } from "./SetupScreen";
import { NoLiveness } from "./NoLiveness";

function ProtocolState() {
  const [pageOverride, setPageOverride] = useState<JSX.Element | null>(null);

  const [manualOptIn, setManualOptIn] = useState(false);
  const serviceOptedIn = useLoadedState(() => getProtocolOptIn().isOptedIn());
  const completedLiveness = useLoadedState(() =>
    getProtocolOptIn().hasCompletedLiveness(),
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

  const optInWithMnemonic = async (mnemonic: string) => {
    try {
      setPageOverride(
        <SetupInProgress onRetry={() => optInWithMnemonic(mnemonic)} />,
      );

      await getProtocolOptIn().optIn(mnemonic);
      serviceOptedIn.reload();
      completedLiveness.reload();

      setPageOverride(
        <SetupSuccess onContinue={() => setPageOverride(null)} />,
      );
    } catch (e) {
      handleError(e, () => optInWithMnemonic(mnemonic));
    }
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
  const optedIn = manualOptIn || serviceOptedIn.value;
  if (!optedIn) {
    return <OptInForm onOptIn={() => setManualOptIn(true)} />;
  }
  if (!serviceOptedIn.value) {
    return <MnemonicPicker onMnemonicPicked={optInWithMnemonic} />;
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
