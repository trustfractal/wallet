import { Environment } from "@fractalwallet/types";

const {
  REACT_APP_GOLDFISH_URL: GOLDFISH_URL = "",
  REACT_APP_FRACTAL_WEBSITE_HOSTNAME: FRACTAL_WEBSITE_HOSTNAME = "",
} = process.env;

const environment: Environment = {
  GOLDFISH_URL,
  FRACTAL_WEBSITE_HOSTNAME,
};

export default environment;
