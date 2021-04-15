// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

contract LinearRewardCalculator {
  uint public APR;
  uint constant private year = 365 days;

  constructor(uint _APR) {
    require(_APR > 0, "LinearRewardCalculator: invalid APR");

    APR = _APR;
  }

  function calculateReward(
    uint _startDate,
    uint _endDate,
    uint _amount
  ) public view returns(uint) {
    uint duration = _endDate - _startDate;

    return (duration * APR * _amount) / (year * 100);
  }
}
