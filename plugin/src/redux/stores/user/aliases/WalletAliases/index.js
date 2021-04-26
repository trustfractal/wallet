import ContentScriptConnection from "@background/connection";
import ConnectionTypes from "@models/Connection/types";
import { ensureIsOnFractalWebpage } from "@models/Connection/middlewares/FractalWebpageMiddleware";

import walletActions, { walletTypes } from "@redux/stores/user/reducers/wallet";
import AppStore from "@redux/stores/application";
import appActions from "@redux/stores/application/reducers/app";

export const connectWallet = () => {
  return async (dispatch) => {
    dispatch(walletActions.connectWalletPending());

    try {
      // get active connected chrome port
      const activePort = await ContentScriptConnection.getActiveConnectionPort();

      if (!activePort) {
        throw new Error("No active tabs could be found");
      }

      // ensure that the active port is on the fractal domain
      const { port, id } = activePort;

      ensureIsOnFractalWebpage(port);

      // get ethereumm wallet account address
      const account = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_ACCOUNT_ADDRESS,
        [],
        id,
      );

      if (!account) {
        throw new Error("No accounts could be found");
      }

      // save app setup flag
      AppStore.getStore().dispatch(appActions.setSetup(true));

      // save wallet address on the redux store
      dispatch(walletActions.setAccount(account));
      dispatch(walletActions.connectWalletSuccess());
    } catch (error) {
      console.error(error);
      dispatch(walletActions.connectWalletFailed(error.message));
    }
  };
};

const Aliases = {
  [walletTypes.CONNECT_WALLET_REQUEST]: connectWallet,
};

export default Aliases;
