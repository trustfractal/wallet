import { Response, Request } from "express";

export default class Controller {
  public req: Request;
  public res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  public notFound(message?: string) {
    const json = { error: "Not Found", message: message || "Not found" };
    this.send(404, json);
  }

  public badRequest(message?: string) {
    const json = { error: "Bad Request", message: message || "Bad request" };
    this.send(400, json);
  }

  public unauthorized(message?: string) {
    const json = {
      error: "Unauthorized",
      message: message || "You're not authorized to do that",
    };

    this.send(401, json);
  }

  private send(status: number, json: object) {
    this.res.status(status).send(json);
  }
}
