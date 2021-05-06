import { ConnectionCallbacks } from "@pluginTypes/index";

import CredentialsCallbacks from "./CredentialsCallbacks";
import WalletCallbacks from "./WalletCallbacks";

const callbacks: ConnectionCallbacks = {
  ...CredentialsCallbacks,
  ...WalletCallbacks,
};

export default callbacks;
