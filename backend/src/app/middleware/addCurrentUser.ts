import fetch from "node-fetch";
import { Request, Response } from "express";

import { AuthenticatedRequest } from "../types";
import Controller from "../controllers/Controller";

const megalodonUrl = process.env["MEGALODON_URL"];

if (!megalodonUrl) throw new Error("Missing MEGALODON_URL env variable");

const endpoint = `${megalodonUrl}/users/me`;

const fetchUser = async (token: string) => {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

const addCurrentUser = async (req: Request, res: Response, next: Function) => {
  const authenticatedRequest = req as AuthenticatedRequest;
  const { token } = authenticatedRequest;

  if (!token) return next();

  const user = await fetchUser(token);

  if (!user) return new Controller(req, res).unauthorized();

  authenticatedRequest.user = user;

  next();
};

export default addCurrentUser;
