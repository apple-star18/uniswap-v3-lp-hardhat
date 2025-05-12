module.exports = {
  solidity: {
    compilers: [
      { version: "0.7.6", settings: { optimizer: { enabled: true, runs: 200 } } },
    ]
  },
  networks: {
    hardhat: {},
    // goerli: {
    //   url: process.env.ALCHEMY_API_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};
