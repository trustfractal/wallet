import { Environment } from "@pluginTypes/index";

const {
  REACT_APP_CATFISH_URL: CATFISH_URL = "",
  REACT_APP_GOLDFISH_URL: GOLDFISH_URL = "",
  REACT_APP_FRACTAL_WEBSITE_URL: FRACTAL_WEBSITE_URL = "",
  REACT_APP_MAGURO_URL: MAGURO_URL = "",
  REACT_APP_PROTOCOL_RPC_ENDPOINT: PROTOCOL_RPC_ENDPOINT = "",
  NODE_ENV: IS_DEV,
} = process.env;

const environment: Environment = {
  CATFISH_URL,
  GOLDFISH_URL,
  FRACTAL_WEBSITE_URL,
  MAGURO_URL,
  IS_DEV: IS_DEV === undefined || IS_DEV === "development",
  PROTOCOL_RPC_ENDPOINT,
};

export default environment;
