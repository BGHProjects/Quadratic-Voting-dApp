import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config({ path: __dirname + "/.env" });

const { API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    avalancheTest: {
      url: API_URL,
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
