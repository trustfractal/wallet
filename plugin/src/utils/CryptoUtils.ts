import { Crypto } from "@kiltprotocol/utils";
import { scrypt } from "scrypt-js";
import nacl from "tweetnacl";

export function encryption(
  message: string,
  secret: Crypto.CryptoInput,
): Crypto.EncryptedSymmetricString {
  return Crypto.encryptSymmetricAsStr(message, secret);
}

export function decryption(
  data: string,
  secret: Crypto.CryptoInput,
): string | null {
  return Crypto.decryptSymmetricStr(JSON.parse(data), secret);
}

export function passwordHashing(
  password: string,
  salt: string,
): Promise<Uint8Array> {
  const N = 1024;
  const r = 8;
  const p = 1;
  const dkLen = 32;
  return scrypt(
    Crypto.coToUInt8(password),
    Crypto.coToUInt8(salt),
    N,
    r,
    p,
    dkLen,
  );
}

export function getRandomBytes(length = 24) {
  return Crypto.u8aToHex(nacl.randomBytes(length));
}

const CryptoUtils = {
  encryption,
  decryption,
  passwordHashing,
  getRandomBytes,
};

export default CryptoUtils;
