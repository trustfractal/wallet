import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { FakeFractalToken as FCL } from "../../typechain/FakeFractalToken";
import FCLArtifact from "../../artifacts/contracts/FakeFractalToken.sol/FakeFractalToken.json";
import { Staking } from "../../typechain/Staking";
import StakingArtifact from "../../artifacts/contracts/Staking.sol/Staking.json";

chai.use(solidity);
const { expect } = chai;
const { deployContract: deploy } = waffle;

let signers: any;
let owner: any;
let fcl: any;
const start = dayjs().add(1, "day").unix();
const end = dayjs().add(2, "day").unix();

describe("Staking", () => {
  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
  });

  beforeEach(async () => {
    fcl = (await deploy(owner, FCLArtifact, [owner.address])) as FCL;
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const args = [fcl.address, start, end, 3, 2, 1];

      const staking = (await deploy(owner, StakingArtifact, args)) as Staking;

      expect(await staking.erc20()).to.eq(fcl.address);
      expect(await staking.totalMaxAmount()).to.eq(3);
      expect(await staking.individualMinimumAmount()).to.eq(2);
      expect(await staking.APR()).to.eq(1);
      expect(await staking.lockedTokens()).to.eq(0);
    });

    it("fails if startDate is in the past", async () => {
      const yesterday = dayjs().subtract(1, "day").unix();
      const args = [fcl.address, yesterday, end, 3, 2, 1];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: start date must be in the future"
      );
    });

    it("fails if endDate is before startDate", async () => {
      const one_hour_before = dayjs(start).subtract(1, "hour").unix();
      const args = [fcl.address, start, one_hour_before, 0, 1, 1];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: end date must be after start date"
      );
    });

    it("fails if maxAmount is 0", async () => {
      const args = [fcl.address, start, end, 0, 1, 1];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith("Staking: invalid max amount");
    });

    it("fails if minIndividualAmount is 0", async () => {
      const args = [fcl.address, start, end, 2, 0, 1];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: invalid individual min amount"
      );
    });

    it("fails if APR is 0", async () => {
      const args = [fcl.address, start, end, 2, 1, 0];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith("Staking: invalid APR");
    });

    it("fails if min amount is larger than total amount", async () => {
      const args = [fcl.address, start, end, 1, 2, 0];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith("Staking: invalid APR");
    });

    it("fails if max amount is larger than the token's own supply", async () => {
      const supply = await fcl.totalSupply();
      const args = [fcl.address, start, end, supply + 1, 1, 1];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: max amount is greater than total available supply"
      );
    });
  });

  describe("functions", async () => {
    let staking: any;

    /**
     * Assume by default a timespan of 30 days
     * min subscription of 100 units
     * and 50% of the supply available as rewards
     */
    const start = dayjs().add(1, "day").unix();
    const end = dayjs().add(31, "day").unix();
    const minSubscription = 100;
    let pool;
    const APR = 1;

    const ensureTimestamp = (timestamp: number): Promise<unknown> => {
      return network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    };

    beforeEach(async () => {
      pool = (await fcl.totalSupply()).div(2);

      staking = (await deploy(owner, StakingArtifact, [
        fcl.address,
        start,
        end,
        pool,
        minSubscription,
        APR,
      ])) as Staking;

      await ensureTimestamp(start);
    });

    describe("calculateReward", () => {
      it("works", async () => {
        const reward = await staking.calculateReward(start, end, 100);

        // TODO fake value, just a placeholder for now
        expect(reward).to.equal(8);
      });
    });
  });
});
