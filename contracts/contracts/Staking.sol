// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./Staking/Infra.sol";
import "./Staking/CurveRewardCalculator.sol";
import "./ClaimsRegistry.sol";

contract Staking is StakingInfra, CurveRewardCalculator {
  ERC20 public erc20;
  IClaimsRegistryVerifier public registry;
  uint public totalMaxAmount;
  uint public individualMinimumAmount;
  uint public lockedTokens = 0;

  mapping(address => Subscription) public subscriptions;

  // TODO events
  event Subscribed(
    address subscriber,
    uint date,
    uint stakedAmount,
    uint maxReward
  );

  event Withdrawn(
    address subscriber,
    uint date,
    uint withdrawAmount
  );

  struct Subscription {
    address subscriberAddress;
    uint startDate;
    uint stakedAmount;
    uint maxReward;
    uint withdrawAmount;
    uint withdrawDate;
  }

  constructor(
    address _tokenAddress,
    address _claimsRegistryAddress,
    uint _startDate,
    uint _linearStartDate,
    uint _endDate,
    uint _totalMaxAmount,
    uint _individualMinimumAmount,
    uint _maxCurveAPR,
    uint _minCurveAPR,
    uint _finalLinearAPR
  ) CurveRewardCalculator(_startDate, _linearStartDate, _endDate, _maxCurveAPR, _minCurveAPR, _finalLinearAPR) {
    require(_tokenAddress != address(0), "Staking: token address cannot be 0x0");
    require(_claimsRegistryAddress != address(0), "Staking: claims registry address cannot be 0x0");
    require(block.timestamp <= _startDate, "Staking: start date must be in the future");
    require(_totalMaxAmount > 0, "Staking: invalid max amount");
    require(_individualMinimumAmount > 0, "Staking: invalid individual min amount");
    require(
      _totalMaxAmount > _individualMinimumAmount,
      "Staking: max amount needs to be greater than individual minimum"
    );

    erc20 = ERC20(_tokenAddress);
    registry = IClaimsRegistryVerifier(_claimsRegistryAddress);
    require(_totalMaxAmount <= erc20.totalSupply(), "Staking: max amount is greater than total available supply");

    totalMaxAmount = _totalMaxAmount;
    individualMinimumAmount = _individualMinimumAmount;
  }

  function stake(uint _amount) external whenNotPaused {
    uint time = block.timestamp;
    address subscriber = msg.sender;

    require(_amount > 0, "Staking: staked amount needs to be greather than 0");
    require(time >= startDate(), "Staking: staking period not started");
    require(time < endDate(), "Staking: staking period finished");
    require(subscriptions[subscriber].startDate == 0, "Staking: this account has already staked");

    // transfer tokens from subscriber to the contract
    require(erc20.transferFrom(subscriber, address(this), _amount),
      "Staking: Could not transfer tokens from subscriber");

    uint maxReward = calculateReward(time, endDate(), _amount);
    lockedTokens += _amount + maxReward;

    subscriptions[subscriber] = Subscription(
      subscriber,
      time,
      _amount,
      maxReward,
      0,
      0
    );

    emit Subscribed(subscriber, time, _amount, maxReward);
  }

  function withdraw() external whenNotPaused {
    address subscriber = msg.sender;
    uint time = block.timestamp;

    require(subscriptions[subscriber].startDate > 0, "Staking: no subscription found for this address");
    require(subscriptions[subscriber].withdrawDate == 0, "Staking: subscription already withdrawn");

    Subscription memory sub = subscriptions[subscriber];


    uint reward = calculateReward(sub.startDate, time, sub.stakedAmount);
    uint total = sub.stakedAmount + reward;


    // transfer tokens back to subscriber
    require(erc20.transfer(subscriber, total), "Staking: Transfer has failed");

    // update subscription state
    sub.withdrawAmount = sub.stakedAmount + reward;
    sub.withdrawDate = time;
    subscriptions[subscriber] = sub;

    // update locked amount
    lockedTokens = lockedTokens - sub.stakedAmount + sub.maxReward;

    emit Withdrawn(subscriber, time, total);
  }

  function getStake(address _subscriber) external view returns (uint) {
    if (subscriptions[_subscriber].stakedAmount > 0 && subscriptions[_subscriber].withdrawDate == 0) {
      return subscriptions[_subscriber].stakedAmount;
    } else {
      return 0;
    }
  }
}
