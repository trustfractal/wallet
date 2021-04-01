import Collection from "@models/Base/Collection";

import Request from "@models/Request/";
import RequestStatus from "@models/Request/RequestStatus";

export default class RequestsCollection extends Collection {
  filterByStatus(status) {
    return this.filter(({ status: itemStatus }) => itemStatus === status);
  }

  getAccepted() {
    return this.filterByStatus(RequestStatus.ACCEPTED);
  }

  getDeclined() {
    return this.filterByStatus(RequestStatus.DECLINED);
  }

  getPending() {
    return this.filterByStatus(RequestStatus.PENDING);
  }

  static parse(str) {
    const data = JSON.parse(str);

    const elements = data.map((element) => Request.parse(element));

    return new RequestsCollection(...elements);
  }

  sortByDate(direction = "desc") {
    return this.sort((itemA, itemB) => {
      if (direction === "asc") {
        return itemA.createdAt - itemB.createdAt;
      }

      return itemB.createdAt - itemA.createdAt;
    });
  }
}
