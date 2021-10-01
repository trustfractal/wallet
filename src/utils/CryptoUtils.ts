// TODO: Replace polkadot dependencies

import {
  isString,
  stringToU8a,
  u8aToHex,
  u8aToString,
  u8aToU8a,
} from "@polkadot/util";
import { naclDecrypt } from "@polkadot/util-crypto/nacl/decrypt";
import { naclEncrypt } from "@polkadot/util-crypto/nacl/encrypt";
import {
  CryptoInput,
  EncryptedSymmetric,
  EncryptedSymmetricString,
} from "@pluginTypes/index";

import { scrypt } from "scrypt-js";
import nacl from "tweetnacl";

function encryption(
  message: string,
  secret: CryptoInput,
): EncryptedSymmetricString {
  return encryptSymmetricAsStr(message, secret);
}

function decryption(data: string, secret: CryptoInput): string | null {
  return decryptSymmetricStr(JSON.parse(data), secret);
}

function passwordHashing(password: string, salt: string): Promise<Uint8Array> {
  const N = 1024;
  const r = 8;
  const p = 1;
  const dkLen = 32;
  return scrypt(coToUInt8(password), coToUInt8(salt), N, r, p, dkLen);
}

function getRandomBytes(length = 24): string {
  return u8aToHex(nacl.randomBytes(length));
}

function coToUInt8(
  input: CryptoInput | null | undefined,
  hexAsString = false,
): Uint8Array {
  if (hexAsString && isString(input)) {
    return stringToU8a(input);
  }
  return u8aToU8a(input);
}

function encryptSymmetricAsStr(
  message: CryptoInput,
  secret: CryptoInput,
  inputNonce?: CryptoInput,
): EncryptedSymmetricString {
  const result = naclEncrypt(
    coToUInt8(message, true),
    coToUInt8(secret),
    inputNonce ? coToUInt8(inputNonce) : undefined,
  );
  const nonce: string = u8aToHex(result.nonce);
  const encrypted: string = u8aToHex(result.encrypted);
  return { encrypted, nonce };
}

function decryptSymmetricStr(
  data: EncryptedSymmetric | EncryptedSymmetricString,
  secret: CryptoInput,
): string | null {
  const result = naclDecrypt(
    coToUInt8(data.encrypted),
    coToUInt8(data.nonce),
    coToUInt8(secret),
  );
  return result ? u8aToString(result) : null;
}

const CryptoUtils = {
  encryption,
  decryption,
  passwordHashing,
  getRandomBytes,
  coToUInt8,
  encryptSymmetricAsStr,
  decryptSymmetricStr,
};

export default CryptoUtils;
