// https://docs.chain.link/docs/ethereum-addresses/
// https://docs.chain.link/docs/vrf/v2/supported-networks/
// https://goerli.etherscan.io/
const networkConfig = {
  31337: {
    name: 'localhost',
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  // 42: {
  //   name: 'kovan',
  //   ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
  // },
  4: {
    name: 'rinkeby',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
  },
  5: {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    vrfCoordinatorV2: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
  },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
}
