import ProtocolService from "@services/ProtocolService";
import { Storage } from "@utils/StorageArray";

export class MintingRegistrar {
  constructor(
    private readonly storage: Storage,
    private readonly statusCheckSleepSeconds: number,
  ) {}

  async maybeTryRegister() {
    const lastCheck = await this.storage.getItem(
      "minting_registrar/last_check",
    );
    const now = new Date().getTime() / 1000;
    const shouldCheck =
      lastCheck == null ||
      now > parseInt(lastCheck) + this.statusCheckSleepSeconds;
    if (!shouldCheck) return;

    const protocol = await ProtocolService.fromStorage(this.storage);
    const isRegistered = await protocol.isRegisteredForMinting(
      protocol.address(),
    );
    if (isRegistered) {
      console.log("Already registered for next minting, not doing anything");
    } else {
      console.log("Not registered for minting, trying to register");
      const hash = await protocol.registerForMinting();
      console.log(`Successfully registered for minting ${hash}`);
    }

    await this.storage.setItem("minting_registrar/last_check", now.toString());
  }
}
