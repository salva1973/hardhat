// const { ethers } = require('hardhat')
// const { expect, assert } = require('chai')

import { ethers } from 'hardhat'
import { expect, assert } from 'chai'

import { SimpleStorage, SimpleStorage__factory } from '../typechain-types'

describe('SimpleStorage', function () {  
  // let SimpleStorageFactory, simpleStorage
  let SimpleStorageFactory: SimpleStorage__factory
  let simpleStorage: SimpleStorage

  beforeEach(async function () {
    SimpleStorageFactory = (await ethers.getContractFactory('SimpleStorage')) as SimpleStorage__factory
    simpleStorage = await SimpleStorageFactory.deploy()
  })

  it('Should start with a favorite number of 0', async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = '0'
    // assert (from chai) -> better
    // expect (from chai)
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString().to.equal(expectedValue))
  })

  it('Should update when we call store', async function () {
    const expectedValue = '7'
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })

  it('Should add a person to the array People', async function () {
    const expectedName = 'Salva'
    const expectedValue = '6'
    const transactionResponse = await simpleStorage.addPerson(
      expectedName,
      expectedValue
    )
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.nameToFavoriteNumber(expectedName)
    assert.equal(currentValue.toString(), expectedValue)
  })
})
