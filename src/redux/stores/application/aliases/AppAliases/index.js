import AppStore from "@redux/stores/application";
import appActions, {
  appTypes,
  NETWORKS,
} from "@redux/stores/application/reducers/app";
import { getNetwork } from "@redux/stores/application/reducers/app/selectors";
import metadataActions, {
  MIGRATIONS,
} from "@redux/stores/application/reducers/metadata";

import UserStore from "@redux/stores/user";
import credentialsActions from "@redux/stores/user/reducers/credentials";

import CredentialsPolling from "@models/Polling/CredentialsPolling";
import { getMaguroService, getWindowsService } from "@services/Factory";

import { PopupSizes, PopupSizesValues } from "@services/WindowsService";

export const startup = () => {
  return async (dispatch) => {
    // start credentials status polling
    new CredentialsPolling().start();

    // get app version
    // eslint-disable-next-line no-undef
    const { version } = chrome.runtime.getManifest();
    dispatch(appActions.setVersion(version));

    // fetch maguro's config
    await fetchConfig()();

    dispatch(appActions.setLaunched(true));
  };
};

export const setPopupSize = ({
  payload: {
    width = PopupSizesValues[PopupSizes.SMALL].width,
    height = PopupSizesValues[PopupSizes.SMALL].height,
  },
}) => {
  return async () => {
    const popup = await getWindowsService().getPopup();
    let popupWidth = width;
    let popupHeight = height;

    if (popup) {
      if (width < PopupSizesValues[PopupSizes.SMALL].width) {
        popupWidth = PopupSizesValues[PopupSizes.SMALL].width;
      }

      if (height < PopupSizesValues[PopupSizes.SMALL].height) {
        popupHeight = PopupSizesValues[PopupSizes.SMALL].height;
      }

      await getWindowsService().updateWindowSize(
        popup.id,
        popupWidth,
        popupHeight,
      );
    }
  };
};

export const fetchConfig = () => {
  return async () => {
    const {
      protocol_enabled: protocolEnabled,
      network = NETWORKS.TESTNET,
      liveness_check_enabled: livenessCheckEnabled,
    } = await getMaguroService().getConfig();

    AppStore.getStore().dispatch(
      appActions.setProtocolEnabled(protocolEnabled),
    );
    AppStore.getStore().dispatch(
      appActions.setLivenessCheckEnabled(livenessCheckEnabled),
    );

    // Check for a network change
    const previousNetwork = getNetwork(AppStore.getStore().getState());

    // Check if needs to perform the mainnet launch data migration
    if (network === NETWORKS.MAINNET && previousNetwork === NETWORKS.TESTNET) {
      AppStore.getStore().dispatch(
        metadataActions.addMigration(MIGRATIONS.NETWORK_MAINNET_MIGRATION),
      );

      // Check if user store is initialized, a.k.a, user has logged in
      // to automatically run the migration
      const isInitialized = await UserStore.isInitialized();
      if (isInitialized) {
        AppStore.getStore().dispatch(metadataActions.runMigrations());
      }
    }

    AppStore.getStore().dispatch(appActions.setNetwork(network));
  };
};

export const refresh = () => {
  return async () => {
    AppStore.getStore().dispatch(appActions.fetchConfig());
    UserStore.getStore().dispatch(
      credentialsActions.fetchCredentialsAndVerificationCases(),
    );
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
  [appTypes.SET_POPUP_SIZE]: setPopupSize,
  [appTypes.FETCH_CONFIG]: fetchConfig,
  [appTypes.REFRESH]: refresh,
};

export default Aliases;
