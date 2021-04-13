import { expect } from "chai";
import { ethers, waffle } from "hardhat";

const { deployContract: deploy } = waffle;

import { FractalToken as FCL } from "../../../typechain/FractalToken";
import FCLArtifact from "../../../artifacts/contracts/Test/FractalToken.sol/FractalToken.json";

describe("FakeFractalToken", () => {
  it("Can be deployed", async () => {
    const accounts = await ethers.getSigners();

    const fcl = (await deploy(accounts[0], FCLArtifact, [
      accounts[0].address,
    ])) as FCL;

    await fcl.transfer(accounts[1].address, 1);

    expect(await fcl.balanceOf(accounts[1].address)).to.equal(1);
  });
});
