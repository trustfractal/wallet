import UserStore from "@redux/stores/user";

import walletActions from "@redux/stores/user/reducers/wallet";

import {
  getAccount,
  getStakingLastUpdated,
} from "@redux/stores/user/reducers/wallet/selectors";
import TokenTypes from "@models/Token/types";

const DEFAULT_STAKING_DETAILS_POLLING_INTERVAL_IN_MILLIS = 30 * 1000; // 30 seconds

export default class StakingDetailsPolling {
  private interval: NodeJS.Timeout | undefined;

  public start(
    intervalTime: number = DEFAULT_STAKING_DETAILS_POLLING_INTERVAL_IN_MILLIS,
  ) {
    this.interval = setInterval(async () => {
      // check if the user store is available
      if (!(await UserStore.isInitialized())) {
        return;
      }

      // check if the user is connected
      const account = getAccount(UserStore.getStore().getState());
      if (account.length === 0) {
        return;
      }

      const lastUpdatedInMillis = getStakingLastUpdated(
        UserStore.getStore().getState(),
      );
      const currentTimeInMillis = new Date().getTime();

      // check if it needs to updated
      if (
        lastUpdatedInMillis +
          DEFAULT_STAKING_DETAILS_POLLING_INTERVAL_IN_MILLIS >
        currentTimeInMillis
      ) {
        return;
      }

      // fetch staking details
      UserStore.getStore().dispatch(
        walletActions.fetchStakingDetails(TokenTypes.FCL),
      );
      UserStore.getStore().dispatch(
        walletActions.fetchStakingDetails(TokenTypes.FCL_ETH_LP),
      );
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
