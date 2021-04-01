import Kilt, {
  AttestedClaim,
  Balance,
  Identity,
  MessageBodyType,
  RequestForAttestation,
} from "@kiltprotocol/sdk-js";

import UnsafeCType from "@models/Kilt/UnsafeCType.ts";
import UnsafeClaim from "@models/Kilt/UnsafeClaim.ts";

const { REACT_APP_BLOCKCHAIN_HOST: BLOCKCHAIN_HOST } = process.env;

class KiltProtocol {
  constructor() {
    this.host = undefined;
    this.instance = undefined;

    this.listening = false;
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new KiltProtocol();
    }

    return this.instance;
  }

  async init(address = BLOCKCHAIN_HOST) {
    await Kilt.init({ address });
    console.log("connected to kilt blockchain at: " + address);
  }

  async generateIdentity() {
    const mnemonic = Identity.generateMnemonic();
    const identity = await this.buildIdentityFromMnemonic(mnemonic);

    return {
      mnemonic,
      identity,
    };
  }

  async buildIdentityFromMnemonic(mnemonic) {
    const identity = await Identity.buildFromMnemonic(mnemonic);

    return identity;
  }

  async getBalance(identity) {
    const balance = await Balance.getBalance(identity.address);

    return balance;
  }

  async registerBalanceListener(identity, listener) {
    if (!this.listening) {
      await Balance.listenToBalanceChanges(identity.address, listener);
    }
  }

  async buildAttestationRequest(identity, cTypeObj, properties) {
    const ctype = UnsafeCType.fromCType(cTypeObj);

    const claim = UnsafeClaim.fromCTypeAndClaimContents(
      ctype,
      properties,
      identity.address,
    );

    const requestForAttestation = await RequestForAttestation.fromClaimAndIdentity(
      claim,
      identity,
    );

    return requestForAttestation;
  }

  async buildAttestationRequestMessage(identity, request, target) {
    const body = {
      content: { requestForAttestation: request },
      type: MessageBodyType.REQUEST_ATTESTATION_FOR_CLAIM,
    };

    const message = new Kilt.Message(body, identity, target);

    return message.encrypt();
  }

  decryptMessage(identity, message) {
    return Kilt.Message.decrypt(message, identity);
  }

  async buildPresentationMessage(identity, credential, properties, target) {
    const copiedCredential = Kilt.AttestedClaim.fromAttestedClaim(
      JSON.parse(JSON.stringify(credential.claim)),
    );
    const removedProperties = Object.keys(properties).filter(
      (property) => !properties[property],
    );
    copiedCredential.request.removeClaimProperties(removedProperties);

    const body = {
      content: [copiedCredential],
      type: MessageBodyType.SUBMIT_CLAIMS_FOR_CTYPES,
    };

    const message = new Kilt.Message(body, identity, target);

    return message.encrypt();
  }

  async verifyCredential(credential) {
    const attestedClaim = await AttestedClaim.fromAttestedClaim(
      credential.claim,
    );

    const valid = await attestedClaim.verify();

    return valid;
  }
}

const kilt = KiltProtocol.getInstance();

export default kilt;
