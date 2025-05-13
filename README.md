"# uniswap-v3-lp-hardhat" 
## Running the project

Follow these steps to compile, deploy, and test the smart contracts:

1. Compile the contracts:

```bash
npx hardhat compile
```
This compiles all smart contracts in the contracts/ directory.

2. Start a local hardhat node:

```bash
npx hardhat node
```
This launches a local ethereum network at http://127.0.0.1:8545 with chain ID 31337.

3. Deploy the mock contract

In a new terminal, run:

```bash
npx hardhat run ./scripts/deployMock.js --network localhost
```
POSITION_MANAGER address output by this script.

4. Set the POSITION_MANAGER environment variable

Export the address from the previous step:

export POSITION_MANAGER=<ADDRESS_FROM_ABOVE>
Replace <ADDRESS_FROM_ABOVE> with the actual address.

5. Deploy the main contract

```bash
npx hardhat run ./scripts/deploy.js --network localhost
```
This deploys the main contract, using the POSITION_MANAGER address

6. Run the tests

```bash
npx hardhat test --network localhost
```

This executes all unit tests in the test/ directory against the local network.