import TopComponent from "@popup/components/common/TopComponent";

import { useAppSelector } from "@redux/stores/application/context";
import { getProtocolOptIn } from "@redux/stores/application/reducers/app/selectors";
import { useUserSelector } from "@redux/stores/user/context";
import { protocolRegistrationTypes } from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import { ProtocolProvider } from "@services/ProtocolService/";

import SetupScreen from "./SetupScreen";
import DataScreen from "./DataScreen";
import OptInForm from "./OptInForm";

interface RegistrationRouterProps {
  protocolOptIn: boolean;
  registrationState: string;
}

function RegistrationRouter({
  protocolOptIn,
  registrationState,
}: RegistrationRouterProps) {
  if (!protocolOptIn) return <OptInForm />;

  if (registrationState === protocolRegistrationTypes.COMPLETED)
    return <DataScreen />;

  return <SetupScreen />;
}

function Protocol() {
  const protocolOptIn = useAppSelector(getProtocolOptIn);
  const registrationState = useUserSelector(getRegistrationState);

  return (
    <TopComponent>
      <ProtocolProvider>
        <RegistrationRouter
          protocolOptIn={protocolOptIn}
          registrationState={registrationState}
        />
      </ProtocolProvider>
    </TopComponent>
  );
}

Protocol.defaultProps = {};

export default Protocol;
