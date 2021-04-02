import chai from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";

chai.use(solidity);
const { expect } = chai;
const { deployContract: deploy } = waffle;

let signers: any;
let owner: nay;
let alice: any;
let infra: any;

import { StakingInfra } from "../../typechain/StakingInfra";
import StakingInfraArtifact from "../../artifacts/contracts/StakingInfra.sol/StakingInfra.json";

describe("StakingInfra", () => {
  before(async () => {
    signers = await ethers.getSigners();
    owner = signers[0];
    alice = signers[1];
  });

  beforeEach(async () => {
    infra = (await deploy(owner, StakingInfraArtifact, [])) as StakingInfra;
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

    await expect(action).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("cannot be unpaused while already unpaused", async () => {
    const action = infra.unpause();

    await expect(action).to.be.revertedWith("Pausable: not paused");
  });

  it("cannot be paused while already paused", async () => {
    await infra.pause();

    const action = infra.pause();

    await expect(action).to.be.revertedWith("Pausable: paused");
  });
});
