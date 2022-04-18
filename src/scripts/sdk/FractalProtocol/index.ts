import {
  IFractalProtocol,
  IFact,
  IAsyncIteratorCreator,
} from "@pluginTypes/index";

import SingletonConnection from "@sdk/InpageProvider/connection";
import ConnectionTypes from "@models/Connection/types";

class FactIterator implements AsyncIterator<any> {
  private i: number = 0;
  private factCount: Promise<number>;
  private factsAPI: FractalProtocol;

  constructor(factsAPI: FractalProtocol) {
    this.factsAPI = factsAPI;
    this.factCount = factsAPI.totalFacts();
  }

  async next(): Promise<any> {
    if (this.i >= (await this.factCount)) {
      return { done: true };
    }

    const value = await this.factsAPI.get(this.i++);
    return { value, done: false };
  }
}

export class PageView implements IFact {
  timestampMs: number;
  url: string;

  constructor(url: string, timestampMs: number) {
    this.timestampMs = timestampMs;
    this.url = url;
  }
}

export default class FractalProtocol implements IFractalProtocol {
  public raw(): IAsyncIteratorCreator {
    let api = this;
    return {
      [Symbol.asyncIterator]() {
        return new FactIterator(api);
      },
    };
  }

  async totalFacts(): Promise<number> {
    let result = SingletonConnection.getConnection().invoke(
      ConnectionTypes.GET_TOTAL_FACTS_COUNT,
      [],
    );

    return result;
  }

  async get(index: number): Promise<IFact> {
    let result = SingletonConnection.getConnection().invoke(
      ConnectionTypes.GET_FACT,
      [index],
    );

    return result.then((data) => data.pageView as PageView);
  }
}
