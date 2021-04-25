export enum ErrorCode {
  ERROR_PROVIDER_NOT_DETECTED = 3000,
  ERROR_PROVIDER_OVERRIDE = 3001,
  ERROR_PROVIDER_NOT_METAMASK = 3002,
  ERROR_PROVIDER_NOT_INITIALIZED = 3003,
  ERROR_USER_DECLINED_REQUEST = 3004,
}

export class EthereumProviderError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_PROVIDER_NOT_DETECTED = (): EthereumProviderError => {
  return new EthereumProviderError(
    ErrorCode.ERROR_PROVIDER_NOT_DETECTED,
    `EthereumProvider: could not detect any ethereum provider`,
  );
};

export const ERROR_PROVIDER_OVERRIDE = (): EthereumProviderError => {
  return new EthereumProviderError(
    ErrorCode.ERROR_PROVIDER_OVERRIDE,
    `EthereumProvider: window.ethereum does not match the detected provider`,
  );
};

export const ERROR_PROVIDER_NOT_METAMASK = (): EthereumProviderError => {
  return new EthereumProviderError(
    ErrorCode.ERROR_PROVIDER_NOT_METAMASK,
    `EthereumProvider: detected provider is not metamask`,
  );
};

export const ERROR_PROVIDER_NOT_INITIALIZED = (): EthereumProviderError => {
  return new EthereumProviderError(
    ErrorCode.ERROR_PROVIDER_NOT_INITIALIZED,
    `EthereumProvider: Ethereum provider is not initialized, please call init before trying to access it`,
  );
};

export const ERROR_USER_DECLINED_REQUEST = (): EthereumProviderError => {
  return new EthereumProviderError(
    ErrorCode.ERROR_USER_DECLINED_REQUEST,
    `EthereumProvider: user declined the request`,
  );
};
