export enum ErrorCode {
  ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED = 5000,
  ERROR_CREDENTIAL_NOT_FOUND = 5001,
}

export class BackgroundScriptError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED = (): BackgroundScriptError => {
  return new BackgroundScriptError(
    ErrorCode.ERROR_CONTENT_SCRIPT_CONNECTION_NOT_INITIALIZED,
    `BackgroundScript: Connection is not initialized, please call init before trying to access it`,
  );
};

export const ERROR_CREDENTIAL_NOT_FOUND = (
  level: string,
): BackgroundScriptError => {
  return new BackgroundScriptError(
    ErrorCode.ERROR_CREDENTIAL_NOT_FOUND,
    `BackgroundScript: Credential with level ${level} not found`,
  );
};
