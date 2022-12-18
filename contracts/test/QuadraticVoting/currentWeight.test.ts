import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("QuadraticVoting currentWeight tests", () => {
  it("Should return no positive votes", async () => {
    const { QuadraticVotingContract, Alice } = await loadFixture(deployFixture);

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    expect(
      await QuadraticVotingContract.currentWeight(0, Alice.address, true)
    ).to.equal(0);
  });

  it("Should return correct number of > 0 positive votes", async () => {
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

    expect(
      await QuadraticVotingContract.currentWeight(0, Bob.address, true)
    ).to.equal(1);
  });

  it("Should return no negative votes", async () => {
    const { QuadraticVotingContract, Alice } = await loadFixture(deployFixture);

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    expect(
      await QuadraticVotingContract.currentWeight(0, Alice.address, false)
    ).to.equal(0);
  });

  it("Should return correct number of > 0 negative votes", async () => {
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
      QuadraticVotingContract.connect(Bob).negativeVote(0, 1, {
        value: fullEther,
      })
    ).not.be.reverted;

    expect(
      await QuadraticVotingContract.currentWeight(0, Bob.address, false)
    ).to.equal(1);
  });
});
