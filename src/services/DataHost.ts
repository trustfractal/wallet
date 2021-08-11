import { Storage, StorageArray } from "@utils/StorageArray";
import storageService from "@services/StorageService";

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

    const array = new StorageArray(this.sensitive, this.key("facts"));
    array.push(fact);
  }
}
