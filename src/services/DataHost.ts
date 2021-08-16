import { Storage, StorageArray } from "@utils/StorageArray";
import storageService from "@services/StorageService";

import {
  build,
  extend_multiple,
  prune_balanced,
  strict_extension_proof,
} from "@vendor/merklex-js/merklex_js";

export class DataHost {
  private static _instance?: DataHost;

  static instance() {
    if (DataHost._instance == null) {
      DataHost._instance = new DataHost(storageService, storageService);
    }
    return DataHost._instance;
  }

  constructor(
    private readonly metadata: Storage,
    private readonly sensitive: Storage,
  ) {}

  private key(key: string) {
    return `data_host/${key}`;
  }

  async enable() {
    await this.metadata.setItem(this.key("enabled"), "true");
  }

  async disable() {
    await this.metadata.setItem(this.key("enabled"), "false");
  }

  async isEnabled(): Promise<boolean> {
    const value = await this.metadata.getItem(this.key("enabled"));
    return value === "true";
  }

  async storeFact(fact: any) {
    if (!(await this.isEnabled())) return;

    this.array().push(fact);
  }

  private array() {
    return new StorageArray(this.sensitive, this.key("facts"));
  }

  public iter() {
    return this.array().iter();
  }

  async extensionProof(): Promise<[number, string] | undefined> {
    const allItems = [];
    for await (let item of this.array().iter()) {
      allItems.push(item);
    }
    if (allItems.length === 0) return;

    const currentTree = buildTree(allItems.map((i) => JSON.stringify(i)));

    const maybeLastProofLength = await this.metadata.getItem(
      this.key("last_proof_index"),
    );
    if (maybeLastProofLength == null) {
      return [allItems.length, hexPrefix(prune_balanced(currentTree)!)];
    }
    const lastProofLength = parseInt(maybeLastProofLength);
    if (lastProofLength === allItems.length) return;

    const previousTree = buildTree(
      allItems.slice(0, lastProofLength).map((i) => JSON.stringify(i)),
    );
    const proof = strict_extension_proof(currentTree, previousTree)!;
    return [allItems.length, hexPrefix(proof)];
  }

  async setLastProofLength(length: number) {
    await this.metadata.setItem(
      this.key("last_proof_index"),
      length.toString(),
    );
  }
}

function buildTree(items: string[]): string {
  const begin = build(items[0])!;
  return extend_multiple(begin, items.slice(1))!;
}

function hexPrefix(s: string): string {
  return `0x${s}`;
}
