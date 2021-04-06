export enum ErrorCode {
  ERROR_CREATE_WINDOW = 2000,
  ERROR_GET_CURRENT_WINDOW = 2001,
  ERROR_GET_ALL_WINDOWS = 2002,
  ERROR_CLOSE_WINDOW = 2003,
}

export class StorageServiceError extends Error {
  public errorCode: ErrorCode;
  public errorChrome: chrome.runtime.LastError;

  public constructor(
    errorCode: ErrorCode,
    errorChrome: chrome.runtime.LastError,
    message: string,
  ) {
    super(message);
    this.errorChrome = errorChrome;
    this.errorCode = errorCode;
  }
}

export const ERROR_CREATE_WINDOW: (
  errorChrome: chrome.runtime.LastError,
) => StorageServiceError = (errorChrome: chrome.runtime.LastError) => {
  return new StorageServiceError(
    ErrorCode.ERROR_CREATE_WINDOW,
    errorChrome,
    "WindowsService: could not create window",
  );
};

export const ERROR_GET_CURRENT_WINDOW: (
  errorChrome: chrome.runtime.LastError,
) => StorageServiceError = (errorChrome: chrome.runtime.LastError) => {
  return new StorageServiceError(
    ErrorCode.ERROR_GET_CURRENT_WINDOW,
    errorChrome,
    "WindowsService: could not get current window",
  );
};

export const ERROR_GET_ALL_WINDOWS: (
  errorChrome: chrome.runtime.LastError,
) => StorageServiceError = (errorChrome: chrome.runtime.LastError) => {
  return new StorageServiceError(
    ErrorCode.ERROR_GET_ALL_WINDOWS,
    errorChrome,
    "WindowsService: could not get all windows",
  );
};

export const ERROR_CLOSE_WINDOW: (
  errorChrome: chrome.runtime.LastError,
) => StorageServiceError = (errorChrome: chrome.runtime.LastError) => {
  return new StorageServiceError(
    ErrorCode.ERROR_CLOSE_WINDOW,
    errorChrome,
    "WindowsService: could not close window",
  );
};
