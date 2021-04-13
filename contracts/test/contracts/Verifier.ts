import chai from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";

import { Verifier } from "../../typechain/Verifier";
import VerifierArtifact from "../../artifacts/contracts/Verifier.sol/Verifier.json";

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

  describe("setClaims", () => {
    let calc: any;

    describe("verify", () => {
      it("returns the original signer of a message with an Ethereum prefix", async () => {
        const issuer = (await ethers.getSigners())[0];
        const prefix = Buffer.from("\x19Ethereum Signed Message:\n");

        const value = arrayify(keccak256(toUtf8Bytes("hello")));

        const sig = splitSignature(await issuer.signMessage(value));

        const prefixedValue = keccak256(
          Buffer.concat([prefix, toUtf8Bytes(String(value.length)), value])
        );

        const result = await verifier.verify(
          prefixedValue,
          sig.v,
          sig.r,
          sig.s
        );

        expect(result).to.equal(issuer.address);
      });
    });

    describe("verifyWithPrefix", () => {
      it("automatically includes the Ethereum prefix to validate the signature", async () => {
        const issuer = (await ethers.getSigners())[0];
        const value = arrayify(keccak256(toUtf8Bytes("hello")));

        const sig = splitSignature(await issuer.signMessage(value));

        const result = await verifier.verifyWithPrefix(
          value,
          sig.v,
          sig.r,
          sig.s
        );

        expect(result).to.eq(issuer.address);
      });
    });
  });
});
