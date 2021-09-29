import { useState, useEffect } from "react";

import { getProtocolOptIn } from "@services/Factory";
import { ProtocolProvider } from "@services/ProtocolService/";

import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";
import MnemonicPicker from "./MnemonicPicker";

function ProtocolState() {
  const [optedIn, setOptedIn] = useState(false);
  const [serviceOptedIn, setServiceOptedIn] = useState(false);

  useAsync(
    async () => await getProtocolOptIn().isOptedIn(),
    (optedIn) => {
      if (optedIn) setOptedIn(true);
      setServiceOptedIn(optedIn);
    },
  );

  if (!optedIn) {
    return <OptInForm onOptIn={() => setOptedIn(true)} />;
  }
  if (!serviceOptedIn) {
    const optInWithMnemonic = async (mnemonic: string) => {
      await getProtocolOptIn().optIn(mnemonic);
      setServiceOptedIn(true);
    };
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
