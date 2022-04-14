// SPDX-License-Identifier: MIT
pragma solidity =0.8.13;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';

contract Poll is Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  EnumerableSet.AddressSet private voters;

  bool public started = false;
  uint256 public voteCount = 0;

  mapping (address => uint8) public votedFor;
  mapping (uint8 => uint256) public totalVotesFor;

  event Vote (address indexed voter, uint8 decision);
  
  function vote(uint8 decision) external {
    require (started, 'not started');
    require (decision != 0, 'wrong decision');
    require (votedFor[msg.sender] == 0, 'already voted');
    require (voters.contains(msg.sender), 'you cannot vote');
    voters.remove(msg.sender);
    votedFor[msg.sender] = decision;
    totalVotesFor[decision]++;
    voteCount++;
    emit Vote(msg.sender, decision);
  }

  function start() external onlyOwner {
    require (!started, 'already started');
    started = true;
  }

  function voterCount() view external returns (uint256) {
    return voters.length();
  }

  function getVoters() view external returns (address[] memory) {
    return voters.values();
  }

  function addVoters(address[] calldata _voters) external onlyOwner {
    require (!started, 'Voting already started');
    require (_voters.length > 0, 'empty array');
    for (uint256 i = 0; i < _voters.length; i++) {
      voters.add(_voters[i]);
    }
  }
}
