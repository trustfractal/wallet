import ContentScriptConnection from "@background/connection";
import ConnectionTypes from "@models/Connection/types";

import registerActions, {
  registerTypes,
} from "@redux/stores/application/reducers/register";

export const walletSetup = () => {
  return async (dispatch) => {
    dispatch(registerActions.walletSetupPending());

    try {
      // get active connected chrome port
      const activePort = await ContentScriptConnection.getActiveConnectionPort();

      if (!activePort) {
        throw new Error("No active tabs could be found");
      }

      // get ethereumm wallet account address
      const account = await ContentScriptConnection.invoke(
        activePort.id,
        ConnectionTypes.GET_ACCOUNT_ADDRESS,
      );

      if (!account) {
        throw new Error("No accounts could be found");
      }

      // save wallet address on the redux store
      dispatch(registerActions.setRegisterAccount(account));
      dispatch(registerActions.walletSetupSuccess());
    } catch (error) {
      console.error(error);
      dispatch(registerActions.walletSetupFailed(error.message));
    }
  };
};

const Aliases = {
  [registerTypes.WALLET_SETUP_REQUEST]: walletSetup,
};

export default Aliases;
