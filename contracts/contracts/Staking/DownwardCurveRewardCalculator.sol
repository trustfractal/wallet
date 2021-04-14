// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";

contract DownwardCurveRewardCalculator {
  uint256 public startDate;       // beginning of curve period
  uint256 public linearStartDate; // end of curve period / beginning of linear period
  uint256 public endDate;         // end of linear period (and entire staking)

  uint256 public maxCurveAPR;    // beginning of the curve corresponds to this APR
  uint256 public minCurveAPR;    // end of the curve (and beginning of linear period) corresponds to this APR
  uint256 public finalLinearAPR; // lienar period descends towards this APR

  int256 private constant mul = 100000000;

  constructor(
    uint256 _startDate,
    uint256 _linearStartDate,
    uint256 _endDate,
    uint256 _maxCurveAPR,
    uint256 _minCurveAPR,
    uint256 _finalLinearAPR
  ) {
    require(block.timestamp <= _startDate, "DownwardCurveRewardCalculator: start date must be in the future");
    require(_startDate < _linearStartDate, "DownwardCurveRewardCalculator: linear start date must be after curve start date");
    require(_linearStartDate <= _endDate, "DownwardCurveRewardCalculator: end date must be after or at linear start date");

    require(_maxCurveAPR > _minCurveAPR, "DownwardCurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR");
    require(_minCurveAPR > _finalLinearAPR, "DownwardCurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR");

    startDate = _startDate;
    linearStartDate;
    endDate = _endDate;
    maxCurveAPR = _maxCurveAPR;
    minCurveAPR = _minCurveAPR;
    finalLinearAPR = _finalLinearAPR;
  }

  function calculateReward(uint256 _start, uint256 _end) public view returns (uint256) {
    return curvePeriodReward(_start, _end) + linearPeriodReward(_start, _end);
  }

  function curvePeriodReward(uint256 _start, uint256 _end) public view returns (uint256) {
    // stake has started after curve period ended
    if (_start >= linearStartDate) {
      return 0;
    }

    // grab only range inside curve period
    uint256 start = _start;
    uint256 end = _end > linearStartDate ? linearStartDate : _end;
  }

  function linearPeriodReward(uint256 _start, uint256 _end) public view returns (uint256) {
    // stake has ended before linear period started
    if (_end <= linearStartDate) {
      return 0;
    }

    // grab only range inside linear period
    uint256 start = _start < linearStartDate ? linearStartDate : _start;
    uint256 end = _end;

    return 0;
  }

  function calculateRewardPercentage(
    uint256 _percentStart,
    uint256 _percentEnd
  ) public view returns(uint256) {
    // total max area of the integral (from 0% to 100%)
    int256 total = integralAtPoint(100) - integralAtPoint(0);

    // area corresponding to the period the user's enter and exit timestamps;
    int256 user = integralAtPoint(_percentEnd) - integralAtPoint(_percentStart);

    // ratio between the two is how much reward% he can get
    return uint256(user * 100 / total);
  }

  function integralAtPoint(uint256 _x) public view returns (int256) {
    int256 x = int256(_x);
    int256 p1 = (x ** 3) * mul / 300;
    int256 p2 = (x ** 2) * mul;
    int256 p3 = (x ** 1) * 100 * mul;

    return (p1 - p2 + p3) / mul;
  }
}
