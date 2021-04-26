import express from "express";

import ensureAuthentication from "./middleware/ensureAuthentication";
import addCurrentUser from "./middleware/addCurrentUser";
import CredentialCrontroller from "./controllers/CredentialController";
import { AuthenticatedRequest } from "./types";

const port = process.env["PORT"] || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/credential", ensureAuthentication);
app.use("/credential", addCurrentUser);

app.post("/credential", async (req, res) => {
  const authenticatedRequest = req as AuthenticatedRequest;
  new CredentialCrontroller(authenticatedRequest, res).create();
});

const start = () =>
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

export default { start };
