import { Environment } from "@pluginTypes/index";

const CATFISH_URL =
  process.env.REACT_APP_CATFISH_URL ||
  "https://auth.staging.sandbox.fractal.id";
const GOLDFISH_URL =
  process.env.REACT_APP_GOLDFISH_URL ||
  "https://did.staging.sandbox.fractal.id";
const FRACTAL_WEBSITE_URL =
  process.env.REACT_APP_FRACTAL_WEBSITE_URL ||
  "https://staging.sandbox.fractal.id";

const MAGURO_URL =
  process.env.REACT_APP_MAGURO_URL ||
  "https://maguro.staging.sandbox.fractal.id";
const PROTOCOL_RPC_ENDPOINT =
  process.env.REACT_APP_PROTOCOL_RPC_ENDPOINT ||
  "wss://main.devnet.fractalprotocol.com";

const NODE_ENV = process.env.NODE_ENV || "development";

const environment: Environment = {
  CATFISH_URL,
  GOLDFISH_URL,
  FRACTAL_WEBSITE_URL,
  MAGURO_URL,
  IS_DEV: NODE_ENV === "development",
  PROTOCOL_RPC_ENDPOINT,
};

export default environment;
