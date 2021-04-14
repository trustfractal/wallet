/// <reference types="node" />
export declare type CryptoInput = Buffer | Uint8Array | string;
export declare type EncryptedSymmetric = {
    encrypted: Uint8Array;
    nonce: Uint8Array;
};
export declare type EncryptedSymmetricString = {
    encrypted: string;
    nonce: string;
};
