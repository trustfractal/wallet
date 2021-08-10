import { createSelector } from "reselect";

import Wallet from "@models/Wallet";

export const getWallet = createSelector(
  (state) => state.protocol,
  (protocol) =>
    protocol.mnemonic ? Wallet.fromMnemonic(protocol.mnemonic) : undefined,
);

export const isRegisteredForMinting = createSelector(
  (state) => state.protocol,
  (protocol) => protocol.registeredForMinting,
);

export const getRegistrationState = createSelector(
  (state) => state.protocol,
  (protocol) => protocol.registrationState,
);

export const hasRegistrationErrored = createSelector(
  (state) => state.protocol,
  (protocol) => protocol.registrationError,
);
