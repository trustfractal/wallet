// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

contract LinearRewardCalculator {
  uint256 public APR;
  uint256 constant private year = 365 days;

  constructor(uint256 _APR) {
    require(_APR > 0, "LinearRewardCalculator: invalid APR");

    APR = _APR;
  }

  function calculateReward(
    uint256 _startDate,
    uint256 _endDate,
    uint256 _amount
  ) public view returns(uint256) {
    uint256 duration = _endDate - _startDate;

    return (duration * APR * _amount) / (year * 100);
  }
}
