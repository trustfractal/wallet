import { useState, useEffect } from "react";

import { getProtocolOptIn } from "@services/Factory";
import TopComponent from "@popup/components/common/TopComponent";

import DataScreen from "./DataScreen";
import { OptInForm } from "./OptInForm";
import MnemonicPicker from "./MnemonicPicker";
import { SetupSuccess, SetupInProgress, SetupError } from "./SetupScreen";
import { NoLiveness } from "./NoLiveness";

function ProtocolState() {
  const [pageOverride, setPageOverride] = useState<JSX.Element | null>(null);

  const [optedIn, setOptedIn] = useState(false);
  const [serviceOptedIn, setServiceOptedIn] = useState<boolean | undefined>();
  const [completedLiveness, setCompletedLiveness] = useState<
    boolean | undefined
  >();

  useAsync(
    async () => await getProtocolOptIn().isOptedIn(),
    (optedIn) => {
      if (optedIn) setOptedIn(true);
      setServiceOptedIn(optedIn);
    },
  );

  useAsync(
    async () => await getProtocolOptIn().hasCompletedLiveness(),
    setCompletedLiveness,
  );

  const optInWithMnemonic = async (mnemonic: string) => {
    try {
      setPageOverride(
        <SetupInProgress onRetry={() => optInWithMnemonic(mnemonic)} />,
      );
      await getProtocolOptIn().optIn(mnemonic);
      setServiceOptedIn(true);
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

  if ([serviceOptedIn, completedLiveness].some((v) => v == null)) {
    return <></>;
  }

  if (!optedIn) {
    return <OptInForm onOptIn={() => setOptedIn(true)} />;
  }
  if (!serviceOptedIn) {
    return <MnemonicPicker onMnemonicPicked={optInWithMnemonic} />;
  }
  if (!completedLiveness) {
    return <NoLiveness onClick={doLiveness} />;
  }

  return <DataScreen />;
}

function useAsync<T>(asyncFn: () => Promise<T>, onSuccess: (t: T) => void) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((data) => {
      if (isActive) onSuccess(data);
    });
    return () => {
      isActive = false;
    };
  }, [asyncFn, onSuccess]);
}

export function Protocol() {
  return (
    <TopComponent>
      <ProtocolState />
    </TopComponent>
  );
}
