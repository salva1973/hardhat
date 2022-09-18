const { assert, expect } = require('chai')
const { network, getNamedAccounts, deployments, ethers } = require('hardhat')
const { developmentChains, networkConfig } = require('../../helper-hardhat-config')

// TO BE ABLE TO TEST ON TESTNET
// 1. Get our SubId for Chainlink VRF
// vrf.chain.link
// Chain Id
// Costs
// https://docs.chain.link/docs/vrf/v2/supported-networks/
// 2. Deploy our contract using the SUbId
// https://goerli.etherscan.io/
// https://goerli.etherscan.io/address/0x6a04aEdA490b7794982DEe1D56a801Aa6D533Ae2#code
// 3. Register the contract with Chainlink VRF and its SubId
// 4. Register the contract with Chainlink Keepers
// 5. Run staging tests

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Raffle Staging Tests', function () {
      let raffle, raffleEntranceFee, deployer

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        raffle = await ethers.getContract('Raffle', deployer)
        raffleEntranceFee = await raffle.getEntranceFee()
      })

      describe('fulfillRandomWords', function () {
        it('works with live Chainlink Keepers and Chainlink VRF, we get a random winner', async function () {
          // enter the Raffle
          console.log('Setting up test...')
          const startingTimestamp = await raffle.getLatestTimestamp()
          const accounts = await ethers.getSigners()

          console.log('Setting up Listener...')
          await new Promise(async (resolve, reject) => {
            // setup listener before we enter the raffle
            // just in case the blockchain moves REALLY fast
            raffle.once('WinnerPicked', async () => {
              console.log('WinnerPicked event fired!')
              try {
                // add our assert here
                const recentWinner = await raffle.getRecentWinner()
                const raffleState = await raffle.getRaffleState()
                const winnerEndingBalance = await accounts[0].getBalance() // deployer
                const endingTimestamp = await raffle.getLatestTimestamp()

                await expect(raffle.getPlayer(0)).to.be.reverted
                assert.equal(recentWinner.toString(), accounts[0].address)
                assert.equal(raffleState, 0)
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                )
                assert(endingTimestamp > startingTimestamp)
                resolve()
              } catch (error) {
                console.log(error)
                reject(error)
              }
            })
            // The entering the raffle
            console.log('Entering Raffle...')
            await raffle.enterRaffle({ value: raffleEntranceFee })
            const winnerStartingBalance = await accounts[0].getBalance()
          })

          // and this code WON'T complete until our listener has finished listening!
        })
      })
    })
