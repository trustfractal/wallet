import { Request, Response } from "express";

import Controller from "./Controller";

export default class HealthcheckController extends Controller {
  public req: Request;
  public res: Response;

  constructor(req: Request, res: Response) {
    super(req, res);
    this.req = req;
    this.res = res;
  }

  public async show() {
    this.res.status(200).send();
  }
}
