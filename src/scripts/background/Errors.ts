export enum ErrorCode {
  ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED = 5000,
  ERROR_VERIFICATION_REQUEST_DECLINED = 5002,
  ERROR_VERIFICATION_REQUEST_TIME_OUT = 5003,
  ERROR_CREDENTIALS_NOT_FOUND = 5004,
  ERROR_VERIFICATION_REQUEST_WINDOW_OPEN = 5005,
  ERROR_VERIFICATION_REQUEST_WINDOW_CLOSED = 5006,
  ERROR_VERIFICATION_REQUEST_INVALID_FIELDS = 5007,
}

export class BackgroundScriptError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED,
      `BackgroundScript: Connection is not initialized, please call init before trying to access it`,
    );
  };

export const ERROR_VERIFICATION_REQUEST_DECLINED =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_VERIFICATION_REQUEST_DECLINED,
      `BackgroundScript: Verification request was declined`,
    );
  };

export const ERROR_VERIFICATION_REQUEST_TIME_OUT =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_VERIFICATION_REQUEST_TIME_OUT,
      `BackgroundScript: Verification request has reach time out`,
    );
  };

export const ERROR_CREDENTIALS_NOT_FOUND = (): BackgroundScriptError => {
  return new BackgroundScriptError(
    ErrorCode.ERROR_CREDENTIALS_NOT_FOUND,
    `BackgroundScript: No credentials found`,
  );
};

export const ERROR_VERIFICATION_REQUEST_WINDOW_OPEN =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_VERIFICATION_REQUEST_WINDOW_OPEN,
      `BackgroundScript: Could not create verification request window`,
    );
  };

export const ERROR_VERIFICATION_REQUEST_WINDOW_CLOSED =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_VERIFICATION_REQUEST_WINDOW_CLOSED,
      `BackgroundScript: Verification request window was closed`,
    );
  };

export const ERROR_VERIFICATION_REQUEST_INVALID_FIELDS =
  (): BackgroundScriptError => {
    return new BackgroundScriptError(
      ErrorCode.ERROR_VERIFICATION_REQUEST_INVALID_FIELDS,
      `BackgroundScript: Verification request fields are not valid`,
    );
  };
