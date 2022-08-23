// import
// main function
// calling of main function

// function deployFunc(hre) {
//   console.log('Hi')
// }

// module.exports.default = deployFunc

// hre is passed by hardhat deploy when it
// calls automatically this function

// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre
// }

const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { network } = require('hardhat')
const { verify } = require('../utils/verify')

// Syntactic sugar
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts() // from networks' account section
  const chainId = network.config.chainId

  // if chainId is X use address Y
  // if chainId is Z use address A
  // const ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']

  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get('MockV3Aggregator')
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
  }

  const args = [ethUsdPriceFeedAddress]

  // if the contract doesn't exist, we deploy a minimal version of it
  // for our local testing

  // When going for a localhost or hardhat network we want to use a mock
  // What happens when we want to change chains?
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args: args, // put price feed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  // Verify
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log('-------------------------------------------------------')
}

module.exports.tags = ['all', 'fundme']
