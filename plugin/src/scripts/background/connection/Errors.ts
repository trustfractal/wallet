export enum ErrorCode {
  ERROR_CONNECTION_NOT_INITIALIZED = 5000,
}

export class ConnectionError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_CONNECTION_NOT_INITIALIZED = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_CONNECTION_NOT_INITIALIZED,
    `Connection: Connection is not initialized, please call init before trying to access it`,
  );
};
