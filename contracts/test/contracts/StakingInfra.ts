import chai from "chai";
import ChaiAsPromised from "chai-as-promised";
chai.use(ChaiAsPromised);
const expect = chai.expect;

import { ethers } from "hardhat";

describe("StakingInfra", async () => {
  const [_owner, alice] = await ethers.getSigners();
  const StakingInfra = await ethers.getContractFactory("StakingInfra");
  let infra: any;

  beforeEach(async () => {
    infra = await StakingInfra.deploy();
    await infra.deployed();
  });

  it("can be paused & unpaused by the owner", async () => {
    expect(await infra.paused()).to.equal(false);
    await infra.pause();
    expect(await infra.paused()).to.equal(true);
    await infra.unpause();
    expect(await infra.paused()).to.equal(false);
  });

  it("cannot be paused by a non-owner", async () => {
    const action = infra.connect(alice).pause();

    await expect(action).to.be.rejectedWith("Ownable: caller is not the owner");
  });

  it("cannot be unpaused while already unpaused", async () => {
    const action = infra.unpause();

    await expect(action).to.be.rejectedWith("Pausable: not paused");
  });

  it("cannot be paused while already paused", async () => {
    await infra.pause();

    const action = infra.pause();

    await expect(action).to.be.rejectedWith("Pausable: paused");
  });
});
