require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // goerli: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    // },
  },
};
