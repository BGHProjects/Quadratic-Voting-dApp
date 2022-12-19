import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useState } from "react";
import { Contract, ethers } from "ethers";
import { QuadraticVoting__factory } from "../contracts/typechain-types";
import * as IPFS from "ipfs-core";
import { VotingItem } from "../consts/types";

interface IWeb3Context {
  account: string;
  connect: () => void;
  createItem: (
    title: string,
    imageHash: any,
    description: string
  ) => Promise<any>;
  handleIPFSUpload: (file: File) => Promise<any>;
  itemCount: () => Promise<number>;
  items: (itemId: number) => Promise<VotingItem | null>;
  rankedItems: () => Promise<VotingItem[]>;
  positiveVote: (itemId: number, weight: number, cost: number) => Promise<any>;
  negativeVote: (itemId: number, weight: number, cost: number) => Promise<any>;
  currentWeight: (itemId: number, isPositive: boolean) => Promise<any>;
  calcCost: (currWeight: number, weight: number) => Promise<any>;
  voteCost: () => Promise<any>;
  claim: (itemId: number) => Promise<any>;
}

export const Web3Context = createContext<IWeb3Context>({} as IWeb3Context);

export const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();

  const [account, setAccount] = useState("");

  const QuadraticVotingContract = new Contract(
    process.env.NEXT_PUBLIC_CONTRACT as string,
    QuadraticVoting__factory.abi
  );

  const connect = async () => {
    try {
      const { ethereum }: any = window;

      if (!ethereum) {
        toast({
          title: "Non-Eth browser detected",
          description: "Please consider using MetaMask",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Just connect the first account
      setAccount(accounts[0]);
    } catch (err) {
      console.log("Error connecting wallet: ", err);
      window.alert("Error connecting wallet, please try again later");
      toast({
        title: "Error connecting wallet",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleIPFSUpload = async (file: File) => {
    const ipfs = await IPFS.create({ repo: "repo" + Math.random() });
    const { cid } = await ipfs.add(file);
    return cid;
  };

  const createItem = async (
    title: string,
    imageHash: any,
    description: string
  ) => await QuadraticVotingContract.createItem(title, imageHash, description);

  const itemCount = async () => {
    const count: number = await QuadraticVotingContract.itemCount();
    return count;
  };

  const items = async (itemId: number) => {
    const item = await QuadraticVotingContract.items(itemId);

    if (item) {
      return {
        id: itemId,
        owner: item.owner,
        amount: item.amount,
        title: ethers.utils.parseBytes32String(item.title),
        imageHash: item.imageHash,
        description: item.description,
        positiveWeight: item.totalPositiveWeight,
        negativeWeight: item.totalNegativeWeight,
      };
    } else {
      return null;
    }
  };

  const rankedItems = async () => {
    const count = await itemCount();
    let itemsArray = [];

    for (let i = 0; i < count; i++) {
      const item = await items(i);
      if (item) itemsArray.push(item);
    }

    return itemsArray.sort((a, b) => {
      const netWeightB = b.positiveWeight - b.negativeWeight;
      const netWeightA = a.positiveWeight - a.negativeWeight;
      return netWeightB - netWeightA; // Sort from greatest to least
    });
  };

  const positiveVote = async (itemId: number, weight: number, cost: number) => {
    return await QuadraticVotingContract.positiveVote(itemId, weight, {
      value: cost,
    });
  };

  const negativeVote = async (itemId: number, weight: number, cost: number) => {
    return await QuadraticVotingContract.negativeVote(itemId, weight, {
      value: cost,
    });
  };

  const currentWeight = async (itemId: number, isPositive: boolean) => {
    return await QuadraticVotingContract.currentWeight(
      itemId,
      account,
      isPositive
    );
  };

  const calcCost = async (currWeight: number, weight: number) => {
    return await QuadraticVotingContract.calcCost(currWeight, weight);
  };

  const voteCost = async () => {
    return await QuadraticVotingContract.voteCost();
  };

  const claim = async (itemId: number) => {
    return await QuadraticVotingContract.claim(itemId);
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        account,
        createItem,
        handleIPFSUpload,
        itemCount,
        items,
        rankedItems,
        positiveVote,
        negativeVote,
        currentWeight,
        calcCost,
        voteCost,
        claim,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
