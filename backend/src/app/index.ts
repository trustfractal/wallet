import express from "express";

import { AuthenticatedRequest } from "./types";

import CredentialCrontroller from "./controllers/CredentialController";
import HealthcheckController from "./controllers/HealthcheckController";
import AddressController from "./controllers/AddressController";

import ensureAuthentication from "./middleware/ensureAuthentication";
import addCurrentUser from "./middleware/addCurrentUser";

import { getEnv } from "../utils";

const port = getEnv("PORT", 3000);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/credential", ensureAuthentication);
app.use("/credential", addCurrentUser);

app.post("/credential", async (req, res) => {
  const authenticatedRequest = req as AuthenticatedRequest;
  new CredentialCrontroller(authenticatedRequest, res).create();
});

app.get("/healthcheck", (req, res) => {
  new HealthcheckController(req, res).show();
});

app.get("/addresses", (req, res) => {
  new AddressController(req, res).show();
});

const start = () =>
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

export default { start };
