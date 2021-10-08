export enum ErrorCode {
  ERRORS_CATFISH_TOKEN_EXPIRED = 8000,
}

export class CatfishServiceError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERRORS_CATFISH_TOKEN_EXPIRED = (): CatfishServiceError => {
  return new CatfishServiceError(
    ErrorCode.ERRORS_CATFISH_TOKEN_EXPIRED,
    `CatfishServiceError: Catfish access token has expired`,
  );
};
