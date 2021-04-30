import ContentScriptConnection from "@background/connection";
import ConnectionTypes from "@models/Connection/types";
import FractalWebpageMiddleware from "@models/Connection/middlewares/FractalWebpageMiddleware";

import AppStore from "@redux/stores/application";
import UserStore from "@redux/stores/user";
import appActions from "@redux/stores/application/reducers/app";
import walletActions, { walletTypes } from "@redux/stores/user/reducers/wallet";
import {
  getTokensContractsAddresses,
  getStakingContractsAddresses,
} from "@redux/stores/application/reducers/app/selectors";

import {
  ERROR_NO_ACTIVE_TAB,
  ERROR_NO_ACCOUNT,
} from "@models/Connection/Errors";
import TokenTypes from "@models/Token/types";
import StakingDetails from "@models/Staking/StakingDetails";

export const connectWallet = () => {
  return async (dispatch) => {
    dispatch(walletActions.connectWalletPending());

    try {
      // ensure that the active port is on the fractal domain
      await new FractalWebpageMiddleware().apply();

      // get active connected chrome port
      const activePort = await ContentScriptConnection.getActiveConnectionPort();

      if (!activePort) throw ERROR_NO_ACTIVE_TAB();

      // get ethereumm wallet account address
      const account = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_ACCOUNT_ADDRESS_INPAGE,
        [],
        activePort.id,
      );

      if (!account) throw ERROR_NO_ACCOUNT();

      // save app setup flag
      AppStore.getStore().dispatch(appActions.setSetup(true));

      // save wallet address on the redux store
      dispatch(walletActions.setAccount(account));
      dispatch(walletActions.connectWalletSuccess());

      const fclTokenContractAddress = getTokensContractsAddresses(
        AppStore.getStore().getState(),
      )[TokenTypes.FCL];
      const fclStakingContractAddress = getStakingContractsAddresses(
        AppStore.getStore().getState(),
      )[TokenTypes.FCL];

      const fclEthTokenContractAddress = getTokensContractsAddresses(
        AppStore.getStore().getState(),
      )[TokenTypes.FCL_ETH_LP];
      const fclEthStakingContractAddress = getStakingContractsAddresses(
        AppStore.getStore().getState(),
      )[TokenTypes.FCL_ETH_LP];

      // update staking details
      const serializedfclStakingDetails = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_STAKING_DETAILS_INPAGE,
        [account, fclTokenContractAddress, fclStakingContractAddress],
        activePort.id,
      );
      const serializedfclEthStakingDetails = await ContentScriptConnection.invoke(
        ConnectionTypes.GET_STAKING_DETAILS_INPAGE,
        [account, fclEthTokenContractAddress, fclEthStakingContractAddress],
        activePort.id,
      );

      // parse staking details
      const fclStakingDetails = StakingDetails.parse(
        serializedfclStakingDetails,
      );
      const fclEthStakingDetails = StakingDetails.parse(
        serializedfclEthStakingDetails,
      );

      // update wallet staking details
      await UserStore.getStore().dispatch(
        walletActions.setStakingDetails({
          details: fclStakingDetails,
          token: TokenTypes.FCL,
        }),
      );
      await UserStore.getStore().dispatch(
        walletActions.setStakingDetails({
          details: fclEthStakingDetails,
          token: TokenTypes.FCL_ETH_LP,
        }),
      );
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
