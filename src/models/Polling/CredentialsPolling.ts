import UserStore from "@redux/stores/user";
import AppStore from "@redux/stores/application";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import { isSetup } from "@redux/stores/application/reducers/app/selectors";

const DEFAULT_CREDENTIALS_POLLING_INTERVAL_IN_MILLIS = 15 * 60 * 1000; // 15 minutes

export default class CredentialsPolling {
  private interval: NodeJS.Timeout | undefined;

  public fetchCredentials() {
    UserStore.getStore().dispatch(credentialsActions.fetchCredentials());
  }

  public start(
    intervalTime: number = DEFAULT_CREDENTIALS_POLLING_INTERVAL_IN_MILLIS,
  ) {
    this.interval = setInterval(async () => {
      // check if the user store is available
      if (!(await UserStore.isInitialized())) {
        return;
      }

      const setup = isSetup(AppStore.getStore().getState());

      if (!setup) {
        return;
      }

      this.fetchCredentials();
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
