import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { LinearRewardCalculator } from "../../../typechain/LinearRewardCalculator";
import LinearRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/LinearRewardCalculator.sol/LinearRewardCalculator.json";

chai.use(solidity);
const { BigNumber: BN } = ethers;
const { expect } = chai;
const { deployContract: deploy } = waffle;

describe("LinearRewardCalculator", () => {
  let owner: any;
  let calc: any;

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const calc = (await deploy(owner, LinearRewardCalculatorArtifact, [
        10,
      ])) as LinearRewardCalculator;

      expect(await calc.APR()).to.eq(10);
    });

    it("fails if APR is 0", async () => {
      const action = deploy(owner, LinearRewardCalculatorArtifact, [0]);

      await expect(action).to.be.revertedWith(
        "LinearRewardCalculator: invalid APR"
      );
    });
  });

  describe("calculateReward", () => {
    /**
     * Assume by default a timespan of 30 days
     * min subscription of 100 units
     * and 50% of the supply available as rewards
     */
    let start = dayjs().unix();
    let oneDay = 3600 * 24;
    let oneDayLater = start + oneDay;
    let oneMonthLater = start + oneDay * 30;
    let sixMonthsLater = start + (oneDay * 365) / 2;
    let oneYearLater = start + oneDay * 365;
    const APR = 10;

    const ensureTimestamp = (timestamp: number): Promise<unknown> => {
      return network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    };

    // set timestamps before each spec
    beforeEach(async () => {
      const lastBlock = await ethers.provider.getBlockNumber();
      const timestamp = (await ethers.provider.getBlock(lastBlock)).timestamp;

      start = timestamp + 1;

      oneMonthLater = start + oneDay * 30;
      sixMonthsLater = start + (oneDay * 365) / 2;
      oneYearLater = start + oneDay * 365;

      ensureTimestamp(start);

      // await ensureTimestamp(start);
      calc = (await deploy(owner, LinearRewardCalculatorArtifact, [
        APR,
      ])) as LinearRewardCalculator;
    });

    const amount = BN.from(10).pow(18);

    const rewardForPeriod = (start: number, end: number): Promise<number> => {
      return calc.calculateReward(start, end, amount);
    };

    it("for the entire period", async () => {
      expect(await rewardForPeriod(start, oneYearLater)).to.equal(
        amount.mul(APR).div(100)
      );
    });

    it("only first 6 months", async () => {
      expect(await rewardForPeriod(start, sixMonthsLater)).to.equal(
        amount.mul(APR).div(2).div(100)
      );
    });

    it("last 6 months", async () => {
      expect(await rewardForPeriod(sixMonthsLater, oneYearLater)).to.equal(
        amount.mul(APR).div(2).div(100)
      );
    });

    it("1 month only", async () => {
      expect(await rewardForPeriod(start, oneMonthLater)).to.be.equal(
        amount.mul(APR).mul(30).div(365).div(100)
      );
    });
  });
});
