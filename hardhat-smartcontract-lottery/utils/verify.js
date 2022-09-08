const { run } = require('hardhat')

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

module.exports = { verify }
