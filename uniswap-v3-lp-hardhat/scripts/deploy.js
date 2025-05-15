const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require('fs');

async function main() {
    const positionManager = process.env.POSITION_MANAGER;
    if (!positionManager) {
        console.error("Error: POSITION_MANAGER is not set! ")
        process.exit(1);
    }

    const [deployer] = await ethers.getSigners();
    console.log("deployer account:", deployer.address);

    //deploying the PriceCalculator library
    console.log("Deploying PriceCalculator library...");
    const PriceCalculator = await ethers.getContractFactory("PriceCalculator");
    const priceCalculatorLib = await PriceCalculator.deploy();
    await priceCalculatorLib.waitForDeployment();

    console.log("PriceCalculator deployed at:", priceCalculatorLib.target);

    // Connect PriceCalculator to ProvideLiquidity contract and deploy
    const ProvideLiquidity = await ethers.getContractFactory("ProvideLiquidity", {
        libraries: {
            "contracts/utils/PriceCalculator.sol:PriceCalculator": priceCalculatorLib.target,
        },
    });
    console.log("deploying ProvideLiquidity...");
    const contract = await ProvideLiquidity.deploy(positionManager);
    await contract.waitForDeployment();

    console.log("ProvideLiquidity deployment complete:", contract.target);

    const deployedContracts = {
        PriceCalculator: priceCalculatorLib.target,
        ProvideLiquidity: contract.target,
    };
    fs.writeFileSync("deployedContracts.json", JSON.stringify(deployedContracts, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error("Error occurred during deployment:", err);
    process.exit(1);
    });