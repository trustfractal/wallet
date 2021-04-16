import { IConnectionCallbacks } from "@fractalwallet/types";

import WalletCallbacks from "./WalletCallbacks";

const callbacks: IConnectionCallbacks = {
  ...WalletCallbacks,
};

export default callbacks;
