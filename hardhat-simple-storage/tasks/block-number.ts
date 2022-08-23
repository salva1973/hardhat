// const { task } = require('hardhat/config')
import { task } from 'hardhat/config'

export default task('block-number', 'Prints the current block number').setAction(
  async (taskArgs, hre) => { // Anonymous function; hre = hardhat runtime environment
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current block number: ${blockNumber}`)
  }
)

module.exports = {}