import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useState } from "react";
import { Contract, ethers } from "ethers";
import { QuadraticVoting__factory } from "../contracts/typechain-types";
import { VotingItem } from "../consts/types";
import axios from "axios";

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
  const [contract, setContract] = useState<Contract | undefined>();

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

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const QuadraticVotingContract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT as string,
        QuadraticVoting__factory.abi,
        signer
      );

      setContract(QuadraticVotingContract);
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
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    let data = new FormData();
    data.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });

    data.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });

    data.append("pinataOptions", options);

    try {
      const res = await axios.post(url, data, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        },
      });

      return res.data.IpfsHash;
    } catch (err) {
      console.log(
        "Something went wrong uploading the data to IPFS through Pinata ",
        err
      );
    }
  };

  const createItem = async (
    title: string,
    imageHash: any,
    description: string
  ) => {
    await contract.createItem(
      ethers.utils.formatBytes32String(title),
      imageHash,
      description,
      {
        gasLimit: 100000,
      }
    );
  };

  const itemCount = async () => {
    const count: number = await contract.itemCount();
    return count;
  };

  const items = async (itemId: number) => {
    const item = await contract.items(itemId, {
      gasLimit: 100000,
    });

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
    return await contract.positiveVote(itemId, weight, {
      value: cost,
      gasLimit: 100000,
    });
  };

  const negativeVote = async (itemId: number, weight: number, cost: number) => {
    return await contract.negativeVote(itemId, weight, {
      value: cost,
      gasLimit: 100000,
    });
  };

  const currentWeight = async (itemId: number, isPositive: boolean) => {
    return await contract.currentWeight(itemId, account, isPositive, {
      gasLimit: 100000,
    });
  };

  const calcCost = async (currWeight: number, weight: number) => {
    return await contract.calcCost(currWeight, weight, { gasLimit: 100000 });
  };

  const voteCost = async () => {
    return await contract.voteCost({ gasLimit: 100000 });
  };

  const claim = async (itemId: number) => {
    return await contract.claim(itemId, { gasLimit: 100000 });
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
