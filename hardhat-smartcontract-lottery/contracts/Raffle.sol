// Raffle contract
// Enter the lottery (paying some amount)
// Pick a random winner (verifiably random)
// Winner to be selected every X minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated Execution

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

error Raffle__NotEnoughETHEntered();

contract Raffle is VRFConsumerBaseV2 {
  /* State Variables */
  uint256 private immutable i_entranceFee;
  address payable[] private s_players; // In Storage
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

  /* Events */
  event RaffleEnter(address indexed player);

  constructor(address vrfCoordinatorV2, uint256 entranceFee)
    VRFConsumerBaseV2(vrfCoordinatorV2)
  {
    i_entranceFee = entranceFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
  }

  function enterRaffle() public payable {
    // require (msg.value > i_entranceFee, "Not enough ETH!")
    if (msg.value < i_entranceFee) {
      revert Raffle__NotEnoughETHEntered();
    }
    s_players.push(payable(msg.sender));
    // Events
    // Emit an event when we update a dynamic array or mapping
    // Named events with the function name reversed
    emit RaffleEnter(msg.sender);
  }

  // This will be called by the Chainlink Keeper network
  // External: a little bit cheaper than public (our own
  // contract can call this)
  function requestRandomWinner() external {
    // Request the random number
    // Once we get it, do something with it
    // 2 transactions process (better than 1: more robust
    // against brute force simulate calling)
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    internal
    override
  {
    i_vrfCoordinator.requestRandomWords(
      keyHash, // gasLane
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
  }

  /* View / Pure functions */
  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }
}
