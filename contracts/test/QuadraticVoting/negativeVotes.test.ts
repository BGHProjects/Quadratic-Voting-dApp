import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("QuadraticVoting negativeVote tests", () => {
  it("Should not allow vote on item that was made by the same user", async () => {
    const { QuadraticVotingContract, Alice, fullEther } = await loadFixture(
      deployFixture
    );

    await expect(
      await QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Alice).negativeVote(0, 1, {
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
      QuadraticVotingContract.connect(Bob).negativeVote(0, 10, {
        value: 0,
      })
    ).be.revertedWithCustomError(QuadraticVotingContract, "InsufficientValue");
  });

  it("Should allow a negative vote", async () => {
    const { QuadraticVotingContract, Alice, Bob, Charlie, fullEther } =
      await loadFixture(deployFixture);

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Bob).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      await QuadraticVotingContract.connect(Bob).negativeVote(0, 2, {
        value: fullEther,
      })
    ).not.be.reverted;

    await expect(
      await QuadraticVotingContract.connect(Bob).negativeVote(0, 2, {
        value: fullEther,
      })
    ).not.be.reverted;

    await expect(
      await QuadraticVotingContract.connect(Charlie).negativeVote(0, 2, {
        value: fullEther,
      })
    ).not.be.reverted;
  });
});
