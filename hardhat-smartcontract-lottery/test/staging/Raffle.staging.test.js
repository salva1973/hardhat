const { assert, expect } = require('chai')
const { network, getNamedAccounts, deployments, ethers } = require('hardhat')
const { developmentChains, networkConfig } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle', function () {
      let raffle, raffleEntranceFee, deployer

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        raffle = await ethers.getContract('Raffle', deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
      })

      describe('fulfillRandomWords', function () {
        it('works with live Chainlink Keepers and Chainlink VRF, we get a random winner', async function () {
          // enter the Raffle
        })
      })
    })
