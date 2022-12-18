import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const useChainConfig = () => {
  const { chains, provider } = configureChains(
    [polygonMumbai],
    [publicProvider()]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Supported Wallets",
      wallets: [metaMaskWallet({ chains })],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const defaultChain = polygonMumbai;
  return { chains, wagmiClient, defaultChain };
};

export default useChainConfig;
