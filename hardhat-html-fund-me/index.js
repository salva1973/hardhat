// in nodejs
// require() or import

// in front-end javascript you can't use require
// we'll make sure to be able to use import
// NOT POSSIBLE
// const {ethers} = require('ethers')
// https://docs.ethers.io/v5/getting-started/#importing
import { ethers } from './ethers-5.6.esm.min.js'

import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
connectButton.onclick = connect
fundButton.onclick = fund

console.log(ethers)

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      connectButton.innerHTML = 'Connected'
    } catch (error) {
      console.log(error)
    }
  } else {
    connectButton.innerHTML = 'Please install Metamask!'
  }
}

// fund function
// async function fund(ethAmount) {
async function fund() {
  // temporary
  const ethAmount = '1'
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== 'undefined') {
    // provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with
    // ^ ABI & Address
    // Web3Provider similar to JsonRpcProvider we've used before
    // Get the http endpoint from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner() // returns connected account for that wallet
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      // listen for the tx to be mined
      // listen for an event
      // wait for the transaction to finish
      await listenForTransactionMine(transactionResponse, provider)
      console.log('Done')
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  // create a listener for the blockchain
  // listen for the transaction to finish
  // https://docs.ethers.io/v5/api/contract/contract/#Contract-once
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

// withdraw
