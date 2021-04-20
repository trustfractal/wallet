import { IConnectionCallbacks } from "@fractalwallet/types";

import CredentialsCallbacks from "./CredentialsCallbacks";

const callbacks: IConnectionCallbacks = {
  ...CredentialsCallbacks,
};

export default callbacks;
