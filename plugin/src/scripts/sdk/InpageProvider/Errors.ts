export enum ErrorCode {
  ERROR_FRACTAL_NOT_INITIALIZED = 4000,
}

export class FractalError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_FRACTAL_NOT_INITIALIZED = (): FractalError => {
  return new FractalError(
    ErrorCode.ERROR_FRACTAL_NOT_INITIALIZED,
    `Fractal: Fractal is not initialized, please call init before trying to access it`,
  );
};
