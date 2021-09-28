import { useState, useEffect } from "react";
import { useUserSelector } from "@redux/stores/user/context";
import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import { getProtocolOptIn } from "@services/Factory";
import { ProtocolProvider } from "@services/ProtocolService/";

import SetupScreen from "./SetupScreen";
import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";
import MnemonicPicker from "./MnemonicPicker";

function ProtocolState() {
  const [optedIn, setOptedIn] = useState(false);
  const [serviceOptedIn, setServiceOptedIn] = useState(false);

  useAsync(
    async () => await getProtocolOptIn().isOptedIn(),
    optedIn => {
      if (optedIn) setOptedIn(true);
      setServiceOptedIn(optedIn);
    }
  );

  const registrationState = useUserSelector(getRegistrationState);

  if (!optedIn) {
    return <OptInForm onOptIn={() => setOptedIn(true)} />;
  }
  if (!serviceOptedIn) {
    const optInWithMnemonic = async (mnemonic: string) => {
      await getProtocolOptIn().optIn(mnemonic);
    };
    return <MnemonicPicker onMnemonicPicked={optInWithMnemonic} />;
  }

  if (registrationState !== protocolRegistrationTypes.COMPLETED) {
    return <SetupScreen />;
  }

  return <DataScreen />;
}

function useAsync<T>(asyncFn: () => Promise<T>, onSuccess: (t: T) => void) {
  useEffect(() => {
    let isActive = true;
    asyncFn().then(data => {
      if (isActive) onSuccess(data);
    });
    return () => { isActive = false };
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
