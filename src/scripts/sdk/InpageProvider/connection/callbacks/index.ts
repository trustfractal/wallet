import { ConnectionCallbacks } from "@pluginTypes/index";

import FractalCallbacks from "./FractalCallbacks";

const callbacks: ConnectionCallbacks = {
  ...FractalCallbacks,
};

export default callbacks;
