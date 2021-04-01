// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./StakingInfra.sol";

contract Staking is StakingInfra {
  ERC20 public erc20;
  uint256 public startDate;
  uint256 public endDate;
  uint256 public totalMaxAmount;
  uint256 public individualMinimumAmount;
  uint256 public APR;
  uint256 public lockedTokens = 0;

  mapping(address => Subscription) public subscriptions;

  uint256 constant private year = 365 days;

  struct Subscription {
    address subscriberAddress;
    uint256 startDate;
    uint256 stakedAmount;
    uint256 APR; // based on a curve and his subscription timestamp
    uint256 maxReward;
    uint256 withdrawnAmount;
    uint256 withdrawDate;
  }

  constructor(
    address _tokenAddress,
    uint256 _startDate,
    uint256 _endDate,
    uint256 _totalMaxAmount,
    uint256 _individualMinimumAmount,
    uint256 _APR
  ) {
    require(block.timestamp <= _startDate, "Staking: start date must be in the future");
    require(_startDate < _endDate, "Staking: end date must be after start date");
    require(_totalMaxAmount > 0, "Staking: invalid max amount");
    require(_individualMinimumAmount> 0, "Staking: invalid individual min amount");
    require(_APR > 0, "Staking: invalid APR");
    require(_totalMaxAmount > _individualMinimumAmount, "Staking: max amount needs to be greater than individual minimum");

    erc20 = ERC20(_tokenAddress);
    require(_totalMaxAmount <= erc20.totalSupply(), "Staking: max amount is greater than total available supply");

    startDate = _startDate;
    endDate = _endDate;
    totalMaxAmount = _totalMaxAmount;
    individualMinimumAmount = _individualMinimumAmount;
    APR = _APR;
  }

  function getAPRAmount() public view returns (uint256) {
    // TODO
    return 0;
  }

  function stake(uint256 _amount) external whenNotPaused {
    uint256 time = block.timestamp;

    require(_amount > 0);
    require(time >= startDate, "Staking: staking period not started");
    require(time < endDate, "Staking: staking period finished");
    require(subscriptions[msg.sender].startDate == 0, "Staking: this account has already staked");

    uint256 maxReward = calculateReward(time, endDate, _amount);

    subscriptions[msg.sender] = Subscription(
      msg.sender,
      time,
      _amount,
      APR,
      maxReward,
      0,
      0
    );

    // TODO
  }

  function withdraw(uint256 _amount) external whenNotPaused {
    // TODO
  }

  function getStake(address _subscriber) external view returns (bool) {
    // TODO
    return subscriptions[msg.sender].startDate != 0;
  }

  function calculateReward(
    uint256 _startDate,
    uint256 _endDate,
    uint256 _amount
  ) public view returns(uint256) {
    uint256 duration = _endDate - _startDate;

    return (duration * APR * _amount) / year;
  }
}
