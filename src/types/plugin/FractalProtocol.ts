export interface IAsyncIteratorCreator {
  [Symbol.asyncIterator]: () => AsyncIterator<any>;
}

export interface IFractalProtocol {
  raw(): IAsyncIteratorCreator;
}

export interface IFact {
  url: string;
  timestampMs: number;
}
