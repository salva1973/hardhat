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
  bytes32 private immutable i_gasLane;
  uint64 private immutable i_subscriptionId;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;

  /* Events */
  event RaffleEnter(address indexed player);
  event RequestedRaffleWinner(uint256 indexed requestId);

  constructor(
    address vrfCoordinatorV2,
    uint256 entranceFee,
    bytes32 gasLane,
    uint64 subscriptionId,
    uint32 callbackGasLimit
  ) VRFConsumerBaseV2(vrfCoordinatorV2) {
    i_entranceFee = entranceFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_gasLane = gasLane;
    i_subscriptionId = subscriptionId;
    i_callbackGasLimit = callbackGasLimit;
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
    uint256 requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane, // gasLane
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
    emit RequestedRaffleWinner(requestId);
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
    internal
    override
  {
    // MODULO
    // s_players size 10
    // randomNumber 202
    // 202 % 10 = 2 (number between 0 and 9: ok for array indexes)
    uint256 indexOfWinner = randomWords[0] % s_players.length;
    address payable recentWinner = s_players[indexOfWinner];
  }

  /* View / Pure functions */
  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getPlayer(uint256 index) public view returns (address) {
    return s_players[index];
  }
}