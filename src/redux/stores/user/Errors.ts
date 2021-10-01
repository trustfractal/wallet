enum ErrorCode {
  ERROR_STORE_NOT_INITIALIZED = 6000,
  ERROR_SALT_NOT_FOUND = 6001,
  ERROR_LOCAL_STATE_NOT_FOUND = 6002,
  ERROR_DECRYPT_FAILED = 6003,
}

class UserStoreError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export const ERROR_STORE_NOT_INITIALIZED = (): UserStoreError => {
  return new UserStoreError(
    ErrorCode.ERROR_STORE_NOT_INITIALIZED,
    "UserStore: store not initialized, please call init before trying to access the store",
  );
};

export const ERROR_SALT_NOT_FOUND = (): UserStoreError => {
  return new UserStoreError(
    ErrorCode.ERROR_SALT_NOT_FOUND,
    "UserStore: no password salt found",
  );
};

export const ERROR_LOCAL_STATE_NOT_FOUND = (): UserStoreError => {
  return new UserStoreError(
    ErrorCode.ERROR_SALT_NOT_FOUND,
    "UserStore: no local state found",
  );
};

export const ERROR_DECRYPT_FAILED = (): UserStoreError => {
  return new UserStoreError(
    ErrorCode.ERROR_DECRYPT_FAILED,
    "UserStore: store could not be decrypted",
  );
};
