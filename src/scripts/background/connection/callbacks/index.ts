import { ConnectionCallbacks } from "@pluginTypes/index";

import AppCallbacks from "./AppCallbacks";
import CredentialsCallbacks from "./CredentialsCallbacks";
import WalletCallbacks from "./WalletCallbacks";

const callbacks: ConnectionCallbacks = {
  ...AppCallbacks,
  ...CredentialsCallbacks,
  ...WalletCallbacks,
};

export default callbacks;
