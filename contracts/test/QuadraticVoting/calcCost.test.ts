import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import deployFixture from "./deployFixture";

describe("QuadraticVoting calcCost tests", () => {
  it("Should return 0 when currWeight and weight are equal ", async () => {
    const { QuadraticVotingContract } = await loadFixture(deployFixture);

    expect(await QuadraticVotingContract.calcCost(1, 1)).be.equal(0);
  });

  it("Should handle when currWeight is larger than weight correctly ", async () => {
    const { QuadraticVotingContract, voteCost } = await loadFixture(
      deployFixture
    );

    const correctAnswer = 3 * 3 * voteCost;

    expect(await QuadraticVotingContract.calcCost(4, 3)).be.equal(
      correctAnswer
    );
  });

  it("Should handle when weight is larger than currWeight correctly ", async () => {
    const { QuadraticVotingContract, voteCost } = await loadFixture(
      deployFixture
    );

    const correctAnswer = (2 * 2 - 1 * 1) * voteCost;

    expect(await QuadraticVotingContract.calcCost(1, 2)).be.equal(
      correctAnswer
    );
  });
});
