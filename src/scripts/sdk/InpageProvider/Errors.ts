export enum ErrorCode {
  ERROR_INPAGE_PROVIDER_NOT_INITIALIZED = 4000,
  ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED = 4001,
}

export class InpageProviderError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_FRACTAL_NOT_INITIALIZED = (): InpageProviderError => {
  return new InpageProviderError(
    ErrorCode.ERROR_INPAGE_PROVIDER_NOT_INITIALIZED,
    `InpageProviderError: InpageProviderError is not initialized, please call init before trying to access it`,
  );
};

export const ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED =
  (): InpageProviderError => {
    return new InpageProviderError(
      ErrorCode.ERROR_EXTENSION_CONNECTION_NOT_INITIALIZED,
      `ExtensionConnection: Connection is not initialized, please call init before trying to access it`,
    );
  };
