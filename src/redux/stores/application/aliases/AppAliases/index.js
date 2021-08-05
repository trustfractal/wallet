import appActions, { appTypes } from "@redux/stores/application/reducers/app";

import CredentialsPolling from "@models/Polling/CredentialsPolling";

import WindowsService, {
  PopupSizes,
  PopupSizesValues,
} from "@services/WindowsService";

export const startup = () => {
  return async (dispatch) => {
    // start credentials status polling
    new CredentialsPolling().start();

    // get app version
    // eslint-disable-next-line no-undef
    const { version } = chrome.runtime.getManifest();

    dispatch(appActions.setVersion(version));
    dispatch(appActions.setLaunched(true));
  };
};

export const setPopupSize = ({ payload: { width, height } }) => {
  return async () => {
    const popup = await WindowsService.getPopup();
    let popupWidth = width;
    let popupHeight = height;

    if (popup) {
      if (
        width !== undefined &&
        width < PopupSizesValues[PopupSizes.SMALL].width
      ) {
        popupWidth = PopupSizesValues[PopupSizes.SMALL].width;
      }

      if (
        height !== undefined &&
        height < PopupSizesValues[PopupSizes.SMALL].height
      ) {
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
