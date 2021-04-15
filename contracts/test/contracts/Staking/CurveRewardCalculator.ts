import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { CurveRewardCalculator } from "../../../typechain/CurveRewardCalculator";
import CurveRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/CurveRewardCalculator.sol/CurveRewardCalculator.json";
import { TestCurveRewardCalculator } from "../../../typechain/TestCurveRewardCalculator";
import TestCurveRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/TestCurveRewardCalculator.sol/TestCurveRewardCalculator.json";

chai.use(solidity);

const { BigNumber: BN } = ethers;
const { expect } = chai;
const { deployContract: deploy } = waffle;

describe("CurveRewardCalculator", () => {
  let owner: any;
  let calc: any;
  let tester: any;

  let start = dayjs().unix();
  let oneDayLater = dayjs.unix(start).add(1, "day").unix();
  let twoWeeksLater = dayjs.unix(start).add(15, "day").unix();
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

  before(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
  });

  beforeEach(async () => {
    const lastBlock = await ethers.provider.getBlockNumber();
    const timestamp = (await ethers.provider.getBlock(lastBlock)).timestamp;

    start = timestamp + 1;

    oneDayLater = dayjs.unix(start).add(1, "day").unix();
    twoWeeksLater = dayjs.unix(start).add(30, "day").unix();
    sixMonthsLater = dayjs
      .unix(start)
      .add(30 * 6, "day")
      .unix();
    oneYearLater = dayjs
      .unix(start)
      .add(30 * 12, "day")
      .unix();

    ensureTimestamp(start);
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const calc = (await deploy(owner, CurveRewardCalculatorArtifact, [
        start,
        twoWeeksLater,
        sixMonthsLater,
        600,
        15,
        10,
      ])) as CurveRewardCalculator;

      expect(await calc.startDate()).to.eq(start);
      expect(await calc.linearStartDate()).to.eq(twoWeeksLater);
      expect(await calc.endDate()).to.eq(sixMonthsLater);
      expect(await calc.maxCurveAPR()).to.eq(600);
      expect(await calc.minCurveAPR()).to.eq(15);
      expect(await calc.finalLinearAPR()).to.eq(10);
    });

    it("fails if startDate is in the past", async () => {
      const yesterday = dayjs().subtract(1, "day").unix();
      const args = [yesterday, twoWeeksLater, sixMonthsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: start date must be in the future"
      );
    });

    it("fails if linearStartDate is before startDate", async () => {
      const args = [twoWeeksLater, start, sixMonthsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: linear start date must be after curve start date"
      );
    });

    it("fails if endDate is before linearStartDate", async () => {
      const args = [start, sixMonthsLater, twoWeeksLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: end date must be after or at linear start date"
      );
    });

    it("fails if maxCurveAPR is smaller than minCurveAPR", async () => {
      const args = [start, twoWeeksLater, sixMonthsLater, 15, 600, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR"
      );
    });

    it("fails if minCurveAPR is smaller than finalLinearAPR", async () => {
      const args = [start, twoWeeksLater, sixMonthsLater, 600, 10, 15];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR"
      );
    });
  });

  describe("private functions", () => {
    beforeEach(async () => {
      const args = [start, twoWeeksLater, sixMonthsLater, 600, 15, 10];

      tester = (await deploy(
        owner,
        TestCurveRewardCalculatorArtifact,
        args
      )) as TestCurveRewardCalculator;
    });

    describe("truncateToCurvePeriod", () => {
      it("truncates given startDate", async () => {
        const [r1, r2] = await tester.testTruncateToCurvePeriod(
          start - 1,
          start + 1
        );

        expect(r1).to.eq(start);
        expect(r2).to.eq(start + 1);
      });

      it("truncates given endDate", async () => {
        const [r1, r2] = await tester.testTruncateToCurvePeriod(
          start + 1,
          twoWeeksLater + 1
        );

        expect(r1).to.eq(start + 1);
        expect(r2).to.eq(twoWeeksLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToCurvePeriod(
          twoWeeksLater,
          sixMonthsLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toCurvePercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(start, twoWeeksLater);

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start,
          (start + twoWeeksLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          (start + twoWeeksLater) / 2,
          twoWeeksLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start + (twoWeeksLater - start) * 0.1,
          start + (twoWeeksLater - start) * 0.9
        );

        expect(r1).to.eq(10);
        expect(r2).to.eq(90);
      });
    });

    describe("truncateToLinearPeriod", () => {
      it("truncates given startDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          twoWeeksLater - 1,
          twoWeeksLater + 1
        );

        expect(r1).to.eq(twoWeeksLater);
        expect(r2).to.eq(twoWeeksLater + 1);
      });

      it("truncates given endDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          twoWeeksLater + 1,
          sixMonthsLater + 1
        );

        expect(r1).to.eq(twoWeeksLater + 1);
        expect(r2).to.eq(sixMonthsLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          start,
          twoWeeksLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toLinearPercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          twoWeeksLater,
          sixMonthsLater
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          twoWeeksLater,
          (twoWeeksLater + sixMonthsLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          (twoWeeksLater + sixMonthsLater) / 2,
          sixMonthsLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          twoWeeksLater + (sixMonthsLater - twoWeeksLater) * 0.1,
          twoWeeksLater + (sixMonthsLater - twoWeeksLater) * 0.9
        );

        expect(r1).to.eq(10);
        expect(r2).to.eq(90);
      });
    });

    describe("curvePeriodAPR", () => {
      it("is maximum from 0% to 100%", async () => {
        const apr1 = await tester.testCurvePeriodAPR(0, 100);
        const apr2 = await tester.testCurvePeriodAPR(0, 90);

        expect(apr1).to.be.gt(apr2);
      });

      it("is greater if you enter earlier but stay the same time", async () => {
        const apr1 = await tester.testCurvePeriodAPR(0, 30);
        const apr2 = await tester.testCurvePeriodAPR(10, 40);

        expect(apr1).to.be.gt(apr2);
      });

      it("each 10% segment is smaller than or equal the last", async () => {
        let last = 10e10;

        for (let i = 0; i < 100; i += 10) {
          const apr = await tester.testCurvePeriodAPR(i, i + 10);

          expect(apr).to.be.lte(last);
          last = apr;
        }
      });

      it("staying for 10% more increases your total APR", async () => {
        let last = 0;

        for (let i = 0; i < 100; i += 10) {
          const apr = await tester.testCurvePeriodAPR(0, i + 10);

          expect(apr).to.be.gte(last);
          last = apr;
        }
      });

      it("at least on the first 80%, each 10% segment is smaller than the last", async () => {
        let last = 10e10;

        for (let i = 0; i < 80; i += 10) {
          const apr = await tester.testCurvePeriodAPR(i, i + 10);

          expect(apr).to.be.lt(last);
          last = apr;
        }
      });
    });
  });

  describe("public functions", () => {
    beforeEach(async () => {
      const args = [start, twoWeeksLater, sixMonthsLater, 600, 15, 10];

      calc = (await deploy(
        owner,
        CurveRewardCalculatorArtifact,
        args
      )) as CurveRewardCalculator;
    });

    describe("calculate reward", () => {
      it("works for 100 units throught the entire curve period", async () => {
        const reward = await calc.calculateReward(start, twoWeeksLater, 100);

        expect(reward).to.eq(49);
      });

      it("is proportional to how many tokens I stake", async () => {
        const reward100 = await calc.calculateReward(start, twoWeeksLater, 100);
        const reward1000 = await calc.calculateReward(
          start,
          twoWeeksLater,
          1000
        );

        expect(reward1000).to.be.closeTo(reward100.mul(10), 10);
      });

      it("is zero if range is outside period", async () => {
        const reward = await calc.calculateReward(start - 1, start, 100);

        expect(reward).to.eq(0);
      });

      it("increases over time", async () => {
        let last = 0;

        for (let i = 0.1; i <= 1; i += 0.1) {
          const reward = await calc.calculateReward(
            start,
            start + (twoWeeksLater - start) * i,
            1000
          );

          expect(reward).to.be.gt(last);
          last = reward;
        }
      });

      it("is lower for every period", async () => {
        let last = 10e10;

        for (let i = 0.1; i <= 0.8; i += 0.1) {
          const reward = await calc.calculateReward(
            start + (twoWeeksLater - start) * (i - 0.1),
            start + (twoWeeksLater - start) * i,
            1000
          );

          expect(reward).to.be.lt(last);
          last = reward;
        }
      });

      it.only("is", async () => {
        let last = 0;

        for (let i = 0.1; i <= 1; i += 0.1) {
          const reward = await calc.calculateReward(
            start,
            start + (twoWeeksLater - start) * i,
            1000
          );

          console.log(reward.toString());
          expect(reward).to.be.gt(last);
          last = reward;
        }
      });
    });
  });
});
