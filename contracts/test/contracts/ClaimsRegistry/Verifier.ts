import chai from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";

import { Verifier } from "../../../typechain/Verifier";
import VerifierArtifact from "../../../artifacts/contracts/ClaimsRegistry/Verifier.sol/Verifier.json";

chai.use(solidity);
const { keccak256, toUtf8Bytes, arrayify, splitSignature } = ethers.utils;
const { expect } = chai;
const { deployContract } = waffle;

let verifier: any;

describe("Verifier", () => {
  beforeEach(async () => {
    const owner = (await ethers.getSigners())[0];

    verifier = (await deployContract(owner, VerifierArtifact, [])) as Verifier;
  });

  describe("recover", () => {
    it("returns the original signer of a message with an Ethereum prefix", async () => {
      const issuer = (await ethers.getSigners())[0];
      const prefix = Buffer.from("\x19Ethereum Signed Message:\n");

      const value = arrayify(keccak256(toUtf8Bytes("hello")));

      const sig = await issuer.signMessage(value);

      const prefixedValue = keccak256(
        Buffer.concat([prefix, toUtf8Bytes(String(value.length)), value])
      );

      const result = await verifier.recover(prefixedValue, sig);

      expect(result).to.equal(issuer.address);
    });
  });

  describe("recoverWithPrefix", () => {
    it("automatically includes the Ethereum prefix to validate the signature", async () => {
      const issuer = (await ethers.getSigners())[0];
      const value = arrayify(keccak256(toUtf8Bytes("hello")));
      const sig = await issuer.signMessage(value);

      const result = await verifier.recoverWithPrefix(value, sig);

      expect(result).to.eq(issuer.address);
    });
  });

  describe("verify", () => {
    it("returns the address of the signer", async () => {
      const issuer = (await ethers.getSigners())[0];
      const prefix = Buffer.from("\x19Ethereum Signed Message:\n");

      const value = arrayify(keccak256(toUtf8Bytes("hello")));

      const sig = await issuer.signMessage(value);

      const prefixedValue = keccak256(
        Buffer.concat([prefix, toUtf8Bytes(String(value.length)), value])
      );

      const result = await verifier.verify(prefixedValue, sig, issuer.address);

      expect(result).to.equal(true);
    });
  });

  describe("verifyWithPrefix", () => {
    it("automatically includes the Ethereum prefix to validate the signature", async () => {
      const issuer = (await ethers.getSigners())[0];
      const value = arrayify(keccak256(toUtf8Bytes("hello")));
      const sig = await issuer.signMessage(value);

      const result = await verifier.verifyWithPrefix(
        value,
        sig,
        issuer.address
      );

      expect(result).to.equal(true);
    });
  });
});
