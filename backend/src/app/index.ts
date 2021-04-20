import express from "express";

import AttestRequest from "../services/AttestRequest";
import { badRequest } from "./errors";

const port = process.env["PORT"] || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  const { request } = req.body;

  if (!request) return badRequest(res);

  const credential = AttestRequest(request);

  if (!credential) return badRequest(res);

  res.send(JSON.stringify(credential));
});

const start = () =>
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

export default { start };
