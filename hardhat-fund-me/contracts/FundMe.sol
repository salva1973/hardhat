// Get funds from users
// Withdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
//============== PRAGMA ==============//
pragma solidity ^0.8.8;

//============== IMPORTS ==============//
// import '@nomiclabs/builder/console.sol';
import './PriceConverter.sol';
import 'hardhat/console.sol';

// constant, immutable -> directly into the contract's bytecode instead of storage
// --> saves gas!

//============== ERROR CODES ==============//
error FundMe__NotOwner(); // best practice: prefix with contract name + __

//============== INTERFACES ==============//

//============== LIBRARIES ==============//

//============== CONTRACTS ==============//
// 837,297 gas
// 817,767 gas with constant

/** @title A contract for crowd funding
 *  @author Salvatore Vivolo
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as our library
 */

contract FundMe {
  //============== TYPE DECLARATIONS ==============//
  using PriceConverter for uint256;

  //============== STATE VARIABLES ==============//
  // Changing the visibility from public to private can save some gas
  mapping(address => uint256) private s_addressToAmountFunded; // _s: storage
  address[] private s_funders;
  address private immutable i_owner; // immutable: not storage
  uint256 public constant MINIMUM_USD = 50 * 1e18; // 1 * 10 ** 18
  AggregatorV3Interface public s_priceFeed;

  //============== EVENTS ==============//

  //============== MODIFIERS ==============//
  modifier onlyOwner() {
    // require(msg.sender == i_owner, "Sender is not owner!");
    if (msg.sender != i_owner) {
      revert FundMe__NotOwner(); // Saves lots of gas (we don't have the store the above string)
    }
    _; // then execute the rest of the code
  }

  //============== FUNCTIONS ==============//
  // Functions Order:
  //// constructor
  //// receive
  //// fallback
  //// external
  //// public
  //// internal
  //// private
  //// view / pure

  constructor(address priceFeedAddress) {
    // Immediately called with the contract deployment
    i_owner = msg.sender; // whoever is deploying the contract
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // Explainer from: https://solidity-by-example.org/fallback/
  // Ether is sent to contract
  //      is msg.data empty?
  //          /   \
  //         yes  no
  //         /     \
  //    receive()?  fallback()
  //     /   \
  //   yes   no
  //  /        \
  //receive()  fallback()

  // What happens if someone sends this contract ETH without calling the fund function?
  // receive()
  // fallback()

  receive() external payable {
    fund();
  }

  fallback() external payable {
    fund();
  }

  /**
   *  @notice This functions funds this contract
   *  @dev This implements price feeds as our library
   */
  function fund() public payable {
    // msg.value.getConversionRate();
    // want to be able to set a minimum fund amount in USD
    // 1. How to we send ETH to this contract?
    // require with revert
    // require(getConversionRate(msg.value) >= minimumUsd, "Didn't send enough!");
    // 1e18 == 1 * 10 ** 18 == 1000000000000000000

    // ? probably priceFeed is returned in $ * 10^8
    // console.log(msg.value);
    // console.log(priceFeed);
    // console.log(MINIMUM_USD);
    require( // Could be replaced with revert (error codes are cheaper with gas)
      msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
      'You need to spend more ETH!'
    ); // 1e18 == 1 * 10 ** 18 == 1000000000000000000
    // 18 decimals
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);

    // What is reverting?
    // undo any action before, and send remaining gas back

    // Chainlink
    // https://docs.chain.link/docs/get-the-latest-price/
    // https://faucets.chain.link/
    // https://docs.chain.link/ethereum/
    // https://docs.chain.link/docs/chainlink-keepers/compatible-contracts/
    // https://docs.chain.link/docs/link-token-contracts/
    // https://solidity-by-example.org/
    // TRANSACTION
    // https://rinkeby.etherscan.io/tx/0xbf33c8646cd7859dc66d1b707fc46ecbebb68f94300f99a773c01678d4b243c8
    // CONTRACT
    // https://rinkeby.etherscan.io/address/0x35402d4e5bbe0bef93ba87b41f6ace241a5b8305
  }

  function withdraw() public payable onlyOwner {
    for (
      uint256 funderIndex = 0;
      funderIndex < s_funders.length;
      funderIndex++
    ) {
      address funder = s_funders[funderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    // reset the array
    s_funders = new address[](0);

    // actually withdraw the funds
    // 3 different ways
    // 1. transfer (simplest)
    // this = present contract
    // msg.sender = address
    // payable(msg.sender) = payable address [cast]
    // https://solidity-by-example.org/sending-ether
    // transfer (2300 gas, throws error)
    // send (2300 gas, returns bool)
    // call (forward all gas or set gas, returns bool)
    // payable(msg.sender).transfer(address(this).balance); // automatically reverts with error
    // 2. send
    // bool sendSuccess = payable(msg.sender).send(address(this).balance);
    // require(sendSuccess, "Send failed") // this allows us to revert (get back money) in case of error
    // 3. call (lower level command: powerful-> call to any function, even without API)
    // RECOMMENDED WAY TO SEND AND RECEIVE ETH
    // (bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
    // we have no function in this case, therefore:
    (bool callSuccess, ) = payable(msg.sender).call{
      value: address(this).balance
    }('');
    require(callSuccess, 'Call failed');
  }

  // Gas optimization
  function cheaperWithdraw() public payable onlyOwner {
    address[] memory funders = s_funders;
    // Mappings can't be in memory!
    for (
      uint256 founderIndex = 0;
      founderIndex < funders.length;
      founderIndex++
    ) {
      address funder = funders[founderIndex];
      s_addressToAmountFunded[funder] = 0;
    }
    s_funders = new address[](0);
    (bool success, ) = i_owner.call{value: address(this).balance}('');
    require(success);
  }

  //// view / pure
  function getOwner() public view returns (address) {
    return i_owner;
  }

  // The api to be used externally
  function getFunders(uint256 index) public view returns (address) {
    return s_funders[index]; // s_ to be read by developers only
  }

  function getAddressToAmountFunded(address funder)
    public
    view
    returns (uint256)
  {
    return s_addressToAmountFunded[funder];
  }

  function getPriceFeed()
    public
    view
    returns (AggregatorV3Interface)
  {
    return s_priceFeed;
  }
}

// Chainlink decentralized features
// - Price Feeds
// - VRF
// - Keepers
// - End-to-end reliability

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly
