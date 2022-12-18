import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("QuadraticVoting positiveVote tests", () => {
  it("Should not allow vote on item that was made by the same user", async () => {
    const { QuadraticVotingContract, Alice, fullEther } = await loadFixture(
      deployFixture
    );

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Alice).positiveVote(0, 1, {
        value: fullEther,
      })
    ).be.revertedWithCustomError(
      QuadraticVotingContract,
      "CannotVoteOnYourOwnItem"
    );
  });

  it("Should not allow vote with an insufficient value", async () => {
    const { QuadraticVotingContract, Alice, Bob } = await loadFixture(
      deployFixture
    );

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;
    0;
    await expect(
      QuadraticVotingContract.connect(Bob).positiveVote(0, 10, {
        value: 0,
      })
    ).be.revertedWithCustomError(QuadraticVotingContract, "InsufficientValue");
  });

  it("Should allow a positive vote", async () => {
    const { QuadraticVotingContract, Alice, Bob, fullEther } =
      await loadFixture(deployFixture);

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Bob).positiveVote(0, 1, {
        value: fullEther,
      })
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Bob).positiveVote(0, 1, {
        value: fullEther,
      })
    ).not.be.reverted;
  });
});
