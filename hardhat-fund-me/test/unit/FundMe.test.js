const { deployments, ethers, getNamedAccounts } = require('hardhat')
const { assert, expect } = require('chai')
// chai overwritten by waffle (using expect)
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async function () {
      let fundMe
      let deployer
      let mockV3Aggregator
      // const sendValue = "1000000000000000000" // 1 ETH = 1 * 10^18 wei
      const sendValue = ethers.utils.parseEther('1')

      beforeEach(async function () {
        // deploy our FundMe contract
        // using Hardhat-deploy (we'll get also our mocks)

        deployer = (await getNamedAccounts()).deployer
        // Another way (from Hardhat config network section, accounts)
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]

        // allows to deploy all contracts with specific tags
        await deployments.fixture(['all'])
        // Get the most recent
        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3Aggregator = await ethers.getContract(
          'MockV3Aggregator',
          deployer
        )
      })

      describe('constructor', async function () {
        it('sets the aggregator addresses correctly', async function () {
          const response = await fundMe.getPriceFeed()
          assert.equal(response, mockV3Aggregator.address)
        })
      })

      describe('fund', async function () {
        it("Fails it you don't send enough ETH", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            'You need to spend more ETH!'
          )
        })
        it('Updated the amount funded data structure', async function () {
          await fundMe.fund({ value: sendValue })
          const response = await fundMe.getAddressToAmountFunded(deployer)
          console.log(response.toString())
          assert.equal(response.toString(), sendValue.toString())
        })
        it('Adds funder to array of funders', async function () {
          await fundMe.fund({ value: sendValue })

          // Solidity feature of creating a default getter function for all public variables
          const funder = await fundMe.getFunders(0)
          assert.equal(funder, deployer)
        })
      })

      describe('withdraw', async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue })
        })

        it('Withdraw ETH from a single founder', async function () {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt

          const gasCost = effectiveGasPrice.mul(gasUsed) // mul, since it' BIG numbers

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Assert
          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(), // since we work with BIG numbers from BC
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        it('Cheaper withdraw ETH from a single founder', async function () {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Act
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt

          const gasCost = effectiveGasPrice.mul(gasUsed) // mul, since it' BIG numbers

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Assert
          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(), // since we work with BIG numbers from BC
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        it('Allows us to withdraw with multiple funders', async function () {
          // Arrange
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          const transactionResponse = await fundMe.withdraw()

          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = effectiveGasPrice.mul(gasUsed)

          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(), // since we work with BIG numbers from BC
            endingDeployerBalance.add(gasCost).toString()
          )

          // Make sure that the funders are reset properly
          await expect(fundMe.getFunders(0)).to.be.reverted

          for (let i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            )
          }
        })

        it('Only allows the owner to withdraw', async function () {
          const accounts = await ethers.getSigners()
          const attacker = accounts[1]
          const attackerConnectedContract = await fundMe.connect(attacker)
          await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            'FundMe__NotOwner'
          )
        })

        it('Cheaper withdraw testing...', async function () {
          // Arrange
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendValue })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          const transactionResponse = await fundMe.cheaperWithdraw()

          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = effectiveGasPrice.mul(gasUsed)

          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(), // since we work with BIG numbers from BC
            endingDeployerBalance.add(gasCost).toString()
          )

          // Make sure that the funders are reset properly
          // await expect(fundMe.funders(0)).to.be.reverted
          await expect(fundMe.getFunders(0)).to.be.reverted

          for (let i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            )
          }
        })
      })
    })
