// Raffle contract
// Enter the lottery (paying some amount)
// Pick a random winner (verifiably random)
// Winner to be selected every X minutes -> completely automated
// Chainlink Oracle -> Randomness, Automated Execution

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Raffle {
  uint256 private immutable i_entranceFee;

  constructor(uint256 entranceFee) {
    i_entranceFee = entranceFee
  }

  function enterRaffle() {
    // require msg.value > i_entranceFee
  }

  // function pickRandomWinner(){}

  function getEntranceFee() public view returns(unit256) {
    return i_entranceFee
  }
}
