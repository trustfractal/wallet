export enum ErrorCode {
  ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED = 6000,
}

export class ConnectionError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED,
    `ExtensionConnection: Connection is not initialized, please call init before trying to access it`,
  );
};
