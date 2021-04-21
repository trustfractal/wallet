import express from "express";

import AttestRequest from "../services/AttestRequest";
import { badRequest } from "./errors";

const port = process.env["PORT"] || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
  const { request } = req.body;

  if (!request) return badRequest(res);

  const credential = await AttestRequest.perform(request);

  if (!credential) return badRequest(res);

  res.send({ credential });
});

const start = () =>
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
  });

export default { start };
