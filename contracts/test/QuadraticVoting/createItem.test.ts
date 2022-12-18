import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "ethers";
import deployFixture from "./deployFixture";

describe("QuadraticVoting createItem tests", () => {
  it("Should create a new item", async () => {
    const { QuadraticVotingContract, Alice } = await loadFixture(deployFixture);

    await expect(
      QuadraticVotingContract.connect(Alice).createItem(
        ethers.utils.formatBytes32String("ItemTitle"),
        "ImageHash",
        "ItemDescription"
      )
    ).not.be.reverted;

    expect(await QuadraticVotingContract.itemCount()).be.equal(1);
  });
});
