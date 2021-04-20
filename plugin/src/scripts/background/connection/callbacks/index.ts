import { ConnectionCallbacks } from "@fractalwallet/types";

import AppCallbacks from "./AppCallbacks";
import CredentialsCallbacks from "./CredentialsCallbacks";

const callbacks: ConnectionCallbacks = {
  ...AppCallbacks,
  ...CredentialsCallbacks,
};

export default callbacks;
