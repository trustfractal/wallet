import { IMiddleware, IInvokation } from "@fractalwallet/types";

export default class AuthMiddleware implements IMiddleware {
  constructor() {}

  public apply(invokation: IInvokation): void {
    return;
  }
}
