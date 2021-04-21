import { ConnectionCallbacks } from "@fractalwallet/types";

import WalletCallbacks from "./WalletCallbacks";

const callbacks: ConnectionCallbacks = {
  ...WalletCallbacks,
};

export default callbacks;
