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
const start = dayjs()
  .add(1, "day")
  .unix();
const end = dayjs()
  .add(2, "day")
  .unix();

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
        end,
        2,
        parseEther("10000"),
        100,
      ];

      const staking = (await deploy(owner, StakingArtifact, args)) as Staking;

      expect(await staking.erc20()).to.eq(fcl.address);
      expect(await staking.minAmount()).to.eq(2);
      expect(await staking.maxAmount()).to.eq(parseEther("10000"));
      expect(await staking.cap()).to.eq(100);
      expect(await staking.lockedTokens()).to.eq(0);
    });

    it("fails if token address is 0x0", async () => {
      const zero = "0x0000000000000000000000000000000000000000";
      const args = [
        zero,
        registry.address,
        issuer.address,
        start,
        end,
        2,
        parseEther("10000"),
        100,
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
        end,
        2,
        parseEther("10000"),
        100,
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
        end,
        2,
        parseEther("10000"),
        100,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: claim issuer cannot be 0x0"
      );
    });

    it("fails if endDate is before startDate", async () => {
      const one_hour_before = dayjs(start)
        .subtract(1, "hour")
        .unix();
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        one_hour_before,
        2,
        parseEther("10000"),
        100,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "CappedRewardCalculator: end date must be after start date"
      );
    });

    it("fails if minAmount is 0", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        end,
        0,
        parseEther("10000"),
        100,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: invalid individual min amount"
      );
    });

    it("fails if maxAmount is lower than minAmount", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        end,
        2,
        1,
        100,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: max amount must be higher than min amount"
      );
    });

    it("fails if maxAmount is equal to minAmount", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        end,
        2,
        2,
        100,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "Staking: max amount must be higher than min amount"
      );
    });

    it("fails if cap is 0", async () => {
      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        end,
        2,
        parseEther("10000"),
        0,
      ];

      const action = deploy(owner, StakingArtifact, args);

      await expect(action).to.be.revertedWith(
        "CappedRewardCalculator: curve cap cannot be 0"
      );
    });
  });

  describe("public functions", () => {
    let staking: any;

    /**
     * Assume by default a timespan of 30 days
     * min subscription of 100 units
     * and 50% of the supply available as rewards
     */
    let start = dayjs().unix();
    let oneDayLater = dayjs
      .unix(start)
      .add(1, "day")
      .unix();
    let oneMonthLater = dayjs
      .unix(start)
      .add(30, "day")
      .unix();
    let sixMonthsLater = dayjs
      .unix(start)
      .add(30 * 6, "day")
      .unix();
    let oneYearLater = dayjs
      .unix(start)
      .add(30 * 12, "day")
      .unix();
    let now = start + 1000;
    const minSubscription = parseEther("1");
    const maxSubscription = parseEther("10000");
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

      oneDayLater = dayjs
        .unix(start)
        .add(1, "day")
        .unix();
      oneMonthLater = dayjs
        .unix(start)
        .add(30, "day")
        .unix();
      sixMonthsLater = dayjs
        .unix(start)
        .add(30 * 6, "day")
        .unix();
      oneYearLater = dayjs
        .unix(start)
        .add(30 * 12, "day")
        .unix();

      ensureTimestamp(start);

      const args = [
        fcl.address,
        registry.address,
        issuer.address,
        start,
        oneMonthLater,
        minSubscription,
        maxSubscription,
        100,
      ];

      staking = (await deploy(owner, StakingArtifact, args)) as Staking;

      // give 1000 tokens to staking contract and alice
      await fcl.transfer(staking.address, parseEther("1000"));
      await fcl.transfer(alice.address, parseEther("1000"));

      // pre-approve staking of 1000 tokens for owner & alice
      await fcl.connect(owner).approve(staking.address, parseEther("2000"));
      await fcl.connect(alice).approve(staking.address, parseEther("2000"));

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

        await expect(action).to.be.revertedWith(
          "Staking: could not verify claim"
        );
      });

      it("fails if there are not enough tokens on the pool", async () => {
        const action = staking.stake(parseEther("1010"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: not enough tokens available in the pool"
        );
      });

      // it("fails if maximum")

      it("transfers the desired amount tokens from your account to the contract", async () => {
        expect(await fcl.allowance(owner.address, staking.address)).to.eq(
          parseEther("2000")
        );

        const ownerBalanceBefore = await fcl.balanceOf(owner.address);
        const stakingBalanceBefore = await fcl.balanceOf(staking.address);
        await staking.stake(parseEther("1000"), "0x00");
        const ownerBalanceAfter = await fcl.balanceOf(owner.address);
        const stakingBalanceAfter = await fcl.balanceOf(staking.address);

        // owner has 1000 less tokens
        expect(ownerBalanceAfter).to.eq(ownerBalanceBefore.sub(amount));

        // contract has 1000 more tokens
        expect(stakingBalanceAfter).to.eq(stakingBalanceBefore.add(amount));

        // allowance is now lower
        expect(await fcl.allowance(owner.address, staking.address)).to.eq(
          parseEther("1000")
        );
      });

      it("emits a subscription event", async () => {
        const action = staking.stake(parseEther("1000"), "0x00");

        await expect(action).to.emit(staking, "Subscribed");
      });

      it("fails if amount is lower than minAmount", async () => {
        const action = staking.stake(parseEther("0.5"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: staked amount needs to be greater than or equal to minimum amount"
        );
      });

      it("fails if amount is higher than maxAmount", async () => {
        const action = staking.stake(parseEther("10001"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: staked amount needs to be lower than or equal to maximum amount"
        );
      });

      it("fails if staking hasn't started yet", async () => {
        // staking starting only a month from now
        staking = (await deploy(owner, StakingArtifact, [
          fcl.address,
          registry.address,
          issuer.address,
          oneMonthLater,
          oneYearLater,
          minSubscription,
          maxSubscription,
          100,
        ])) as Staking;

        const action = staking.stake(parseEther("1"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: staking period not started"
        );
      });

      it("fails if address already has an active stake", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        const action = staking.stake(parseEther("1000"), "0x00");

        await expect(action).to.be.revertedWith(
          "Staking: this account has already staked"
        );
      });
    });

    describe("getStakedAmount", () => {
      it("retrieves the currently staked amount", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        const result = await staking.getStakedAmount(owner.address);

        expect(result).to.eq(parseEther("1000"));
      });

      it("is zero for non-existing stakes", async () => {
        const result = await staking.getStakedAmount(bob.address);

        expect(result).to.eq(0);
      });

      it("is zero for withdrawn stakes", async () => {
        await staking.stake(parseEther("1000"), "0x00");
        await staking.withdraw();

        const result = await staking.getStakedAmount(owner.address);

        expect(result).to.eq(0);
      });
    });

    describe("calculateReward", () => {
      it("estimates a reward", async () => {
        const estimation = await staking.calculateReward(
          start,
          oneMonthLater,
          parseEther("1000")
        );

        expect(estimation).to.eq(parseEther("1000"));
      });
    });

    describe("getMaxStakeReward", () => {
      it("retrieves the maximum reward set for an existing subscription", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        const reward = await staking.getMaxStakeReward(owner.address);

        expect(reward).to.eq("998845000000000000000");
      });

      it("is zero for withdrawn subscriptions", async () => {
        await staking.stake(parseEther("1000"), "0x00");
        await staking.withdraw();

        const reward = await staking.getMaxStakeReward(owner.address);

        expect(reward).to.eq(0);
      });

      it("is zero for non-existing subscriptions", async () => {
        const reward = await staking.getMaxStakeReward(owner.address);

        expect(reward).to.eq(0);
      });
    });

    describe("withdraw", () => {
      it("emits a withdrawal event", async () => {
        await staking.stake(parseEther("1000"), "0x00");

        ensureTimestamp(oneMonthLater);

        const action = staking.withdraw();

        await expect(action).to.emit(staking, "Withdrawn");
      });

      it("does not work for already-withdrawn subscriptions", async () => {
        await staking.stake(parseEther("1000"), "0x00");
        await staking.withdraw();

        ensureTimestamp(oneMonthLater);

        const action = staking.withdraw();

        await expect(action).to.revertedWith(
          "Staking: no active subscription found for this address"
        );
      });

      it("can withdrawn two subscriptions to the same address", async () => {
        await staking.stake(parseEther("500"), "0x00");
        await staking.withdraw();
        await staking.stake(parseEther("500"), "0x00");
        await staking.withdraw();
      });

      it("allows multiple users to withdrawn their stake", async () => {
        await staking.connect(owner).stake(parseEther("500"), "0x00");
        await staking.connect(alice).stake(parseEther("500"), "0x00");
        await staking.connect(alice).withdraw();
        await staking.connect(owner).withdraw();
      });
    });

    describe("withdrawPool", () => {
      it("transfers the pool's available balance to the owner", async () => {
        ensureTimestamp(oneMonthLater + 1);

        const ownerBalanceBefore = await fcl.balanceOf(owner.address);
        await staking.withdrawPool();
        const ownerBalanceAfter = await fcl.balanceOf(owner.address);

        expect(ownerBalanceAfter).to.eq(
          ownerBalanceBefore.add(parseEther("1000"))
        );
      });

      it("depletes the available pool", async () => {
        const poolBefore = await staking.availablePoolBalance();
        ensureTimestamp(oneMonthLater + 1);
        await staking.withdrawPool();
        const poolAfter = await staking.availablePoolBalance();

        expect(poolBefore).to.be.gt(poolAfter);
        expect(poolAfter).to.eq(0);
      });

      it("does not transfer locked tokens", async () => {
        await staking.connect(alice).stake(parseEther("10"), "0x00");

        const balanceBefore = await fcl.balanceOf(staking.address);
        ensureTimestamp(oneMonthLater + 1);
        await staking.withdrawPool();
        const balanceAfter = await fcl.balanceOf(staking.address);

        const locked = await staking.lockedTokens();
        const aliceStake = await staking.getStakedAmount(alice.address);
        const aliceReward = await staking.getMaxStakeReward(alice.address);

        expect(balanceBefore).to.be.gt(balanceAfter);
        expect(balanceAfter).to.eq(locked);
        expect(balanceAfter).to.eq(aliceStake.add(aliceReward));
      });

      it("fails during the staking period", async () => {
        ensureTimestamp(oneMonthLater - 1);

        const action = staking.withdrawPool();

        await expect(action).to.be.revertedWith(
          "Staking: staking not over yet"
        );
      });

      it("fails if called by a non-owner", async () => {
        ensureTimestamp(oneMonthLater + 1);

        const action = staking.connect(alice).withdrawPool();

        await expect(action).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
  });
});
