import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

let Deployer: SignerWithAddress;
let Alice: SignerWithAddress;
let Bob: SignerWithAddress;
let Charlie: SignerWithAddress;

let QuadraticVotingContract;

const halfEther = ethers.utils.parseEther("0.5");
const fullEther = ethers.utils.parseEther("1");
const voteCost = 10_000_000_000;

const deployFixture = async () => {
  [Deployer, Alice, Bob, Charlie] = await ethers.getSigners();

  // Instance of the Quadratic voting contract
  const QuadraticVoting = await ethers.getContractFactory(
    "QuadraticVoting",
    Deployer
  );
  QuadraticVotingContract = await QuadraticVoting.deploy();
  await QuadraticVotingContract.deployed();

  return {
    Deployer,
    Alice,
    Bob,
    Charlie,
    QuadraticVotingContract,
    halfEther,
    fullEther,
    voteCost,
  };
};

export default deployFixture;
