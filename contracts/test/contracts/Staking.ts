import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
chai.use(ChaiAsPromised);
const expect = chai.expect;

import { ethers } from "hardhat";

describe("Staking", async () => {
  const [owner, alice] = await ethers.getSigners();
  const Staking = await ethers.getContractFactory("Staking");
  const FCL = await ethers.getContractFactory("FakeFractalToken");
  let fcl: any;

  beforeEach(async () => {
    fcl = await FCL.deploy(owner.address);
    await fcl.deployed();
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const staking = await Staking.deploy(fcl.address, 3, 2, 1);
      await staking.deployed();

      expect(await staking.erc20()).to.eq(fcl.address);
      expect(await staking.totalMaxAmount()).to.eq(3);
      expect(await staking.individualMinimumAmount()).to.eq(2);
      expect(await staking.APR()).to.eq(1);
      expect(await staking.lockedTokens()).to.eq(0);
    });

    it("fails if maxAmount is 0", async () => {
      const action = Staking.deploy(fcl.address, 0, 1, 1);
      await expect(action).to.be.rejectedWith("Staking: invalid max amount");
    });

    it("fails if minIndividualAmount is 0", async () => {
      const action = Staking.deploy(fcl.address, 2, 0, 1);
      await expect(action).to.be.rejectedWith(
        "Staking: invalid individual min amount"
      );
    });

    it("fails if APR is 0", async () => {
      const action = Staking.deploy(fcl.address, 2, 1, 0);
      await expect(action).to.be.rejectedWith("Staking: invalid APR");
    });

    it("fails if min amount is larger than total amount", async () => {
      const action = Staking.deploy(fcl.address, 1, 2, 0);
      await expect(action).to.be.rejectedWith("Staking: invalid APR");
    });

    it("fails if max amount is larger than the token's own supply", async () => {
      const supply = await fcl.totalSupply();

      const action = Staking.deploy(fcl.address, supply + 1, 1, 1);

      await expect(action).to.be.rejectedWith(
        "Staking: max amount is greater than total available supply"
      );
    });
  });

  describe("functions", () => {
    let staking: any;

    beforeEach(async () => {
      const supply = await fcl.totalSupply();
      staking = await Staking.deploy(fcl.address, supply, 100, 1);
      await staking.deployed();
    });

    describe("", () => {});
  });
});
