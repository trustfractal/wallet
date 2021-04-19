import chai from "chai";
import { ethers, network, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import dayjs from "dayjs";

import { FractalToken as FCL } from "../../typechain/FractalToken";
import FCLArtifact from "../../artifacts/contracts/Test/FractalToken.sol/FractalToken.json";
import { Staking } from "../../typechain/Staking";
import StakingArtifact from "../../artifacts/contracts/Staking.sol/Staking.json";
import { FakeClaimsRegistry } from "../../typechain/FakeClaimsRegistry";
import FakeClaimsRegistryArtifact from "../../artifacts/contracts/Staking/FakeClaimsRegistry.sol/FakeClaimsRegistry.json";

chai.use(solidity);
const { BigNumber: BN } = ethers;
const { parseEther } = ethers.utils;
const { expect } = chai;
const { deployContract: deploy } = waffle;

let signers: any;
let owner: any;
let alice: any;
let bob: any;
let fcl: any;
let issuer: any;
let registry: any;
const start = dayjs().add(1, "day").unix();
const mid = dayjs().add(2, "day").unix();
const end = dayjs().add(3, "day").unix();

describe("Staking", () => {
  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    alice = signers[1];
    bob = signers[2];
    issuer = signers[3];
  });

  beforeEach(async () => {
    registry = (await deploy(
      owner,
      FakeClaimsRegistryArtifact,
      []
    )) as FakeClaimsRegistry;

    fcl = (await deploy(owner, FCLArtifact, [owner.address])) as FCL;
  });

  describe("constructor", () => {
    it("creates a contract when given valid arguments", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        3,
        2,
        600,
        15,
        10,
      ];

      const staking = (await deploy(owner, StakingArtifact, args)) as Staking;

      expect(await staking.erc20()).to.eq(fcl.address);
      expect(await staking.totalMaxAmount()).to.eq(3);
      expect(await staking.individualMinimumAmount()).to.eq(2);
      expect((await staking.curve()).initialAPR).to.eq(600);
      expect((await staking.curve()).finalAPR).to.eq(15);
      expect((await staking.linear()).initialAPR).to.eq(15);
      expect((await staking.linear()).finalAPR).to.eq(10);
      expect(await staking.lockedTokens()).to.eq(0);
    });

    it("fails if token address is 0x0", async () => {
      const zero = "0x0000000000000000000000000000000000000000";
      const args = [
        zero,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        3,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: token address cannot be 0x0"
      );
    });

    it("fails if registry address is 0x0", async () => {
      const zero = "0x0000000000000000000000000000000000000000";
      const args = [
        fcl.address,
        zero,
        issuer.address,
        start,
        mid,
        end,
        3,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: claims registry address cannot be 0x0"
      );
    });

    it("fails if issuer address is 0x0", async () => {
      const zero = "0x0000000000000000000000000000000000000000";
      const args = [
        fcl.address,
        registry.address,
        zero,
        start,
        mid,
        end,
        3,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: claim issuer cannot be 0x0"
      );
    });

    it("fails if endDate is before startDate", async () => {
      const one_hour_before = dayjs(start).subtract(1, "hour").unix();
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        one_hour_before,
        3,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: end date must be after or at linear start date"
      );
    });

    it("fails if maxAmount is 0", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        0,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith("Staking: invalid max amount");
    });

    it("fails if minIndividualAmount is 0", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        3,
        0,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: invalid individual min amount"
      );
    });

    it("fails if maxCurveAPR is 0", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        3,
        2,
        0,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR"
      );
    });

    it("fails if min amount is larger than total amount", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        1,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: max amount needs to be greater than individual minimum"
      );
    });

    it("fails if max amount is larger than the token's own supply", async () => {
      const supply = await fcl.totalSupply();
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        supply + 1,
        2,
        600,
        15,
        10,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: max amount is greater than total available supply"
      );
    });
  });

  describe("stake", () => {
    let staking: any;

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
    let now = start + 1000;
    const minSubscription = 100;
    let pool: any;
    let amount: any;
    const APR = 10;

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

      pool = (await fcl.totalSupply()).div(2);

      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        mid,
        end,
        3,
        2,
        600,
        15,
        10,
      ];

      staking = (await deploy(owner, StakingArtifact, args)) as Staking;

      // give 50% of the supply to the staking contract
      await fcl.transfer(staking.address, (await fcl.totalSupply()).div(2));

      // pre-approve staking of 1000 tokens
      await fcl.approve(staking.address, parseEther("1000"));

      amount = parseEther("1000");
      now = start + 1000;
      ensureTimestamp(now);
    });

    describe("stake", () => {
      it("works with valid arguments", async () => {
        await staking.stake(parseEther("1000"), "0x00");
      });

      it("fails if claim cannot be verified", async () => {
        await registry.setResult(false);

        const action = staking.stake(parseEther("1000"), "0x00");

        expect(action).to.be.revertedWith("Staking: could not verify claim");
      });

      it("transfers the desired amount tokens from your account to the contract", async () => {
        const ownerBalanceBefore = await fcl.balanceOf(owner.address);
        const stakingBalanceBefore = await fcl.balanceOf(staking.address);
        await staking.stake(parseEther("1000"), "0x00");
        const ownerBalanceAfter = await fcl.balanceOf(owner.address);
        const stakingBalanceAfter = await fcl.balanceOf(staking.address);

        // owner has 1000 less tokens
        expect(ownerBalanceAfter).to.eq(ownerBalanceBefore.sub(amount));

        // contract has 1000 more tokens
        expect(stakingBalanceAfter).to.eq(stakingBalanceBefore.add(amount));

        // allowance is depleted
        expect(await fcl.allowance(owner.address, staking.address)).to.eq(0);
      });

      it("emits a subscription event", async () => {
        const action = staking.stake(parseEther("1000"), "0x00");

        await expect(action).to.emit(staking, "Subscribed");
      });

      it("fails if amount is 0", async () => {
        const action = staking.stake(parseEther("0"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: staked amount needs to be greather than 0"
        );
      });

      it("fails if staking hasn't started yet", async () => {
        // staking starting only a month from now
        staking = (await deploy(owner, StakingArtifact, [
          fcl.address,
          registry.address,
          issuer.address,
          oneMonthLater,
          oneMonthLater + 1,
          oneYearLater,
          pool,
          minSubscription,
          600,
          15,
          10,
        ])) as Staking;

        const action = staking.stake(parseEther("1"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: staking period not started"
        );
      });

      it("fails if address has already staked before", async () => {
        await staking.stake(parseEther("1000"), "0x00");
        await staking.withdraw();

        const action = staking.stake(parseEther("1000"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: this account has already staked"
        );
      });
    });

    describe("getStake", () => {
      it("retrieves the currently staked amount", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        const result = await staking.getStake(owner.address);

        expect(result).to.eq(parseEther("1000"));
      });

      it("is zero for non-existing stakes", async () => {
        const result = await staking.getStake(bob.address);

        expect(result).to.eq(0);
      });

      it("is zero for withdrawn stakes", async () => {
        await staking.stake(parseEther("1000"), "0x00");
        await staking.withdraw();

        const result = await staking.getStake(owner.address);

        expect(result).to.eq(0);
      });
    });

    describe("withdraw", () => {
      it("emits a withdrawal event", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        ensureTimestamp(oneMonthLater);

        const action = staking.withdraw();

        await expect(action).to.emit(staking, "Withdrawn");
      });
    });
  });
});
