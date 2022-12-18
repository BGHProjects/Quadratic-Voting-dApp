import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("Quadratic Voting claim tests", () => {
  it("Should not allow claiming an item that isn't owned by the caller", async () => {
    const { QuadraticVotingContract, Alice, Bob } = await loadFixture(
      deployFixture
    );

    expect(
      await QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    await expect(
      QuadraticVotingContract.connect(Bob).claim(0)
    ).be.revertedWithCustomError(QuadraticVotingContract, "ItemNotOwned");
  });

  it("Should allow claiming an item", async () => {
    const { QuadraticVotingContract, Alice } = await loadFixture(deployFixture);

    expect(
      await QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    expect(await QuadraticVotingContract.connect(Alice).claim(0)).not.be
      .reverted;
  });
});
