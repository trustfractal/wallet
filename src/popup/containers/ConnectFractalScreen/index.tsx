import { useHistory } from "react-router";

import ConnectFractal from "@popup/components/ConnectFractal";

import authActions from "@redux/stores/application/reducers/auth";

import {
  isConnectFractalLoading,
  getConnectFractalError,
} from "@redux/stores/application/reducers/auth/selectors";
import RoutesPaths from "@popup/routes/paths";
import {
  useAppDispatch,
  useAppSelector,
} from "@redux/stores/application/context";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

function ConnectFractalScreen() {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const isLoading = useAppSelector(isConnectFractalLoading);
  const error = useAppSelector(getConnectFractalError);
  const setup = useAppSelector(isSetup);

  const onConnect = () => dispatch(authActions.connectFractalRequest());

  if (setup) {
    history.replace(RoutesPaths.WALLET);
  }

  return (
    <ConnectFractal onNext={onConnect} error={error} loading={isLoading} />
  );
}

export default ConnectFractalScreen;
