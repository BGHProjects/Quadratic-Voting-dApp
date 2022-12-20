import { ethers } from "hardhat";

async function main() {
  const QVContract = await ethers.getContractFactory("QuadraticVoting");
  const QuadraticVotingContract = await QVContract.deploy();
  await QuadraticVotingContract.deployed();

  console.log(
    "\n\t Quadratic Voting Contract deployed at: ",
    QuadraticVotingContract.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
