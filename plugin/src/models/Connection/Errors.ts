export enum ErrorCode {
  ERROR_HANDLE_MESSAGE = 7000,
  ERROR_HANDLE_RESPONSE = 7001,
  ERROR_HANDLE_INVOKATION = 7002,
  ERROR_LOGIN_WINDOW_OPEN = 7003,
  ERROR_LOGIN_WINDOW_CLOSED = 7004,
  ERROR_LOGIN_TIMEOUT = 7005,
  ERROR_NO_SENDER = 7006,
  ERROR_NO_ACTIVE_TAB = 7007,
  ERROR_NOT_ON_FRACTAL = 7008,
  ERROR_NO_ACCOUNT = 7009,
}

export class ConnectionError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_HANDLE_MESSAGE = (
  message: string,
  type: string,
): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_HANDLE_MESSAGE,
    `Connection: unexpected message ${message} of type ${type}`,
  );
};

export const ERROR_HANDLE_RESPONSE = (message: string): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_HANDLE_RESPONSE,
    `Connection: unexpected response message ${message}`,
  );
};

export const ERROR_HANDLE_INVOKATION = (message: string): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_HANDLE_INVOKATION,
    `Connection: unexpected invokation message ${message}`,
  );
};

export const ERROR_LOGIN_WINDOW_OPEN = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_LOGIN_WINDOW_OPEN,
    "Connection: could not create login window",
  );
};

export const ERROR_LOGIN_WINDOW_CLOSED = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_LOGIN_WINDOW_CLOSED,
    "Connection: login window was closed before successful login",
  );
};

export const ERROR_LOGIN_TIMEOUT = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_LOGIN_TIMEOUT,
    "Connection: login has reached the timeout",
  );
};

export const ERROR_NO_SENDER = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_NO_SENDER,
    "Connection: could't get the sender",
  );
};

export const ERROR_NO_ACTIVE_TAB = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_NO_ACTIVE_TAB,
    "Connection: could not get the active tab connection",
  );
};

export const ERROR_NOT_ON_FRACTAL = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_NOT_ON_FRACTAL,
    "Connection: user is not on the fractal webpage, he will be redirected",
  );
};

export const ERROR_NO_ACCOUNT = (): ConnectionError => {
  return new ConnectionError(
    ErrorCode.ERROR_NO_ACCOUNT,
    "Connection: no ethereum account could be found",
  );
};
