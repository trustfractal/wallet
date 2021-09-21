import { useAppSelector } from "@redux/stores/application/context";
import { getProtocolOptIn } from "@redux/stores/application/reducers/app/selectors";
import { useUserSelector } from "@redux/stores/user/context";
import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";
import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";

import { ProtocolProvider } from "@services/ProtocolService/";

import { ICredential } from "@pluginTypes/index";

import SetupScreen from "./SetupScreen";
import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";
import EmptyValidCredentials from "./EmptyValidCredentials";

function renderProtocol(
  protocolOptIn: boolean,
  registrationState: string,
  credentials: ICredential[],
) {
  if (!protocolOptIn) return <OptInForm />;

  const filteredCredentials = credentials.filter(
    (credential) =>
      credential.level.includes("liveness") ||
      credential.level.includes("protocol"),
  );

  if (filteredCredentials.length === 0) return <EmptyValidCredentials />;

  if (registrationState === protocolRegistrationTypes.COMPLETED)
    return <DataScreen />;

  return <SetupScreen />;
}

function Protocol() {
  const protocolOptIn = useAppSelector(getProtocolOptIn);
  const credentials = useUserSelector(getCredentials);
  const registrationState = useUserSelector(getRegistrationState);

  return (
    <ProtocolProvider>
      {renderProtocol(protocolOptIn, registrationState, credentials)}
    </ProtocolProvider>
  );
}

Protocol.defaultProps = {};

export default Protocol;
