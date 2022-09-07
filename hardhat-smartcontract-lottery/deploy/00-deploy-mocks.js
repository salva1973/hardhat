const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const BASE_FEE = ethers.utils.parseEther('0.25') // 0.25 is the Premium (0.25 LINK per request)
const GAS_PRICE_LINK = 1e9 // calculated value based on the gas price of the chain (LINK per GAS)

// Eth Price ⬆️ $1,000,000,000
// Chainlink Nodes pay the gas fees to give us randomness & do external execution
// So their price of requests chang based on the price of gas

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts() // from networks' account section
  const chainId = network.config.chainId
  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    log('Local network detected! Deploying mocks...')
    // Deploy a Mock VRF Coordinator
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: args,
    })

    log('Mocks deployed!')
    log('-------------------------------------------------------')
  }
}

module.exports.tags = ['all', 'mocks']
