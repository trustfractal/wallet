import UserStore from "@redux/stores/user";

import walletActions from "@redux/stores/user/reducers/wallet";

import { getAccount } from "@redux/stores/user/reducers/wallet/selectors";
import TokenTypes from "@models/Token/types";

const DEFAULT_STAKING_DETAILS_POLLING_INTERVAL = 10 * 1000; // 30 seconds

export default class StakingDetailsPolling {
  private interval: NodeJS.Timeout | undefined;

  public start(
    intervalTime: number = DEFAULT_STAKING_DETAILS_POLLING_INTERVAL,
  ) {
    this.interval = setInterval(async () => {
      console.log("staking details start");

      console.log("initialized", await UserStore.isInitialized());

      // check if the user store is available
      if (!(await UserStore.isInitialized())) {
        return;
      }

      console.log("state", UserStore.getStore().getState());
      console.log("wallet", UserStore.getStore().getState()?.wallet);
      console.log("account", UserStore.getStore().getState()?.wallet?.account);

      // check if the user is connected
      const account = getAccount(UserStore.getStore().getState());
      if (account.length === 0) {
        return;
      }

      // fetch staking details
      UserStore.getStore().dispatch(
        walletActions.fetchStakingDetails(TokenTypes.FCL),
      );
      UserStore.getStore().dispatch(
        walletActions.fetchStakingDetails(TokenTypes.FCL_ETH_LP),
      );
      console.log("staking details end");
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
