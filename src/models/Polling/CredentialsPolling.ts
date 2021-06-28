import UserStore from "@redux/stores/user";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import CredentialsVersions from "@models/Credential/versions";

const DEFAULT_CREDENTIALS_POLLING_INTERVAL_IN_MILLIS = 30 * 1000; // 30 seconds

export default class CredentialsPolling {
  private interval: NodeJS.Timeout | undefined;

  public fetchLegacyCredentialsStatus() {
    const credentials: CredentialsCollection = getCredentials(
      UserStore.getStore().getState(),
    );

    // filter only legacy credentials
    const legacyCredentials = credentials.filterByField(
      "version",
      CredentialsVersions.VERSION_ONE,
    );

    // fetch credential status
    for (const credential of legacyCredentials) {
      UserStore.getStore().dispatch(
        credentialsActions.fetchCredentialStatus(credential.id),
      );
    }
  }

  public fetchCredentialsList() {
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

      this.fetchLegacyCredentialsStatus();
      this.fetchCredentialsList();
    }, intervalTime);
  }

  public async stop() {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
    }
  }
}
