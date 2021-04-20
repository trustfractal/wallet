import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { CappedRewardCalculator } from "../../../typechain/CappedRewardCalculator";
import CappedRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/CappedRewardCalculator.sol/CappedRewardCalculator.json";
import { TestCappedRewardCalculator } from "../../../typechain/TestCappedRewardCalculator";
import TestCappedRewardCalculatorArtifact from "../../../artifacts/contracts/Staking/TestCappedRewardCalculator.sol/TestCappedRewardCalculator.json";

chai.use(solidity);

const { BigNumber: BN } = ethers;
const { parseEther, formatUnits } = ethers.utils;
const { expect } = chai;
const { deployContract: deploy } = waffle;

describe("CappedRewardCalculator", () => {
  let owner: any;
  let calc: any;
  let tester: any;

  let deployDate = dayjs().unix();
  let start = dayjs.unix(deployDate).add(1, "day").unix();
  let oneYearLater = dayjs.unix(start).add(365, "day").unix();

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

    ensureTimestamp(deployDate);
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const calc = (await deploy(owner, CappedRewardCalculatorArtifact, [
        start,
        oneYearLater,
        100,
      ])) as CappedRewardCalculator;

      expect(await calc.startDate()).to.eq(start);
      expect(await calc.endDate()).to.eq(oneYearLater);
      expect(await calc.cap()).to.eq(100);
    });

    it("fails if startDate is in the past", async () => {
      const yesterday = dayjs().subtract(1, "day").unix();
      const args = [yesterday, oneYearLater, 100];

      const action = deploy(owner, CappedRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CappedRewardCalculator: start date must be in the future"
      );
    });

    it("fails if endDate is before startDate", async () => {
      const args = [oneYearLater, start, 100];

      const action = deploy(owner, CappedRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CappedRewardCalculator: end date must be after start date"
      );
    });

    it("fails if curveCap is zero", async () => {
      const args = [start, oneYearLater, 0];

      const action = deploy(owner, CappedRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CappedRewardCalculator: curve cap cannot be 0"
      );
    });
  });

  describe("private functions", () => {
    beforeEach(async () => {
      const args = [start, oneYearLater, 100];

      tester = (await deploy(
        owner,
        TestCappedRewardCalculatorArtifact,
        args
      )) as TestCappedRewardCalculator;
    });

    describe("truncatePeriod", () => {
      it("truncates given startDate", async () => {
        const [r1, r2] = await tester.testTruncatePeriod(start - 1, start + 1);

        expect(r1).to.eq(start);
        expect(r2).to.eq(start + 1);
      });

      it("truncates given endDate", async () => {
        const [r1, r2] = await tester.testTruncatePeriod(
          start + 1,
          oneYearLater + 1
        );

        expect(r1).to.eq(start + 1);
        expect(r2).to.eq(oneYearLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncatePeriod(
          oneYearLater,
          oneYearLater + 10
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toPeriodPercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToPeriodPercents(start, oneYearLater);

        expect(r1).to.eq(0);
        expect(r2).to.eq(1000000);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToPeriodPercents(
          start,
          (start + oneYearLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(500000);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToPeriodPercents(
          (start + oneYearLater) / 2,
          oneYearLater
        );

        expect(r1).to.eq(500000);
        expect(r2).to.eq(1000000);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToPeriodPercents(
          start + (oneYearLater - start) * 0.1,
          start + (oneYearLater - start) * 0.9
        );

        expect(r1).to.eq(100000);
        expect(r2).to.eq(900000);
      });
    });

    describe("curvePeriodPercentage", () => {
      it("is maximum from 0% to 100%", async () => {
        const apr1 = await tester.testCurvePercentage(0, 1000000);
        const apr2 = await tester.testCurvePercentage(0, 900000);

        expect(apr1).to.be.gt(apr2);
      });

      it("is greater if you enter earlier but stay the same time", async () => {
        const apr1 = await tester.testCurvePercentage(0, 300000);
        const apr2 = await tester.testCurvePercentage(100000, 400000);

        expect(apr1).to.be.gt(apr2);
      });

      it("each 10% segment is smaller than or equal the last", async () => {
        let last = 10e10;

        for (let i = 0; i < 1000000; i += 1000000) {
          const apr = await tester.testCurvePercentage(i, i + 100000);

          expect(apr).to.be.lte(last);
          last = apr;
        }
      });

      it("staying for 10% more increases your total APR", async () => {
        let last = 0;

        for (let i = 0; i < 1000000; i += 100000) {
          const apr = await tester.testCurvePercentage(0, i + 10);

          expect(apr).to.be.gte(last);
          last = apr;
        }
      });

      it("at least on the first 80%, each 10% segment is smaller than the last", async () => {
        let last = 10e10;

        for (let i = 0; i < 800000; i += 100000) {
          const apr = await tester.testCurvePercentage(i, i + 100000);

          expect(apr).to.be.lt(last);
          last = apr;
        }
      });
    });
  });

  describe("public functions", () => {
    beforeEach(async () => {
      const args = [start, oneYearLater, 100];

      calc = (await deploy(
        owner,
        CappedRewardCalculatorArtifact,
        args
      )) as CappedRewardCalculator;
    });

    describe("calculate reward", () => {
      describe("for curve period", () => {
        it("works for 100 units throught the entire curve period", async () => {
          const reward = await calc.calculateReward(start, oneYearLater, 100);

          expect(reward).to.eq(100);
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

          for (let i = 0.1; i <= 0.8; i += 0.1) {
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
  //     const args = [start, twoWeeksLater, threeMonthsLater, 100, 15];

  //     calc = (await deploy(
  //       owner,
  //       CappedRewardCalculatorArtifact,
  //       args
  //     )) as CappedRewardCalculator;

  //     tester = (await deploy(
  //       owner,
  //       TestCappedRewardCalculatorArtifact,
  //       args
  //     )) as TestCappedRewardCalculator;
  //   });

  //   it.only("enter at 0%, cumulative earnings", async () => {
  //     for (let enter = 0; enter <= 15; enter += 1) {
  //       for (let exit = enter + 1; exit <= 15; exit += 1) {
  //         const enter_t = dayjs.unix(start).add(enter, "days").unix();
  //         const exit_t = dayjs.unix(start).add(exit, "days").unix();

  //         const reward = await calc.calculateReward(enter_t, exit_t, amount);

  //         console.log(`${enter}, ${exit}, ${formatUnits(reward)}`);
  //       }
  //     }
  //   });
  // });
});
