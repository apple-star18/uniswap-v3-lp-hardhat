// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "./utils/TransferHelper.sol";
import "./utils/PriceCalculator.sol";
import "./utils/TickUtils.sol";

contract ProvideLiquidity {
    using PriceCalculator for uint256;

    INonfungiblePositionManager public immutable positionManager;

    struct PoolData {
        address token0;
        address token1;
        uint160 sqrtPriceX96;
        uint160 lowerSqrtPrice;
        uint160 upperSqrtPrice;
        int24 lowerTick;
        int24 upperTick;
    }

    constructor(address _positionManager) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    function provideLiquidity(
        address pool,
        uint256 amount0,
        uint256 amount1,
        uint16 widthBps
    ) external {
        PoolData memory data;

        // ------ Retrieving data from Uniswap V3 Pool ------
        IUniswapV3Pool uniswapPool = IUniswapV3Pool(pool);
        data.token0 = uniswapPool.token0();
        data.token1 = uniswapPool.token1();
        (data.sqrtPriceX96,,,,,,) = uniswapPool.slot0();

        // Calculate price range based on widthBps
        (data.lowerSqrtPrice, data.upperSqrtPrice) = PriceCalculator.calculatePriceRange(data.sqrtPriceX96, widthBps);

        // Convert price range to ticks
        data.lowerTick = TickUtils.getTickAtSqrtRatio(data.lowerSqrtPrice);
        data.upperTick = TickUtils.getTickAtSqrtRatio(data.upperSqrtPrice);

        // ------ token transfer and approve ------
        TransferHelper.safeTransferFrom(data.token0, msg.sender, address(this), amount0);
        TransferHelper.safeTransferFrom(data.token1, msg.sender, address(this), amount1);

        TransferHelper.safeApprove(data.token0, address(positionManager), amount0);
        TransferHelper.safeApprove(data.token1, address(positionManager), amount1);

        // ------ position minting ------
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: data.token0,
            token1: data.token1,
            fee: uniswapPool.fee(),
            tickLower: data.lowerTick,
            tickUpper: data.upperTick,
            amount0Desired: amount0,
            amount1Desired: amount1,
            amount0Min: 0,
            amount1Min: 0,
            recipient: msg.sender,
            deadline: block.timestamp
        });

        (uint256 tokenId, uint256 liquidity, uint256 amount0Used, uint256 amount1Used) = positionManager.mint(params);

        // ------ return surplus assets ------
        if (amount0Used < amount0) {
            TransferHelper.safeTransfer(data.token0, msg.sender, (amount0 - amount0Used));
        }
        if (amount1Used < amount1) {
            TransferHelper.safeTransfer(data.token1, msg.sender, (amount1 - amount1Used));
        }
    }
}
