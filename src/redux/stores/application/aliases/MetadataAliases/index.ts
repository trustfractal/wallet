import UserStore from "@redux/stores/user";
import protocolActions, {
  protocolRegistrationTypes,
} from "@redux/stores/user/reducers/protocol";
import { getRegistrationState } from "@redux/stores/user/reducers/protocol/selectors";

import AppStore from "@redux/stores/application";
import appActions from "@redux/stores/application/reducers/app";
import metadataActions, {
  MIGRATIONS,
} from "@redux/stores/application/reducers/metadata";
import { metadataTypes } from "@redux/stores/application/reducers/metadata";
import { getMigrations } from "@redux/stores/application/reducers/metadata/selectors";

const runMigrations = () => {
  return async () => {
    const migrations = getMigrations(AppStore.getStore().getState());

    // Check if has to run generated wallet data migration
    if (migrations.includes(MIGRATIONS.GENERATED_WALLET_MIGRATION)) {
      // Check if protocol state is completed
      const registrationState = getRegistrationState(
        UserStore.getStore().getState(),
      );

      if (
        registrationState === protocolRegistrationTypes.IDENTITY_REGISTERED ||
        registrationState === protocolRegistrationTypes.MINTING_REGISTERED ||
        registrationState === protocolRegistrationTypes.COMPLETED
      ) {
        AppStore.getStore().dispatch(appActions.setWalletGenerated(true));
      }

      // Remove migration from array
      const index = migrations.findIndex(
        (element: number) => element === MIGRATIONS.GENERATED_WALLET_MIGRATION,
      );
      if (index >= 0) {
        migrations.splice(index, 1);
      }
    }

    // Check if has to run network migration
    if (migrations.includes(MIGRATIONS.NETWORK_MAINNET_MIGRATION)) {
      // Clear user store
      UserStore.getStore().dispatch(protocolActions.setMnemonic(null));
      UserStore.getStore().dispatch(
        protocolActions.setRegisteredForMinting(false),
      );
      UserStore.getStore().dispatch(protocolActions.setRegistrationState(null));
      UserStore.getStore().dispatch(
        protocolActions.setRegistrationError(false),
      );

      // Clear app store
      AppStore.getStore().dispatch(appActions.setWalletGenerated(false));
      AppStore.getStore().dispatch(appActions.setProtocolOptIn(false));

      // Remove migration from array
      const index = migrations.findIndex(
        (element: number) => element === MIGRATIONS.NETWORK_MAINNET_MIGRATION,
      );
      if (index >= 0) {
        migrations.splice(index, 1);
      }
    }

    // Update migrations
    AppStore.getStore().dispatch(metadataActions.setMigrations(migrations));
  };
};

const Aliases = {
  [metadataTypes.RUN_MIGRATIONS]: runMigrations,
};

export default Aliases;
