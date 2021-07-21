import UserStore from "@redux/stores/user";
import AppStore from "@redux/stores/application";

import credentialsActions from "@redux/stores/user/reducers/credentials";

import { getCredentials } from "@redux/stores/user/reducers/credentials/selectors";
import CredentialsCollection from "@models/Credential/CredentialsCollection";
import CredentialsVersions from "@models/Credential/versions";
import { isSetup } from "@redux/stores/application/reducers/app/selectors";

const DEFAULT_CREDENTIALS_POLLING_INTERVAL_IN_MILLIS = 15 * 60 * 1000; // 15 minutes

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
    UserStore.getStore().dispatch(credentialsActions.fetchCredentialsList());
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
