export type CryptoInput = Buffer | Uint8Array | string;

export type EncryptedSymmetric = {
  encrypted: Uint8Array;
  nonce: Uint8Array;
};

export type EncryptedSymmetricString = {
  encrypted: string;
  nonce: string;
};
