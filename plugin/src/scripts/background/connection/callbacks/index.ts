import { ConnectionCallbacks } from "@fractalwallet/types";

import AppCallbacks from "./AppCallbacks";
import CredentialsCallbacks from "./CredentialsCallbacks";
import WalletCallbacks from "./WalletCallbacks";

const callbacks: ConnectionCallbacks = {
  ...AppCallbacks,
  ...CredentialsCallbacks,
  ...WalletCallbacks,
};

export default callbacks;
