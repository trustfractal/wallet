import { IConnectionCallbacks } from "@fractalwallet/types";

import AppCallbacks from "./AppCallbacks";
import CredentialsCallbacks from "./CredentialsCallbacks";

const callbacks: IConnectionCallbacks = {
  ...AppCallbacks,
  ...CredentialsCallbacks,
};

export default callbacks;
