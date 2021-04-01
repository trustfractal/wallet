import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
chai.use(ChaiAsPromised);
const expect = chai.expect;

import { ethers } from "hardhat";

describe("Staking", async () => {
  const [_owner, alice] = await ethers.getSigners();
  const Staking = await ethers.getContractFactory("Staking");
  let staking: any;

  beforeEach(async () => {
    staking = await Staking.deploy();
    await staking.deployed();
  });

  describe("Pausable features", () => {
    it("can be paused & unpaused by the owner", async () => {
      expect(await staking.paused()).to.equal(false);
      await staking.pause();
      expect(await staking.paused()).to.equal(true);
      await staking.unpause();
      expect(await staking.paused()).to.equal(false);
    });

    it("cannot be paused by a non-owner", async () => {
      const action = staking.connect(alice).pause();

      await expect(action).to.be.rejectedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("cannot be unpaused while already unpaused", async () => {
      const action = staking.unpause();

      await expect(action).to.be.rejectedWith("Pausable: not paused");
    });

    it("cannot be paused while already paused", async () => {
      await staking.pause();

      const action = staking.pause();

      await expect(action).to.be.rejectedWith("Pausable: paused");
    });
  });
});
