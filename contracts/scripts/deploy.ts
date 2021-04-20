import { ethers } from "hardhat";
import dayjs from "dayjs";

const { parseEther } = ethers.utils;

const FractalIssuerAddress = "TODO";

/// May first
const startDate = dayjs(new Date(2021, 4, 1));
const sixtyDaysLater = startDate.add(60, "days");

const fclArgs = {
  address: "0xf4d861575ecc9493420a3f5a14f85b13f0b50eb3",
  min: parseEther("1"),
  max: parseEther("10000"),
  capPercent: 40,
};

const uniLPArgs = {
  address: "0xdec87f2f3e7a936b08ebd7b2371ab12cc8b68340",
  min: parseEther("1"),
  max: parseEther("10000"),
  capPercent: 40,
};

async function main() {
  const ClaimsRegistry = await ethers.getContractFactory("ClaimsRegistry");
  const Staking = await ethers.getContractFactory("Staking");

  const registry = await ClaimsRegistry.deploy();

  await registry.deployed();

  console.log("Registry deployed to:", registry.address);

  const fclStaking = await Staking.deploy(
    fclArgs.address,
    registry.address,
    FractalIssuerAddress,
    startDate.unix(),
    sixtyDaysLater.unix(),
    fclArgs.min,
    fclArgs.max,
    fclArgs.capPercent
  );

  const uniStaking = await Staking.deploy(
    uniLPArgs.address,
    registry.address,
    FractalIssuerAddress,
    startDate.unix(),
    sixtyDaysLater.unix(),
    uniLPArgs.min,
    uniLPArgs.max,
    uniLPArgs.capPercent
  );

  await fclStaking.deployed();
  await uniStaking.deployed();

  console.log("FCL Staking deployed to:", fclStaking.address);
  console.log("FCL/ETH LP Staking deployed to:", uniStaking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
