export type Property = number | string | boolean;

export type Address = string;

export type Hash = string;

export type HashWithNonce = {
  hash: string;
  nonce?: string;
};

export type Signature = string;

export type HashTree = Record<string, HashWithNonce>;
