const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    const MockTokenA = await ethers.getContractFactory("MockTokenA");
    const mockTokenA = await MockTokenA.deploy();
    await mockTokenA.waitForDeployment();
    
    console.log("Mock TokenA deployed at:", mockTokenA.target);
    
    const MockTokenB = await ethers.getContractFactory("MockTokenB");
    const mockTokenB = await MockTokenB.deploy();
    await mockTokenB.waitForDeployment();
    
    console.log("Mock TokenB deployed at:", mockTokenB.target);

    const MockPositionManager = await ethers.getContractFactory("MockPositionManager");
    const mockPositionManager = await MockPositionManager.deploy();
    await mockPositionManager.waitForDeployment();
    
    console.log("Mock PositionManager deployed at:", mockPositionManager.target);

    const MockUniswapV3Pool = await ethers.getContractFactory("MockUniswapV3Pool");
    const liquidity_ = ethers.toBigInt("79228162514264337593543950336");
    const mockUniswapV3Pool = await MockUniswapV3Pool.deploy(liquidity_, 60, mockTokenA.target, mockTokenB.target, 3000);
    await mockUniswapV3Pool.waitForDeployment();
    
    console.log("Mock V3Pool deployed at:", mockUniswapV3Pool.target);

    const deployedContracts_MockDeploy = {
            MockTokenA: mockTokenA.target,
            MockTokenB: mockTokenB.target,
            MockPositionManager: mockPositionManager.target,
            MockUniswapV3Pool: mockUniswapV3Pool.target,
        };
    
    fs.writeFileSync("deployedContracts_MockDeploy.json", JSON.stringify(deployedContracts_MockDeploy, null, 2));

}

main()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error("Error occurred during deployment:", err);
    process.exit(1);
    });