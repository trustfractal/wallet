import { ConnectionCallbacks } from "@pluginTypes/index";

import AppCallbacks from "./AppCallbacks";
import CredentialsCallbacks from "./CredentialsCallbacks";
import ProtocolCallbacks from "./ProtocolCallbacks";

const callbacks: ConnectionCallbacks = {
  ...AppCallbacks,
  ...CredentialsCallbacks,
  ...ProtocolCallbacks,
};

export default callbacks;
