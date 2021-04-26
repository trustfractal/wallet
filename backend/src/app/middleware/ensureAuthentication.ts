import { Request, Response } from "express";

import Controller from "../controllers/Controller";
import { AuthenticatedRequest } from "../types";

const ensureAuthentication = (req: Request, res: Response, next: Function) => {
  const {
    headers: { authorization },
  } = req;

  if (!authorization) return new Controller(req, res).unauthorized();

  const [, token] = authorization.split("Bearer ");

  if (!token) return new Controller(req, res).unauthorized();

  const authenticatedRequest = req as AuthenticatedRequest;
  authenticatedRequest.token = token;

  next();
};

export default ensureAuthentication;
