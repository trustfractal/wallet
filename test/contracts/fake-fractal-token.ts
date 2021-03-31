import { expect } from "chai";
import { ethers } from "hardhat";

describe("FakeFractalToken", () => {
  it("Can be deployed", async () => {
    const accounts = await ethers.getSigners();
    const FCL = await ethers.getContractFactory("FakeFractalToken");
    const fcl = await FCL.deploy(accounts[0].address);
    await fcl.deployed();

    await fcl.transfer(accounts[1].address, 1);

    expect(await fcl.balanceOf(accounts[1].address)).to.equal(1);
  });
});
