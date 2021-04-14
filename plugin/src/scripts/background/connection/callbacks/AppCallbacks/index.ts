import AppStore from "@redux/stores/application";

import appActions from "@redux/stores/application/reducers/app";

import ConnectionTypes from "@models/Connection/types";

export const setWalletAvailable = () =>
  AppStore.getStore().dispatch(appActions.setWalletAvailability(true));

export const setWalletUnavailable = () =>
  AppStore.getStore().dispatch(appActions.setWalletAvailability(false));

const Callbacks = {
  [ConnectionTypes.REPORT_WALLET_AVAILABLE]: setWalletAvailable,
  [ConnectionTypes.REPORT_WALLET_UNAVAILABLE]: setWalletUnavailable,
};

export default Callbacks;
