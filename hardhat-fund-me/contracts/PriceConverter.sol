// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

library PriceConverter {
  // Chainlink USD datafeeds return price data with 8 decimals precision, not 18.
  // If you want to convert the value to 18 decimals, you can add 10 zeros to the result.
  function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
    // ABI
    // Address 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    // https://docs.chain.link/docs/ethereum-addresses/
    // https://github.com/smartcontractkit/chainlink
    // https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8/interfaces
    // https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces
    // /AggregatorV3Interface.sol
    // AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e).version();

    // No more need to hardcode the address
    // AggregatorV3Interface priceFeed = AggregatorV3Interface(
    //   0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    // );

    (, int256 price, , , ) = priceFeed.latestRoundData();
    // EHT in terms of USD
    // 3000.00000000 (8 decimals)
    return uint256(price * 1e10); // 1**10 = 10000000000
  }

  function getVersion() internal view returns (uint256) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(
      0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
    );
    return priceFeed.version();
  }

  function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
    internal
    view
    returns (uint256)
  {
    uint256 ethPrice = getPrice(priceFeed);
    // 3000.000000000000000000 ETH / USD PRICE
    // 1.000000000000000000 ETH
    uint256 ethAmountinUsd = (ethPrice * ethAmount) / 1e18;
    return ethAmountinUsd;
  }
}
