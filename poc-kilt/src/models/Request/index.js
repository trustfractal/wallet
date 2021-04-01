import { v4 as uuidv4 } from "uuid";

import RequestStatus from "./RequestStatus";

export default class Request {
  constructor(
    id = null,
    requester,
    content,
    type,
    status = RequestStatus.PENDING,
    createdAt = null,
  ) {
    this.id = id || uuidv4();
    this.requester = requester;
    this.content = content;
    this.type = type;
    this.status = status;
    this.createdAt = createdAt || new Date();
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      requester: this.requester,
      content: this.content,
      type: this.type,
      status: this.status,
      createdAt: this.createdAt,
    });
  }

  static parse(str) {
    const { id, requester, content, type, status, createdAt } = JSON.parse(str);

    return new Request(
      id,
      requester,
      content,
      type,
      status,
      new Date(createdAt),
    );
  }
}
