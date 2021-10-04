import { useState } from "react";

import { useLoadedState } from "@utils/ReactHooks";
import { getProtocolOptIn } from "@services/Factory";
import TopComponent from "@popup/components/common/TopComponent";

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

  const optInWithMnemonic = async (mnemonic: string) => {
    try {
      setPageOverride(
        <SetupInProgress onRetry={() => optInWithMnemonic(mnemonic)} />,
      );
      await getProtocolOptIn().optIn(mnemonic);
      serviceOptedIn.setValue(true);
      setPageOverride(
        <SetupSuccess onContinue={() => setPageOverride(null)} />,
      );
    } catch (e) {
      console.error(e);
      setPageOverride(
        <SetupError onRetry={() => optInWithMnemonic(mnemonic)} />,
      );
    }
  };

  const doLiveness = async () => {
    try {
      setPageOverride(<SetupInProgress onRetry={doLiveness} />);
      await getProtocolOptIn().postOptInLiveness();
      setPageOverride(null);
    } catch (e) {
      console.error(e);
      setPageOverride(<SetupError onRetry={doLiveness} />);
    }
  };

  if (pageOverride != null) {
    return pageOverride;
  }

  if (!serviceOptedIn.isLoaded) return null;
  const optedIn = manualOptIn || serviceOptedIn.value;
  if (!optedIn) {
    return <OptInForm onOptIn={() => setManualOptIn(true)} />;
  }
  if (!serviceOptedIn.value) {
    return <MnemonicPicker onMnemonicPicked={optInWithMnemonic} />;
  }

  if (!completedLiveness.isLoaded) return null;
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
