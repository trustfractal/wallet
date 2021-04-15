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

  before(async () => {
    console.log("before");
    const signers = await ethers.getSigners();
    owner = signers[0];
  });

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
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const calc = (await deploy(owner, CurveRewardCalculatorArtifact, [
        start,
        oneMonthLater,
        sixMonthsLater,
        600,
        15,
        10,
      ])) as CurveRewardCalculator;

      expect(await calc.startDate()).to.eq(start);
      expect(await calc.linearStartDate()).to.eq(oneMonthLater);
      expect(await calc.endDate()).to.eq(sixMonthsLater);
      expect(await calc.maxCurveAPR()).to.eq(600);
      expect(await calc.minCurveAPR()).to.eq(15);
      expect(await calc.finalLinearAPR()).to.eq(10);
    });

    it("fails if startDate is in the past", async () => {
      const yesterday = dayjs().subtract(1, "day").unix();
      const args = [yesterday, oneMonthLater, sixMonthsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: start date must be in the future"
      );
    });

    it("fails if linearStartDate is before startDate", async () => {
      const args = [oneMonthLater, start, sixMonthsLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: linear start date must be after curve start date"
      );
    });

    it("fails if endDate is before linearStartDate", async () => {
      const args = [start, sixMonthsLater, oneMonthLater, 600, 15, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: end date must be after or at linear start date"
      );
    });

    it("fails if maxCurveAPR is smaller than minCurveAPR", async () => {
      const args = [start, oneMonthLater, sixMonthsLater, 15, 600, 10];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR"
      );
    });

    it("fails if minCurveAPR is smaller than finalLinearAPR", async () => {
      const args = [start, oneMonthLater, sixMonthsLater, 600, 10, 15];

      const action = deploy(owner, CurveRewardCalculatorArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR"
      );
    });
  });

  describe("private functions", () => {
    beforeEach(async () => {
      const args = [start, oneMonthLater, sixMonthsLater, 600, 15, 10];

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
          oneMonthLater + 1
        );

        expect(r1).to.eq(start + 1);
        expect(r2).to.eq(oneMonthLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToCurvePeriod(
          oneMonthLater,
          sixMonthsLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toCurvePercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(start, oneMonthLater);

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start,
          (start + oneMonthLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          (start + oneMonthLater) / 2,
          oneMonthLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToCurvePercents(
          start + (oneMonthLater - start) * 0.1,
          start + (oneMonthLater - start) * 0.9
        );

        expect(r1).to.eq(10);
        expect(r2).to.eq(90);
      });
    });

    describe("truncateToLinearPeriod", () => {
      it("truncates given startDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          oneMonthLater - 1,
          oneMonthLater + 1
        );

        expect(r1).to.eq(oneMonthLater);
        expect(r2).to.eq(oneMonthLater + 1);
      });

      it("truncates given endDate", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          oneMonthLater + 1,
          sixMonthsLater + 1
        );

        expect(r1).to.eq(oneMonthLater + 1);
        expect(r2).to.eq(sixMonthsLater);
      });

      it("gives a 0-length period if outside of bounds", async () => {
        const [r1, r2] = await tester.testTruncateToLinearPeriod(
          start,
          oneMonthLater
        );

        expect(r1).to.eq(r2);
      });
    });

    describe("toLinearPercents", () => {
      it("calculates 0% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneMonthLater,
          sixMonthsLater
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(100);
      });

      it("calculates 0% to 50%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneMonthLater,
          (oneMonthLater + sixMonthsLater) / 2
        );

        expect(r1).to.eq(0);
        expect(r2).to.eq(50);
      });

      it("calculates 50% to 100%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          (oneMonthLater + sixMonthsLater) / 2,
          sixMonthsLater
        );

        expect(r1).to.eq(50);
        expect(r2).to.eq(100);
      });

      it("calculates 10% to 90%", async () => {
        const [r1, r2] = await tester.testToLinearPercents(
          oneMonthLater + (sixMonthsLater - oneMonthLater) * 0.1,
          oneMonthLater + (sixMonthsLater - oneMonthLater) * 0.9
        );

        expect(r1).to.eq(10);
        expect(r2).to.eq(90);
      });
    });
  });

  describe("public functions", () => {
    beforeEach(async () => {
      const args = [start, oneMonthLater, sixMonthsLater, 600, 15, 10];

      calc = (await deploy(
        owner,
        CurveRewardCalculatorArtifact,
        args
      )) as CurveRewardCalculator;
    });

    // describe("calculateReward", () => {
    //   // const amount = BN.from(10).pow(18);

    //   it("works", async () => {
    //     console.log("integral at points:");
    //     for (let i = 0; i <= 100; i += 10) {
    //       console.log(`${i} = `, (await calc.integralAtPoint(i)).toString());
    //     }

    //     console.log("\nearly exit (% of max possible reward):");
    //     for (let i = 10; i <= 100; i += 10) {
    //       console.log(
    //         `0%-${i}% = `,
    //         (await calc.curvePeriodReward(0, i)).toString()
    //       );
    //     }

    //     console.log("reward ranges:");
    //     for (let i = 0; i <= 90; i += 10) {
    //       console.log(
    //         `${i}-${i + 10} = `,
    //         (await calc.curvePeriodReward(i, i + 10)).toString()
    //       );
    //     }
    //   });
    // });
  });
});
