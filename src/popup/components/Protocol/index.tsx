import { useState, useEffect } from "react";

import { getProtocolOptIn } from "@services/Factory";
import { ProtocolProvider } from "@services/ProtocolService/";

import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";
import MnemonicPicker from "./MnemonicPicker";
import { SetupSuccess, SetupInProgress, SetupError } from "./SetupScreen";

function ProtocolState() {
  const [pageOverride, setPageOverride] = useState<JSX.Element | null>(null);

  const [optedIn, setOptedIn] = useState(false);
  const [serviceOptedIn, setServiceOptedIn] = useState(false);

  useAsync(
    async () => await getProtocolOptIn().isOptedIn(),
    (optedIn) => {
      if (optedIn) setOptedIn(true);
      setServiceOptedIn(optedIn);
    },
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

  if (pageOverride != null) {
    return pageOverride;
  }

  if (!optedIn) {
    return <OptInForm onOptIn={() => setOptedIn(true)} />;
  }
  if (!serviceOptedIn) {
    return <MnemonicPicker onMnemonicPicked={optInWithMnemonic} />;
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

function Protocol() {
  return (
    <ProtocolProvider>
      <ProtocolState />
    </ProtocolProvider>
  );
}

Protocol.defaultProps = {};

export default Protocol;
