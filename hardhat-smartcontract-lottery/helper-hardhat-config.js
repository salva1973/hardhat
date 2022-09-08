// https://docs.chain.link/docs/ethereum-addresses/
// https://docs.chain.link/docs/vrf/v2/supported-networks/

const { ethers } = require('hardhat')

// https://goerli.etherscan.io/
const networkConfig = {
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
    entranceFee: ethers.utils.parseEther('0.01'),
    gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei key hash
    subscriptionId: '0',
    callbackGasLimit: '500000', // 500,000 gas,
    interval: '30', // sec
  },
  5: {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    vrfCoordinatorV2: '0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D',
    entranceFee: ethers.utils.parseEther('0.01'),
    gasLane: '0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15',
    subscriptionId: '0',
    callbackGasLimit: '500000', // 500,000 gas
    interval: '30', // sec
  },
  31337: {
    name: 'hardhat',
    entranceFee: ethers.utils.parseEther('0.01'),
    gasLane: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // we'll use mocks
    callbackGasLimit: '500000', // 500,000 gas
    interval: '30', // sec
  },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
}
