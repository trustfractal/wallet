import Collection from "@models/Base/Collection";
import Credential from "@models/Credential";

export default class CredentialsCollection extends Collection {
  getData(key) {
    return this.find(({ properties }) => !!properties[key]);
  }

  hasData(key) {
    return !!this.getData(key);
  }

  countByData(key, value) {
    return this.filter(({ properties }) => properties[key] === value).length;
  }

  filterByCType(ctypeHash) {
    return this.filterByField("ctype", ctypeHash);
  }

  static parse(str) {
    const credentials = JSON.parse(str);

    const elements = credentials.map((element) => Credential.parse(element));

    return new CredentialsCollection(...elements);
  }
}
