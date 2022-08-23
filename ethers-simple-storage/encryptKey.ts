// const ethers = require('ethers')
// const fs = require('fs-extra')
// require('dotenv').config()

import { ethers } from 'ethers'
import * as fs from 'fs-extra'
import 'dotenv/config'

const main = async () => {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!) // '!' to specify it's not undefined
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD!,
    process.env.PRIVATE_KEY!
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync('./.encryptedKey.json', encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
