import UserStore from "@redux/stores/user";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import CredentialsCollection from "@models/Credential/CredentialsCollection";

const DEFAULT_CREDENTIALSS_VALIDITY_POLLING_INTERVAL_IN_MILLIS = 30 * 1000; // 30 seconds

export default class CredentialsStatusPolling {
  private interval: NodeJS.Timeout | undefined;

  public start(
    intervalTime: number = DEFAULT_CREDENTIALSS_VALIDITY_POLLING_INTERVAL_IN_MILLIS,
  ) {
    this.interval = setInterval(async () => {
      // check if the user store is available
      if (!(await UserStore.isInitialized())) {
        return;
      }

      const credentials: CredentialsCollection = getCredentials(
        UserStore.getStore().getState(),
      );

      // fetch credential validity
      for (const credential of credentials) {
        UserStore.getStore().dispatch(
          credentialsActions.fetchCredentialStatus(credential.id),
        );
      }
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
