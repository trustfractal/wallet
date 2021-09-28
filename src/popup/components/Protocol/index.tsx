import { useState, useEffect } from "react";
import { useUserSelector } from "@redux/stores/user/context";
import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import { getProtocolOptIn } from "@services/Factory";
import { ProtocolProvider } from "@services/ProtocolService/";

import SetupScreen from "./SetupScreen";
import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";

function ProtocolState() {
  const [optedIn, setOptedIn] = useState(false);

  useAsyncEffect(async () => {
    const optedIn = await getProtocolOptIn().isOptedIn();
    if (optedIn) setOptedIn(true);
  });

  const registrationState = useUserSelector(getRegistrationState);

  if (!optedIn) {
    return <OptInForm onOptIn={() => setOptedIn(true)} />;
  }

  if (registrationState !== protocolRegistrationTypes.COMPLETED) {
    return <SetupScreen />;
  }

  return <DataScreen />;
}

function useAsyncEffect(cb: () => Promise<void>) {
  useEffect(() => {
    cb();
  });
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
