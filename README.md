# Ether.js and HardHat projects

- solc compiler
- npm install solc
- but we'll use yarn
- corepack enable (new way to install yarn)
- yarn add solc
- yarn add solc@0.8.7-fixed
- yarn solcjs --help
- yarn solcjs --version

## Compile

- yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol
- add the command in a script 'compile'
- yarn compile

## Ethers.js

- yarn add ethers
- yarn add dotenv (for ENVIRONMENT VARIABLES)

## Notes

- <https://ethervm.io/decompile>
- view and pure functions: if called outside of a contract function all -> no gas fee to be paid
  (just reading... no change to the blockchain state)
- <https://docs.ethers.io/v5/api/utils/bignumber/>
- Big Number library to work safely with big numbers (limitations in JS)
- So when working with Ethers we'll use Big Numbers or strings (otherwise it would be an issue
  for JS)
- If you do not want to use .env files:
  RPC_URL=... PRIVATE_KEY=... node deploy.js
- Key encryption
  PRIVATE*KEY_PASSWORD=... node deploy.js
  history -c (to clear the history) it doesn't work with MacOS?
  or
  nano ~/.zsh_history (delete entries)
  CTRL+* then CTRL+v (end of file): manual deletion (CTRL+k)
  history | tail -n 5
  history -d #command (it doesn't work)
- Prettier
  yarn add prettier prettier-plugin-solidity

## Ganache

- Local blockchain

## Testnets

## Geth (run locally Rinkeby)

## Third-party RPC RPC_URL

- We'll use this method
- Node as a Service
- Alchemy -> we'll use this one
- QuickNode
- Moralis
- Infura
- Verify and Publish on Block Explorers UI
- Verification can be done also programmatically
- Mempool

## Typescript

- yarn add typescript ts-node
- yarn add@types/fs-extra

## Hardhat

- <https://hardhat.org/>
- yarn init
- yarn add --dev hardhat
- npm = yarn
- npx = yarn
- npm install = yarn
- yarn hardhat
- yarn hardhat accounts (not supported anymore?)
- yarn hardhat compile (to compile our projects)
- Check the compiler version against hardhat.config.js
- yarn hardhat run scripts/deploy.js
- Hardhat Network (similar to Ganache, runs in background for our scripts)
- You get automatically a private key and a rcp url
- To be specific:
- yarn hardhat run scripts/deploy.js --network hardhat
- <https://chainlist.org/>
- yarn hardhat run scripts/deploy.js --network rinkeby
- Auto-verification via Etherscan API:
- <https://docs.etherscan.io/tutorials/verifying-contracts-programmatically>
- Even easier with Hardhat plugin:
- <https://docs.etherscan.io/misc-tools-and-utilities/plugins>
- yarn add --dev @nomiclabs/hardhat-etherscan
- Sign in to Etherscan to get the API KEY
- Add it to .env and to the hardhat.config.js
- yarn hardhat
- yarn hardhat verify --help
- Options: <https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-etherscan/src/constants.ts>
- yarn hardhat run scripts/deploy.js (on Hardhat)
- yarn hardhat run scripts/deploy.js --network hardhat (same)
- ChainId of Hardhat: 31337

## Troubleshooting

- In case of issues during the compiling: delete the artifacts and cache folders.

## Tasks

- In hardhat it's possible to create plugins (customized tasks) that we'll find when
  launching the command yarn hardhat.
- <https://hardhat.org/hardhat-runner/docs/advanced/create-task>
- yarn hardhat block-number (gives 0: defaults to hardhat network that is reset at
  every run)
- yarn hardhat block-number --network rinkeby
- scripts and tasks can do the same things
- We'll focus on scripts (tasks are better for plugins and scripts for our local development
  environment)

## Local node with Hardhat

- yarn hardhat node
- we need to add localhost to hardhat.config.js, no account (automatic), only url and chainId
  (always 31337)
- yarn hardhat run scripts/deploy.js --network localhost

## Block Number

- tasks/block-number.js

## Console

- yarn hardhat console --network localhost
- await ethers.provider.getBlockNumber()

## Clean

- yarn hardhat clean -> deletes artifacts folder and cache folder's content

## Testing

- <https://rekt.news>
- Testing is essential! (smart contracts are deployed as open source)
- Hardhat uses Mocha
- For testing: modern programming language (e.g. JS) vs Solidity
- We'll use Javascript (more flexible)
- describe (can be nested), beforeEach, it
- yarn hardhat test
- Focus on one test:
- yarn hardhat test --grep store
- or we use it.only to focus only on that test

## Hardhat Gas Reporter

- yarn add hardhat-gas-reporter --dev
- change in the hardhat.config.js:
  require('hardhat-gas-reporter')
  gasReporter: {
  enabled: true,
  outputFile: 'gas-report.txt',
  noColors: true,
  currenct: 'EUR',
  coinmarketcap: COINMARKETCAP_API_KEY,
  },
- yarn hardhat test (the test reporter will be ran automatically)
- good to optimize gas as much as possible
- <https://coinmarketcap.com/api/>
- yarn hardhat test

## Solidity Coverage

- to check how many lines of our code we cover with tests
- yarn add --dev solidity-coverage
- we add to hardhat.config.js
- yarn hardhat coverage
- output: coverage.json (we add to .gitignore)

## Waffle

- Testing Framework

## Typescript - Part 2

- yarn hardhat -> chose advanced project (it'll create more files)
- if we wanna add the .ts file manually, we're gonna need to add at least:
  - yarn add --dev @typechain/ethers-v5 @typechain/hardhat @types/chai
    @types/node @types/mocha ts-node typechain typescript
- add tsconfig.json
- yarn hardhat run scripts/deploy.ts --network hardhat
- yarn hardhat test
- issues with the tests: we need to give the correct type to our contract
  (SimpleStorage vs Contract) using TYPECHAIN (hardhat plugin)
- in hardhat.config.ts:
  - import '@typechain/hardhar'
- now with yarn hardhat we get a new task called typechain
- yarn hardhat typechain -> creates the correct types for our contract
  (it creates a new folder called 'typechain-types')
- we add in .gitignore: typechain and typechain-types
- in test-deploy.ts: import
- import { SimpleStorage, SimpleStorage\_\_factory } from '../typechain-types'
- and:
- let SimpleStorageFactory: SimpleStorage\_\_factory
- let simpleStorage: SimpleStorage
- SimpleStorageFactory = (await ethers.getContractFactory('SimpleStorage')) as SimpleStorage\_\_factory
- finally: yarn hardhat test

## SUMMARY

- yarn hardhat -> hardhat.config.js -> tasks -> contract -> yarn hardhat compile -> artifacts/cache -> yarn hardhat clean
  -> scripts(local dev) vs tasks(plugins) -> imports (tasks, etc: ethers, run, network) -> async functions -> verification
  with hardhat and hardhat plugins -> contract interaction similar to ethers -> tests -> first look at projects? README and
  tests -> environment variables -> gas reporter -> coverage -> hardhat config -> multiple networks -> evm code -> dev dependencies
  vs regular dependencies -> README -> Getting Started -> Quickstart -> Useage -> Testing

## README.md

- <https://github.com/othneildrew/Best-README-Template>

## Hardhat Fundme

- yarn add hardhat
- yarn hardhat -> advanced project
- Solhint vs ESLint
- Prettier to format our code, Solhint to lint our code (look for error, etc)

```shell
  yarn global add solhint
  npm install -g solhint
  solhint --init
  solhint "contracts/**/*.sol
  yarn add --dev @chainlink/contracts
```

## Hardhat Deploy

- Replicable deployment and easy testing
- yarn add --dev hardhat-deploy
- yarn hardhat -> bunch of news tasks (including deploy)
- it will be the main task we'll use to deploy contracts
- we'll use a deploy folder
- we need also hardhat-deploy-ethers:
- npm install --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
- we override hardhat-ethers with hardhat-deploy-ethers (this allows ether to take
  track of all deployments)
- all scripts in the deploy folder will be run with:
- yarn hardhat deploy
- good practice: to number them

## Mock

- yarn hardhat deploy --network rinkeby
- <https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.6/tests/MockV3Aggregator.sol>
- yarn hardhat compile
- module.exports.tag = ['all', 'mocks'] (in deploy mocks)
- yarn hardhat deploy --tags mocks (test only mock)
- yarn hardhat deploy (test the whole thing on our local chain, hardhat)
- yarn hardhat node -> spin up a bc node that will include already our contracts

## Style Guide

<https://docs.soliditylang.org/en/v0.8.15/style-guide.html>

## NatSpec (Ethereum Natural Language Specification Format)

A way to document our code inspired by Doxygen.

<https://docs.soliditylang.org/en/v0.8.15/natspec-format.html>

With the tags, we can automatically create the documentation.

```shell
  # yarn add solc
  npm install -g solc
  # solc --userdoc --devdoc FundMe.sol
  # solcjs --userdoc --devdoc FundMe.sol
```

## Utils

Script with verification function.

- yarn hardhat deploy --network rinkeby

No mocks.

## Tests

- We'll make our contracts faster and more gas-efficient (Gas Estimator)
- Unit tests: done locally (single pieces of code)
  - local hardhat
  - forket hardhat
- Staging tests: done on a testnet (LAST STOP!!) it's "Integration Tests"
- yarn hardhat test
- yarn hardhat coverage
- yarn hardhat test --grep "amount funded"

## Testnets deprecation

Migrate to Goerli on Alchemy.

<https://goerlifaucet.com/>

## The Merge

<https://www.coindesk.com/learn/what-is-the-merge-and-why-has-it-taken-so-long/>
<https://www.nasdaq.com/articles/goerli-is-coming%3A-ethereums-last-rehearsal-before-the-merge>
<https://goerli.net/>

## Doubts

- decimals and PriceConverter
- grep option with yarn hardhat test (newer version of hardhat required)
- funder(0) instead of funder[0] (getter)
- debugger not working
- import '@nomiclabs/builder/console.sol';
- import 'hardhat/console.sol';
- npm install --save-dev @nomiclabs/buidler
- console.log()

## Upgrades

- yarn outdated
- yarn upgrade-interactive --latest

## Select tests

- yarn hardhat test --grep 'Only allows the owner to withdraw'

## Gas Optimization Techniques

- gas calculated based on EVM OP codes
- SLOAD and SSTORE: lots of gas (800, 20000)

## Storage

- yarn hardhat deploy --tags storage

## Staging test (on a testnet)

- yarn hardhat deploy --network rinkeby
- yarn hardhat test --network rinkeby

## Testing on local node

- yarn hardhat node
- yarn hardhat run scripts/fund.js --network localhost
- yarn hardhat run scripts/withdraw.js --network localhost
- create hardhat-localhost in Metamask

## Hardhat SmartContract Lottery

- yarn add --dev hardhat
- yarn hardhat -> Create an empty hardhat.config.js (this time from scratch)
- yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv
- we add the dependencies in our hardhat.config.js:

```js
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('hardhat-deploy')
require('solidity-coverage')
require('hardhat-gas-reporter')
require('hardhat-contract-sizer')
require('dotenv').config()
```

- we create .prettierrc:

```json
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

- we create the 'contracts' folder, and a new file 'Raffle.sol'
- we prepare a list of the things to be done:

Raffle contract
Enter the lottery (paying some amount)
Pick a random winner (verifiably random)
Winner to be selected every X minutes -> completely automated
Chainlink Oracle -> Randomness, Automated Execution

- yarn hardhat compile (to check everything's fine)
- to save gas: either we use storage, or even immutable when required
- to save gas: use custom errors instead of require (e.g. for entranceFee)
  (we store an error code instead of a string)

## Events

- topics -> indexed parameters
- logs

## Chainlink VRF (Randomness in Web3)

- V2: funding a subscription (instead of using LINK). Subscription: account that helps to maintain
  balance for multiple consumer contracts.
- Randomness:
  <https://docs.chain.link/docs/vrf/v2/examples/get-a-random-number/>
- yarn add --dev @chainlink/contracts

```solidity
function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;
```

- virtual -> to be overridden
- yarn hardhat compile
- hardhat shortcut:
- npm i -g hardhat-shorthand
- in our case:
- yarn global add hardhat-shortcut
- now instead of yarn hardhat compile:
- hh compile

## Chainlink Keepers

- to make things happen automatically, based on events, etc.
- Subscription Id:
  <https://vrf.chain.link/>
- Address to import to see LINK in Metamask (with Goerli):
  <0x326C977E6efc84E512bB9C30f76E30c160eD06FB> (import token)
- test:
- hh deploy or yarn hardhat deploy

## Unit tests

- hh test (or yarn hardhat test)
- hh test --grep "you don't pay enough"
- hh coverage

