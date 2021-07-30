import TopComponent from "@popup/components/common/TopComponent";

import { useAppSelector } from "@redux/stores/application/context";
import { getProtocolOptIn } from "@redux/stores/application/reducers/app/selectors";

import { ProtocolProvider } from "@services/ProtocolService/";

import OptedInScreen from "./OptedInScreen";
import OptInForm from "./OptInForm";

function Protocol() {
  const protocolOptIn = useAppSelector(getProtocolOptIn);

  return (
    <TopComponent>
      {protocolOptIn ? (
        <ProtocolProvider>
          <OptedInScreen />
        </ProtocolProvider>
      ) : (
        <OptInForm />
      )}
    </TopComponent>
  );
}

Protocol.defaultProps = {};

export default Protocol;
