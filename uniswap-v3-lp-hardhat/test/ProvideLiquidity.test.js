const { expect } = require("chai");
const { ethers } = require("hardhat");
require("@nomicfoundation/hardhat-chai-matchers");
const fs = require('fs');

describe("ProvideLiquidity Contract", function () {
    let provideLiquidity, provideLiquidityAddress, owner, tokenA, tokenB, mockUniswapV3Pool;

    before(async function () {
        [owner] = await ethers.getSigners();

        const deployedContracts = JSON.parse(fs.readFileSync("deployedContracts.json"));

        provideLiquidityAddress = deployedContracts.ProvideLiquidity;
        provideLiquidity = await ethers.getContractAt("ProvideLiquidity", provideLiquidityAddress);
        
        const deployedContracts_MockDeploy = JSON.parse(fs.readFileSync("deployedContracts_MockDeploy.json"));
        
        const tokenAAddress = deployedContracts_MockDeploy.MockTokenA;
        tokenA = await ethers.getContractAt("MockTokenA", tokenAAddress);        
        
        const tokenBAddress = deployedContracts_MockDeploy.MockTokenB;
        tokenB = await ethers.getContractAt("MockTokenB", tokenBAddress);

        const mockUniswapV3PoolAddress = deployedContracts_MockDeploy.MockUniswapV3Pool;
        mockUniswapV3Pool = await ethers.getContractAt("MockUniswapV3Pool", mockUniswapV3PoolAddress);

        tokenA.mint(owner.address, ethers.parseEther("100"));
        tokenB.mint(owner.address, ethers.parseEther("100"));

    });

    it("Should check deployed contract address", async function () {
        expect(await provideLiquidity.target).to.equal(provideLiquidityAddress);
    });

    it("Should revert if tokens not approved", async function () {
        await expect(provideLiquidity.provideLiquidity(
            mockUniswapV3Pool.target,
            ethers.parseEther("10"),
            ethers.parseEther("10"),
            100
        )).to.be.revertedWith("TransferFrom failed"); 
    });

    it("Should revert with 'Amounts must be > 0'", async function () {
        await expect(
            provideLiquidity.provideLiquidity(
                mockUniswapV3Pool.target,
                ethers.toBigInt(0),
                ethers.toBigInt(0),
                100
            )
        ).to.be.revertedWith("Amounts must be > 0");
    });

    it("Should revert if widthBps is too large", async function () {
        await expect(
            provideLiquidity.provideLiquidity(
                mockUniswapV3Pool.target,
                ethers.parseEther("10"),
                ethers.parseEther("10"),
                10001
            )
        ).to.be.revertedWith("widthBps too large");
    });

    it("Should emit LiquidityProvided event on success", async function () {
        await tokenA.approve(provideLiquidity.target, ethers.parseEther("10"));
        await tokenB.approve(provideLiquidity.target, ethers.parseEther("10"));

        const tx = await provideLiquidity.provideLiquidity(
            mockUniswapV3Pool.target,
            ethers.parseEther("10"),
            ethers.parseEther("10"),
            100);
        await expect(tx).to.emit(provideLiquidity, "LiquidityProvided");
    });

    it("Should return surplus assets correctly", async function () {
        await tokenA.approve(provideLiquidity.target, ethers.parseEther("10"));
        await tokenB.approve(provideLiquidity.target, ethers.parseEther("10"));

        const initialBalanceA = await tokenA.balanceOf(owner.address);
        const initialBalanceB = await tokenB.balanceOf(owner.address);

        const tx = await provideLiquidity.provideLiquidity(
            mockUniswapV3Pool.target,
            ethers.parseEther("10"),
            ethers.parseEther("10"),
            100
        );
        await tx.wait();

        const finalBalanceA = await tokenA.balanceOf(owner.address);
        const finalBalanceB = await tokenB.balanceOf(owner.address);

        expect(finalBalanceA > initialBalanceA - ethers.parseEther("10")).to.be.true;
        expect(finalBalanceB > initialBalanceB - ethers.parseEther("10")).to.be.true;
    });

});