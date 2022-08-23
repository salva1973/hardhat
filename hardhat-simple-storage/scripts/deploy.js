// imports
const { ethers, run, network } = require('hardhat')

// run -> allows us to run any hardhat task

// async main
async function main() {
  //--------------------------------DEPLOY THE CONTRACT--------------------------------//
  // Faster than just using ethers from 'ethers'
  // ethers from 'hardhat' knows about the 'contracts' folder and about
  // the already compiled files, therefore we can do the following:
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
  console.log('Deploying contract...')
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()
  // What about the private key and the rcp url?
  console.log(`Deployed contract to: ${simpleStorage.address}`)
  // Block number
  // const blockNumber = await ethers.provider.getBlockNumber()
  // console.log(`Block Number: ${blockNumber}`)
  //--------------------------------DEPLOY THE CONTRACT--------------------------------//

  //--------------------------------VERIFY THE CONTRACT--------------------------------//
  // What happens when we deploy to our Hardhat network?
  // We don't want to verify when we're using Hardhat network
  // (there's no Hardhat Etherscan API)
  // console.log(network.config)
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    // Rinkeby network (we can verify)
    // Wait for a few blocks to be mined before to proceed with the verification
    // (Best Practice)
    console.log('Waiting for block confirmations...')
    await simpleStorage.deployTransaction.wait(6) // 6 blocks
    await verify(simpleStorage.address, [])
  }
  //--------------------------------VERIFY THE CONTRACT--------------------------------//

  //-----------------------------INTERACT WITH THE CONTRACT----------------------------//
  const currentValue = await simpleStorage.retrieve()
  console.log(`Current Value is ${currentValue}`)

  // Update the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value is ${updatedValue}`)
  //-----------------------------INTERACT WITH THE CONTRACT----------------------------//
}

// Auto-verification for Etherscan (API)
// https://docs.etherscan.io/tutorials/verifying-contracts-programmatically
// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified!')
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
