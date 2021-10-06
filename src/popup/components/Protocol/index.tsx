import { useState } from "react";

import { useCachedState } from "@utils/ReactHooks";
import { getValueCache, getProtocolOptIn } from "@services/Factory";
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
  const serviceOptedIn = useCachedState({
    cache: getValueCache(),
    key: 'service-opted-in',
    loader: () => getProtocolOptIn().isOptedIn(),
  });
  const completedLiveness = useCachedState({
    cache: getValueCache(),
    key: 'completed-liveness',
    loader: () => getProtocolOptIn().hasCompletedLiveness(),
  });

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
