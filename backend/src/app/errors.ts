import { Response } from "express";

export const notFound = (res: Response) => res.status(404).send("Not found");

export const badRequest = (res: Response) =>
  res.status(400).send("Bad request");
