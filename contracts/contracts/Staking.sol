// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./Staking/Infra.sol";
import "./Staking/CappedRewardCalculator.sol";
import "./ClaimsRegistry.sol";

/// @title A staking contract which allows only verified users (by checking a separate contract for a valid signature)
/// @author Miguel Palhas <miguel@subvisual.co>
contract Staking is StakingInfra, CappedRewardCalculator {
  /// @notice the token to stake
  ERC20 public erc20;

  /// @notice claim registry where signatures are to be stored and verified
  IClaimsRegistryVerifier public registry;

  /// @notice The expected issuer address against which claims will be verified (i.e. they must be signed by this address)
  address public claimIssuer;

  /// @notice How much can be staked in total
  uint public totalMaxAmount;

  /// @notice The minimum staking amount per account
  uint public individualMinimumAmount;

  /// @notice How many tokens are currently locked (already reserverd for a user)
  uint public lockedTokens = 0;

  /// @notice Subscription details for each account
  mapping(address => Subscription) public subscriptions;

  /// @notice Emitted when an account stakes tokens and creates a new subscription
  event Subscribed(
    address subscriber,
    uint date,
    uint stakedAmount,
    uint maxReward
  );

  /// @notice Emitted when an account withdraws an existing stake
  event Withdrawn(
    address subscriber,
    uint date,
    uint withdrawAmount
  );

  /// @notice Details of a particular subscription
  struct Subscription {
    address subscriberAddress; // addres the subscriptions refers to
    uint startDate;            // Block timestamp at which the subscription was made
    uint stakedAmount;         // How much was staked
    uint maxReward;            // Maximum reward given if user stays until the end of the staking period
    uint withdrawAmount;       // Total amount withdrawn (initial amount + final calculated reward)
    uint withdrawDate;         // Block timestamp at which the subscription was withdrawn (or 0 while staking is in progress)
  }

  /// @notice Staking constructor
  /// @param _token ERC20 token address to use
  /// @param _registry ClaimsRegistry address to use
  /// @param _issuer expected issuer of claims when verifying them
  /// @param _startDate timestamp at which stake requests begin to be allowed. Must be greater than the contract instantiation timestamp
  /// @param _linearStartDate timestamp at which staking switches form a curve calculation to a linear calculation. Must be after _startDate
  /// @param _endDate timestamp at which staking is over (no more rewards are given, and new stakes are not allowed)
  /// @param _totalMaxAmount total amount of tokens that should be allowed during the entire period
  /// @param _individualMinimumAmount minimum staking amount for each account
  /// @param _curveCap max % of individual reward for curve period
  /// @param _constantAPR APR to use for constant period after curvec
  constructor(
    address _token,
    address _registry,
    address _issuer,
    uint _startDate,
    uint _linearStartDate,
    uint _endDate,
    uint _totalMaxAmount,
    uint _individualMinimumAmount,
    uint _curveCap,
    uint _constantAPR
  ) CappedRewardCalculator(_startDate, _linearStartDate, _endDate, _curveCap, _constantAPR) {
    require(_token != address(0), "Staking: token address cannot be 0x0");
    require(_registry != address(0), "Staking: claims registry address cannot be 0x0");
    require(_issuer != address(0), "Staking: claim issuer cannot be 0x0");
    require(block.timestamp <= _startDate, "Staking: start date must be in the future");
    require(_totalMaxAmount > 0, "Staking: invalid max amount");
    require(_individualMinimumAmount > 0, "Staking: invalid individual min amount");
    require(
      _totalMaxAmount > _individualMinimumAmount,
      "Staking: max amount needs to be greater than individual minimum"
    );

    erc20 = ERC20(_token);
    registry = IClaimsRegistryVerifier(_registry);
    claimIssuer = _issuer;
    require(_totalMaxAmount <= erc20.totalSupply(), "Staking: max amount is greater than total available supply");

    totalMaxAmount = _totalMaxAmount;
    individualMinimumAmount = _individualMinimumAmount;
  }

  /// TODO: totalMaxAcount not being considered
  /// @notice Requests a new stake to be created. Only one stake per account is created, maximum rewards are calculated upfront, and a valid claim signature needs to be provided, which will be checked against the expected issuer on the registry contract
  /// @param _amount Amount of tokens to stake
  /// @param claimSig Signature to check against the registry contract
  function stake(uint _amount, bytes calldata claimSig) external whenNotPaused {
    uint time = block.timestamp;
    address subscriber = msg.sender;

    require(registry.verifyClaim(msg.sender, claimIssuer, claimSig), "Staking: could not verify claim");
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

  /// @notice Withdrawn the stake belonging to `msg.sender`
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

  /// @notice returns the initial amount staked by a given account
  /// @param _subscriber The account to check
  /// @return The amount that was staked by the given account
  function getStakedAmount(address _subscriber) external view returns (uint) {
    if (subscriptions[_subscriber].stakedAmount > 0 && subscriptions[_subscriber].withdrawDate == 0) {
      return subscriptions[_subscriber].stakedAmount;
    } else {
      return 0;
    }
  }

  // TODO function getStakeReward(address _subscriber)
}
