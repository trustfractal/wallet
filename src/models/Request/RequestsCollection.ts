import Collection from "@models/Base/BaseCollection";
import Request from "@models/Request";

import { IRequest } from "@pluginTypes/plugin";
import RequestsStatus from "./status";
import RequestsTypes from "./types";

export default class RequestsCollection extends Collection<IRequest> {
  private isAccepted(request: IRequest) {
    return request.status === RequestsStatus.ACCEPTED;
  }
  private isDeclined(request: IRequest) {
    return request.status === RequestsStatus.DECLINED;
  }
  private isPending(request: IRequest) {
    return request.status === RequestsStatus.PENDING;
  }

  getAccepted() {
    return this.filterByField("status", RequestsStatus.ACCEPTED);
  }

  getDeclined() {
    return this.filterByField("status", RequestsStatus.DECLINED);
  }

  getPending() {
    return this.filterByField("status", RequestsStatus.PENDING);
  }

  getVerificationRequests() {
    return this.filterByField("type", RequestsTypes.VERIFICATION_REQUEST);
  }

  getAcceptedVerificationRequests() {
    return this.getVerificationRequests().filter(this.isAccepted);
  }

  getDeclinedVerificationRequests() {
    return this.getVerificationRequests().filter(this.isDeclined);
  }

  getPendingVerificationRequests() {
    return this.getVerificationRequests().filter(this.isPending);
  }

  sortByCreatedAt() {
    return this.sort(Request.sortByCreatedAt);
  }

  sortByUpdatedAt() {
    return this.sort(Request.sortByUpdatedAt);
  }

  static parse(str: string) {
    const requests = JSON.parse(str);

    const elements = requests.map((element: string) => Request.parse(element));

    return new RequestsCollection(...elements);
  }
}
