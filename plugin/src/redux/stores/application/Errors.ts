export enum ErrorCode {
  ERROR_STORE_PASSWORD_INCORRECT = 9000,
}

export class AppStoreError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_STORE_PASSWORD_INCORRECT = (): AppStoreError => {
  return new AppStoreError(
    ErrorCode.ERROR_STORE_PASSWORD_INCORRECT,
    "AppStore: inserted password does not match stored one.",
  );
};
