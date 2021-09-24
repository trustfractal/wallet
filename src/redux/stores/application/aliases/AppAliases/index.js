import appActions, {
  appTypes,
  NETWORKS,
} from "@redux/stores/application/reducers/app";
import { getNetwork } from "@redux/stores/application/reducers/app/selectors";
import metadataActions, {
  MIGRATIONS,
} from "@redux/stores/application/reducers/metadata";

import CredentialsPolling from "@models/Polling/CredentialsPolling";
import MaguroService from "@services/MaguroService";

import WindowsService, {
  PopupSizes,
  PopupSizesValues,
} from "@services/WindowsService";

export const startup = () => {
  return async (dispatch, getState) => {
    // start credentials status polling
    new CredentialsPolling().start();

    // get app version
    // eslint-disable-next-line no-undef
    const { version } = chrome.runtime.getManifest();

    const { protocol_enabled: protocolEnabled, network = NETWORKS.TESTNET } =
      await MaguroService.getConfig();

    dispatch(appActions.setVersion(version));
    dispatch(appActions.setProtocolEnabled(protocolEnabled));
    dispatch(appActions.setLaunched(true));

    // Check for a network change
    const previousNetwork = getNetwork(getState());

    // Check if needs to perform the mainnet launch data migration
    if (network === NETWORKS.MAINNET && previousNetwork === NETWORKS.TESTNET) {
      dispatch(
        metadataActions.addMigration(MIGRATIONS.NETWORK_MAINNET_MIGRATION),
      );
    }

    dispatch(appActions.setNetwork(network));
  };
};

export const setPopupSize = ({
  payload: {
    width = PopupSizesValues[PopupSizes.SMALL].width,
    height = PopupSizesValues[PopupSizes.SMALL].height,
  },
}) => {
  return async () => {
    const popup = await WindowsService.getPopup();
    let popupWidth = width;
    let popupHeight = height;

    if (popup) {
      if (width < PopupSizesValues[PopupSizes.SMALL].width) {
        popupWidth = PopupSizesValues[PopupSizes.SMALL].width;
      }

      if (height < PopupSizesValues[PopupSizes.SMALL].height) {
        popupHeight = PopupSizesValues[PopupSizes.SMALL].height;
      }

      await WindowsService.updateWindowSize(popup.id, popupWidth, popupHeight);
    }
  };
};

const Aliases = {
  [appTypes.STARTUP]: startup,
  [appTypes.SET_POPUP_SIZE]: setPopupSize,
};

export default Aliases;
