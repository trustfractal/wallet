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
