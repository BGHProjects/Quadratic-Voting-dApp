import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useState } from "react";
import { Contract } from "ethers";
import { QuadraticVoting__factory } from "../contracts/typechain-types";
import * as IPFS from "ipfs-core";

interface IWeb3Context {
  account: string;
  connect: () => void;
  createItem: (
    title: string,
    imageHash: any,
    description: string
  ) => Promise<any>;
  handleIPFSUpload: (file: File) => Promise<any>;
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

  return (
    <Web3Context.Provider
      value={{ connect, account, createItem, handleIPFSUpload }}
    >
      {children}
    </Web3Context.Provider>
  );
};
