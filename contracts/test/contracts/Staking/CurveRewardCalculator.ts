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
const { parseEther, formatUnits } = ethers.utils;
const { expect } = chai;
const { deployContract: deploy } = waffle;

describe("CurveRewardCalculator", () => {
  let owner: any;
  let calc: any;
  let tester: any;

  let deployDate = dayjs().unix();
  let start = dayjs.unix(deployDate).add(1, "day").unix();
  let oneYearLater = dayjs.unix(start).add(365, "day").unix();
  let twoYearsLater = dayjs
    .unix(start)
    .add(365 * 2, "day")
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

    deployDate = timestamp + 1;

    start = dayjs.unix(deployDate).add(1, "day").unix();
    oneYearLater = dayjs.unix(start).add(365, "day").unix();
    twoYearsLater = dayjs
      .unix(start)
      .add(365 * 2, "day")
      .unix();

    ensureTimestamp(deployDate);
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const calc = (await deploy(owner, CurveRewardCalculatorArtifact, [
        start,
        oneYearLater,
        twoYearsLater,
        600,
        15,
        10,
      ])) as CurveRewardCalculator;

      expect(await calc.startDate()).to.eq(start);
      expect(await calc.endDate()).to.eq(twoYearsLater);

      expect((await calc.curve()).start).to.eq(start);
      expect((await calc.curve()).end).to.eq(oneYearLater);
      expect((await calc.curve()).initialAPR).to.eq(600);
      expect((await calc.curve()).finalAPR).to.eq(15);

      expect((await calc.linear()).start).to.eq(oneYearLater);
      expect((await calc.linear()).end).to.eq(twoYearsLater);
      expect((await calc.linear()).initialAPR).to.eq(15);
      expect((await calc.linear()).finalAPR).to.eq(10);
    });

    it("fails if startDate is in the past", async () => {
      const yesterday = dayjs().subtract(1, "day").unix();
      const args = [yesterday, oneYearLater, twoYearsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: start date must be in the future"
      );
    });

    it("fails if linearStartDate is before startDate", async () => {
      const args = [oneYearLater, start, twoYearsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: linear start date must be after curve start date"
      );
    });

    it("fails if endDate is before linearStartDate", async () => {
      const args = [start, twoYearsLater, oneYearLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: end date must be after or at linear start date"
      );
    });

    it("fails if maxCurveAPR is smaller than minCurveAPR", async () => {
      const args = [start, oneYearLater, twoYearsLater, 15, 600, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR"
      );
    });

    it("fails if minCurveAPR is smaller than finalLinearAPR", async () => {
      const args = [start, oneYearLater, twoYearsLater, 600, 10, 15];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR"
      );
    });
  });

  describe("private functions", () => {
    beforeEach(async () => {
      const args = [start, oneYearLater, twoYearsLater, 600, 15, 10];

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
          oneYearLater + 1
        );

        expect(r1).to.eq(start + 1);
        expect(r2).to.eq(oneYearLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToCurvePeriod(
          oneYearLater,
          twoYearsLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toCurvePercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(start, oneYearLater);

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start,
          (start + oneYearLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          (start + oneYearLater) / 2,
          oneYearLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start + (oneYearLater - start) * 0.1,
          start + (oneYearLater - start) * 0.9
        );

        expect(r1).to.eq(10);
        expect(r2).to.eq(90);
      });
    });

    describe("truncateToLinearPeriod", () => {
      it("truncates given startDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          oneYearLater - 1,
          oneYearLater + 1
        );

        expect(r1).to.eq(oneYearLater);
        expect(r2).to.eq(oneYearLater + 1);
      });

      it("truncates given endDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          oneYearLater + 1,
          twoYearsLater + 1
        );

        expect(r1).to.eq(oneYearLater + 1);
        expect(r2).to.eq(twoYearsLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          start,
          oneYearLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toLinearPercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneYearLater,
          twoYearsLater
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneYearLater,
          (oneYearLater + twoYearsLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          (oneYearLater + twoYearsLater) / 2,
          twoYearsLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneYearLater + (twoYearsLater - oneYearLater) * 0.1,
          oneYearLater + (twoYearsLater - oneYearLater) * 0.9
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
      const args = [start, oneYearLater, twoYearsLater, 600, 15, 10];

      calc = (await deploy(
        owner,
        CurveRewardCalculatorArtifact,
        args
      )) as CurveRewardCalculator;
    });

    describe("calculate reward", () => {
      describe("for curve period", () => {
        it("works for 100 units throught the entire curve period", async () => {
          const reward = await calc.calculateReward(start, oneYearLater, 100);

          expect(reward).to.eq(100 * (600 / 100));
        });

        it("is proportional to how many tokens I stake", async () => {
          const reward100 = await calc.calculateReward(
            start,
            oneYearLater,
            100
          );
          const reward1000 = await calc.calculateReward(
            start,
            oneYearLater,
            1000
          );

          expect(reward1000).to.be.closeTo(reward100.mul(10), 10);
        });

        it("is zero if range is outside period", async () => {
          const reward = await calc.calculateReward(start - 1, start, 100);

          expect(reward).to.eq(0);
        });

        it("cumulative value increases over time", async () => {
          let last = 0;

          for (let i = 0.1; i <= 1; i += 0.1) {
            const reward = await calc.calculateReward(
              start,
              start + (oneYearLater - start) * i,
              1000
            );

            expect(reward).to.be.gt(last);
            last = reward;
          }
        });

        it("individual value is lower for every period", async () => {
          let last = 10e10;

          for (let i = 0.1; i <= 0.8; i += 0.1) {
            const reward = await calc.calculateReward(
              start + (oneYearLater - start) * (i - 0.1),
              start + (oneYearLater - start) * i,
              1000
            );

            expect(reward).to.be.lt(last);
            last = reward;
          }
        });
      });
      describe("for linear period", () => {
        it("work for 100 units through the entire linear period", async () => {
          const reward = await calc.calculateReward(
            oneYearLater,
            twoYearsLater,
            1000
          );

          expect(reward).to.eq(125);
        });

        it("is larger at the beginning than at the end", async () => {
          const r1 = await calc.calculateReward(
            oneYearLater,
            oneYearLater + (twoYearsLater - oneYearLater) * 0.1,
            1000
          );

          const r2 = await calc.calculateReward(
            oneYearLater + (twoYearsLater - oneYearLater) * 0.9,
            twoYearsLater,
            1000
          );

          expect(r1).to.be.gt(r2);
        });

        it("cumulative value increases over time", async () => {
          let last = 0;

          for (let i = 0.1; i <= 1; i += 0.1) {
            const reward = await calc.calculateReward(
              oneYearLater,
              oneYearLater + (twoYearsLater - oneYearLater) * i,
              1000
            );

            expect(reward).to.be.gt(last);
            last = reward;
          }
        });

        it("individual value is lower for every period", async () => {
          let last = 10e10;

          for (let i = 0.1; i <= 0.8; i += 0.1) {
            const reward = await calc.calculateReward(
              oneYearLater + (twoYearsLater - oneYearLater) * (i - 0.1),
              oneYearLater + (twoYearsLater - oneYearLater) * i,
              100000
            );

            expect(reward).to.be.lt(last);
            last = reward;
          }
        });
      });
    });
  });

  // describe("calculations", () => {
  //   let twoWeeksLater = dayjs.unix(start).add(15, "days").unix();
  //   let threeMonthsLater = dayjs
  //     .unix(start)
  //     .add(30 * 3, "months")
  //     .unix();
  //   let amount = parseEther("1000");

  //   before(async () => {
  //     const args = [start, twoWeeksLater, threeMonthsLater, 600, 5, 4];

  //     calc = (await deploy(
  //       owner,
  //       CurveRewardCalculatorArtifact,
  //       args
  //     )) as CurveRewardCalculator;
  //   });

  //   it.only("enter at 0%, cumulative earnings", async () => {
  //     for (let i = 1; i <= 15; i += 1) {
  //       let type = i <= 15 ? "curve" : "linear";
  //       const enter = start;
  //       const exit = dayjs.unix(start).add(i, "days").unix();

  //       const reward = await calc.calculateReward(enter, exit, amount);

  //       // console.log(`0,${i}, ${type}, ${formatUnits(reward)}`);
  //     }
  //   });
  // });
});
