export interface IAsyncIteratorCreator {
  [Symbol.asyncIterator]: () => AsyncIterator<any>;
}

export interface IFractalProtocolAPI {
  raw(): IAsyncIteratorCreator;
}

export interface IFact {
  url: string;
  timestampMs: number;
}
