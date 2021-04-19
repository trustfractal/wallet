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
    let dataToSign: any;
    let sig: any;

    beforeEach(async () => {
      const signers = await ethers.getSigners();
      issuer = signers[0];
      subject = signers[1];
      johnDoe = signers[2];
      dataToSign = arrayify(
        await registry.computeSignableKey(subject.address, value)
      );
      sig = await issuer.signMessage(dataToSign);
    });

    describe("setClaimWithSignature", () => {
      it("issuer can subject a claim about a subject", async () => {
        const action = registry.setClaimWithSignature(
          issuer.address,
          subject.address,
          value,
          sig
        );

        await expect(action).not.to.be.reverted;
      });

      it("any anonymous user can issue pre-signed claims", async () => {
        const action = registry
          .connect(johnDoe)
          .setClaimWithSignature(issuer.address, subject.address, value, sig);

        await expect(action).not.to.be.reverted;
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
