import UserStore from "@redux/stores/user";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

const DEFAULT_CREDENTIALSS_VALIDITY_POLLING_INTERVAL = 10 * 1000; // 30 seconds

export default class CredentialsValidityPolling {
  private interval: NodeJS.Timeout | undefined;

  public start(
    intervalTime: number = DEFAULT_CREDENTIALSS_VALIDITY_POLLING_INTERVAL,
  ) {
    this.interval = setInterval(async () => {
      console.log("credentials details start");

      console.log("initialized", await UserStore.isInitialized());

      // check if the user store is available
      if (!(await UserStore.isInitialized())) {
        return;
      }

      console.log("state", UserStore.getStore().getState());

      // check if the user is connected
      const credentials: CredentialsCollection = getCredentials(
        UserStore.getStore().getState(),
      );

      if (credentials.length === 0) {
        return;
      }

      // fetch credential validity
      for (const credential of credentials) {
        UserStore.getStore().dispatch(
          credentialsActions.fetchCredentialValidity(credential.level),
        );
      }

      console.log("credentials details end");
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
