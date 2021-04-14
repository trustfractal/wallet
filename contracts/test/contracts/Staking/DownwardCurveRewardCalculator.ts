import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { DownwardCurveRewardCalculator } from "../../../typechain/DownwardCurveRewardCalculator";
import DownwardCurveRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/DownwardCurveRewardCalculator.sol/DownwardCurveRewardCalculator.json";

chai.use(solidity);

const { BigNumber: BN } = ethers;
const { expect } = chai;
const { deployContract: deploy } = waffle;

describe("DownwardCurveRewardCalculator", () => {
  let owner: any;
  let calc: any;

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
  });

  describe("calculateReward", () => {
    /**
     * Assume by default a timespan of 30 days
     * min subscription of 100 units
     * and 50% of the supply available as rewards
     */
    let start = dayjs().unix();
    let oneDayLater = dayjs.unix(start).add(1, "day").unix();
    let oneMonthLater = dayjs.unix(start).add(30, "day").unix();
    let sixMonthsLater = dayjs
      .unix(start)
      .add(30 * 6, "day")
      .unix();
    let oneYearLater = dayjs
      .unix(start)
      .add(30 * 12, "day")
      .unix();

    const ensureTimestamp = (timestamp: number): Promise<unknown> => {
      return network.provider.send("evm_setNextBlockTimestamp", [timestamp]);
    };

    // set timestamps before each spec
    beforeEach(async () => {
      const lastBlock = await ethers.provider.getBlockNumber();
      const timestamp = (await ethers.provider.getBlock(lastBlock)).timestamp;

      start = timestamp + 1;

      oneDayLater = dayjs.unix(start).add(1, "day").unix();
      oneMonthLater = dayjs.unix(start).add(30, "day").unix();
      sixMonthsLater = dayjs
        .unix(start)
        .add(30 * 6, "day")
        .unix();
      oneYearLater = dayjs
        .unix(start)
        .add(30 * 12, "day")
        .unix();

      ensureTimestamp(start);

      calc = (await deploy(owner, DownwardCurveRewardCalculatorArtifact, [
        start,
        oneMonthLater,
        sixMonthsLater,
        600,
        15,
        10,
      ])) as DownwardCurveRewardCalculator;
    });

    const amount = BN.from(10).pow(18);

    it("works", async () => {
      console.log("integral at points:");
      for (let i = 0; i <= 100; i += 10) {
        console.log(`${i} = `, (await calc.integralAtPoint(i)).toString());
      }

      console.log("\nearly exit (% of max possible reward):");
      for (let i = 10; i <= 100; i += 10) {
        console.log(
          `0%-${i}% = `,
          (await calc.calculateRewardPercentage(0, i)).toString()
        );
      }

      console.log("reward ranges:");
      for (let i = 0; i <= 90; i += 10) {
        console.log(
          `${i}-${i + 10} = `,
          (await calc.calculateRewardPercentage(i, i + 10)).toString()
        );
      }
    });
  });
});
