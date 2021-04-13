import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity, MockProvider } from "ethereum-waffle";
import dayjs from "dayjs";

import { ClaimsRegistry } from "../../typechain/ClaimsRegistry";
import ClaimsRegistryArtifact from "../../artifacts/contracts/ClaimsRegistry.sol/ClaimsRegistry.json";

chai.use(solidity);
const { keccak256, toUtf8Bytes, arrayify } = ethers.utils;
const { expect } = chai;
const { deployContract } = waffle;

let registry: any;

describe("ClaimsRegistry", () => {
  beforeEach(async () => {
    const owner = (await ethers.getSigners())[0];

    registry = (await deployContract(
      owner,
      ClaimsRegistryArtifact,
      []
    )) as ClaimsRegistry;
  });

  describe("setClaims", () => {
    let calc: any;

    describe("setClaimWithSignature", () => {
      it("issuer can subject a claim about a subject", async () => {
        const signers = await ethers.getSigners();
        const issuer = signers[0];
        const subject = signers[1];

        const key = arrayify(keccak256(toUtf8Bytes("foo")));
        const value = arrayify(keccak256(toUtf8Bytes("bar")));

        const sig = ethers.utils.splitSignature(
          await issuer.signMessage(value)
        );

        await registry
          .connect(issuer)
          .setClaimWithSignature(
            issuer.address,
            subject.address,
            key,
            value,
            sig.v,
            sig.r,
            sig.s
          );
      });

      it("subject can issue a claimed pre-signed by the issuer", async () => {
        const signers = await ethers.getSigners();
        const issuer = signers[0];
        const subject = signers[1];

        const key = arrayify(keccak256(toUtf8Bytes("foo")));
        const value = arrayify(keccak256(toUtf8Bytes("bar")));

        const sig = ethers.utils.splitSignature(
          await issuer.signMessage(value)
        );

        await registry
          .connect(subject)
          .setClaimWithSignature(
            issuer.address,
            subject.address,
            key,
            value,
            sig.v,
            sig.r,
            sig.s
          );
      });
    });

    describe("setSelfClaimWithSignature", () => {
      it("registers a self claim when given a valid signature", async () => {
        const signers = await ethers.getSigners();
        const myself = signers[0];

        const key = arrayify(keccak256(toUtf8Bytes("foo")));
        const value = arrayify(keccak256(toUtf8Bytes("bar")));

        const sig = ethers.utils.splitSignature(
          await myself.signMessage(value)
        );

        await registry
          .connect(myself)
          .setSelfClaimWithSignature(key, value, sig.v, sig.r, sig.s);
      });
    });
  });
});
