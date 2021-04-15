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
    const value = arrayify(keccak256(toUtf8Bytes("bar")));
    let issuer: any;
    let subject: any;
    let johnDoe: any;
    let sig: any;

    beforeEach(async () => {
      const signers = await ethers.getSigners();
      issuer = signers[0];
      subject = signers[1];
      johnDoe = signers[2];
      sig = await issuer.signMessage(value);
    });

    describe("setClaimWithSignature", () => {
      it("issuer can subject a claim about a subject", async () => {
        await registry
          .connect(issuer)
          .setClaimWithSignature(issuer.address, subject.address, value, sig);
      });

      it("subject can issue a claimed pre-signed by the issuer", async () => {
        await registry
          .connect(subject)
          .setClaimWithSignature(issuer.address, subject.address, value, sig);
      });
    });

    describe("setSelfClaimWithSignature", () => {
      it("registers a self claim when given a valid signature", async () => {
        await registry.connect(issuer).setSelfClaimWithSignature(value, sig);
      });
    });

    describe("getClaim", () => {
      it("returns the subject of a given issuer's claim", async () => {
        await registry.setClaimWithSignature(
          issuer.address,
          subject.address,
          value,
          sig
        );

        const result = await registry.getClaim(issuer.address, sig);

        expect(result).to.eq(subject.address);
      });
    });

    describe("verifyClaim", () => {
      it("is true if issuer & claim match the subject", async () => {
        await registry.setClaimWithSignature(
          issuer.address,
          subject.address,
          value,
          sig
        );

        const result = await registry.verifyClaim(
          subject.address,
          issuer.address,
          sig
        );

        expect(result).to.eq(true);
      });

      it("is false if claim does not exist", async () => {
        const result = await registry.verifyClaim(
          subject.address,
          issuer.address,
          sig
        );

        expect(result).to.eq(false);
      });

      it("is false if subject is not the expected address", async () => {
        await registry.setClaimWithSignature(
          issuer.address,
          subject.address,
          value,
          sig
        );

        const result = await registry.verifyClaim(
          johnDoe.address,
          issuer.address,
          sig
        );

        expect(result).to.eq(false);
      });
    });
  });
});
