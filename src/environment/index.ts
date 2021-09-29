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
const LIVENESS_JOURNEY_URL =
  process.env.REACT_APP_LIVENESS_JOURNEY_URL ||
  "https://staging.sandbox.fractal.id/kyc/liveness";
const PROTOCOL_JOURNEY_URL =
  process.env.REACT_APP_PROTOCOL_JOURNEY_URL ||
  "https://staging.sandbox.fractal.id/authorize?client_id=7bSJYDc0ywg9ml377DIk45-tjUxdHgVt-MJC6So56Ho&redirect_uri=https%3A%2F%2Fstaging.sandbox.fractal.id%2Fprotocol&response_type=code&scope=verification.protocol%3Aread";
const MEGALODON_URL =
  process.env.REACT_APP_MEGALODON_URL ||
  "https://resource.staging.sandbox.fractal.id";
const PROTOCOL_RPC_ENDPOINT =
  process.env.REACT_APP_PROTOCOL_RPC_ENDPOINT ||
  "wss://nodes.testnet.fractalprotocol.com";

const PROTOCOL_CURRENCY = process.env.REACT_APP_PROTOCOL_CURRENCY || "FCL";

const NODE_ENV = process.env.NODE_ENV || "development";

const environment: Environment = {
  CATFISH_URL,
  GOLDFISH_URL,
  FRACTAL_WEBSITE_URL,
  MAGURO_URL,
  LIVENESS_JOURNEY_URL,
  PROTOCOL_JOURNEY_URL,
  MEGALODON_URL,
  IS_DEV: NODE_ENV === "development",
  PROTOCOL_RPC_ENDPOINT,
  PROTOCOL_CURRENCY,
};

export default environment;
