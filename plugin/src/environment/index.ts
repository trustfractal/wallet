import { Environment } from "@fractalwallet/types";

const {
  REACT_APP_GOLDFISH_URL: GOLDFISH_URL = "",
  REACT_APP_FRACTAL_WEBSITE_HOSTNAME: FRACTAL_WEBSITE_HOSTNAME = "",
  REACT_APP_ETHEREUM_RPC_URL: ETHEREUM_RPC_URL = "",
  NODE_ENV: IS_DEV,
} = process.env;

const environment: Environment = {
  GOLDFISH_URL,
  FRACTAL_WEBSITE_HOSTNAME,
  ETHEREUM_RPC_URL,
  IS_DEV: IS_DEV === undefined || IS_DEV === "development",
};

export default environment;
