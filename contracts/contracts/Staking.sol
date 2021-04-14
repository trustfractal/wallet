// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./Staking/Infra.sol";
import "./Staking/LinearRewardCalculator.sol";

contract Staking is StakingInfra, LinearRewardCalculator {
  ERC20 public erc20;
  uint256 public startDate;
  uint256 public endDate;
  uint256 public totalMaxAmount;
  uint256 public individualMinimumAmount;
  uint256 public lockedTokens = 0;

  mapping(address => Subscription) public subscriptions;

  // TODO events

  struct Subscription {
    address subscriberAddress;
    uint256 startDate;
    uint256 stakedAmount;
    uint256 maxReward;
    uint256 withdrawAmount;
    uint256 withdrawDate;
  }

  constructor(
    address _tokenAddress,
    uint256 _startDate,
    uint256 _endDate,
    uint256 _totalMaxAmount,
    uint256 _individualMinimumAmount,
    uint256 _APR
  ) LinearRewardCalculator(_APR) {
    require(block.timestamp <= _startDate, "Staking: start date must be in the future");
    require(_startDate < _endDate, "Staking: end date must be after start date");
    require(_totalMaxAmount > 0, "Staking: invalid max amount");
    require(_individualMinimumAmount > 0, "Staking: invalid individual min amount");
    require(
      _totalMaxAmount > _individualMinimumAmount,
      "Staking: max amount needs to be greater than individual minimum"
    );

    erc20 = ERC20(_tokenAddress);
    require(_totalMaxAmount <= erc20.totalSupply(), "Staking: max amount is greater than total available supply");

    startDate = _startDate;
    endDate = _endDate;
    totalMaxAmount = _totalMaxAmount;
    individualMinimumAmount = _individualMinimumAmount;
  }

  function stake(uint256 _amount) external whenNotPaused {
    uint256 time = block.timestamp;
    address subscriber = msg.sender;

    require(_amount > 0, "Staking: staked amount needs to be greather than 0");
    require(time >= startDate, "Staking: staking period not started");
    require(time < endDate, "Staking: staking period finished");
    require(subscriptions[subscriber].startDate == 0, "Staking: this account has already staked");

    // transfer tokens from subscriber to the contract
    require(erc20.transferFrom(subscriber, address(this), _amount),
      "Staking: Could not transfer tokens from subscriber");

    uint256 maxReward = calculateReward(time, endDate, _amount);
    lockedTokens += _amount + maxReward;

    subscriptions[subscriber] = Subscription(
      subscriber,
      time,
      _amount,
      maxReward,
      0,
      0
    );
  }

  function withdraw() external whenNotPaused {
    address subscriber = msg.sender;
    uint256 time = block.timestamp;

    require(subscriptions[subscriber].startDate > 0, "Staking: no subscription found for this address");
    require(subscriptions[subscriber].withdrawDate == 0, "Staking: subscription already withdrawn");

    Subscription memory sub = subscriptions[subscriber];


    uint256 reward = calculateReward(sub.startDate, time, sub.stakedAmount);
    uint256 total = sub.stakedAmount + reward;


    // transfer tokens back to subscriber
    require(erc20.transfer(subscriber, total), "Staking: Transfer has failed");

    // update subscription state
    sub.withdrawAmount = sub.stakedAmount + reward;
    sub.withdrawDate = time;
    subscriptions[subscriber] = sub;

    // update locked amount
    lockedTokens = lockedTokens - sub.stakedAmount + sub.maxReward;
  }

  function getStake(address _subscriber) external view returns (uint256) {
    if (subscriptions[_subscriber].stakedAmount > 0 && subscriptions[_subscriber].withdrawDate == 0) {
      return subscriptions[_subscriber].stakedAmount;
    } else {
      return 0;
    }
  }
}
