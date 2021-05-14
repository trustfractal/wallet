import VerificationRequest from "@models/VerificationRequest";
import { ISerializable } from "@pluginTypes/index";
import { IRequest } from "@pluginTypes/index";
import RequestsStatus from "./status";

export default class Request implements IRequest, ISerializable {
  public id: IRequest["id"];
  public requester: IRequest["requester"];
  public request: IRequest["request"];
  public type: IRequest["type"];
  public status: IRequest["status"];
  public createdAt: IRequest["createdAt"];
  public updatedAt: IRequest["updatedAt"];

  constructor(
    id: IRequest["id"],
    requester: IRequest["requester"],
    request: IRequest["request"],
    type: IRequest["type"],
    status: IRequest["status"] = RequestsStatus.PENDING,
    createdAt: IRequest["createdAt"] = new Date().getTime(),
    updatedAt: IRequest["updatedAt"] = new Date().getTime(),
  ) {
    this.id = id;
    this.requester = requester;
    this.request = request;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public serialize(): string {
    return JSON.stringify({
      id: this.id,
      requester: this.requester,
      request: this.request.serialize(),
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  public static sortByCreatedAt(requestA: IRequest, requestB: IRequest) {
    return requestB.createdAt - requestA.createdAt;
  }

  public static sortByUpdatedAt(requestA: IRequest, requestB: IRequest) {
    return requestB.updatedAt - requestA.updatedAt;
  }

  public static parse(str: string): Request {
    const {
      id,
      requester,
      request,
      type,
      status,
      createdAt,
      updatedAt,
    } = JSON.parse(str);

    return new Request(
      id,
      requester,
      VerificationRequest.parse(request),
      type,
      status,
      createdAt,
      updatedAt,
    );
  }
}
