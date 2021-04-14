// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";

contract CurveRewardCalculator {
  uint256 public startDate;       // beginning of curve period
  uint256 public linearStartDate; // end of curve period / beginning of linear period
  uint256 public endDate;         // end of linear period (and entire staking)

  uint256 public maxCurveAPR;    // beginning of the curve corresponds to this APR
  uint256 public minCurveAPR;    // end of the curve (and beginning of linear period) corresponds to this APR
  uint256 public finalLinearAPR; // lienar period descends towards this APR

  uint256 constant private year = 365 days;
  int256 private constant mul = 100000000;

  constructor(
    uint256 _startDate,
    uint256 _linearStartDate,
    uint256 _endDate,
    uint256 _maxCurveAPR,
    uint256 _minCurveAPR,
    uint256 _finalLinearAPR
  ) {
    require(block.timestamp <= _startDate, "CurveRewardCalculator: start date must be in the future");
    require(_startDate < _linearStartDate, "CurveRewardCalculator: linear start date must be after curve start date");
    require(_linearStartDate <= _endDate, "CurveRewardCalculator: end date must be after or at linear start date");

    require(_maxCurveAPR > _minCurveAPR, "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR");
    require(_minCurveAPR > _finalLinearAPR, "CurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR");

    startDate = _startDate;
    linearStartDate = _linearStartDate;
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

    // TODO
    return 0;
    // grab only range inside curve period
    uint256 start = _start;
    uint256 end = _end > linearStartDate ? linearStartDate : _end;

    uint256 maxDuration = linearStartDate - startDate;
    uint256 startPercent = (start - startDate) * 100 / maxDuration;
    uint256 endPercent = (end - startDate) * 100 / maxDuration;

    int256 maxArea = integralAtPoint(100) - integralAtPoint(0);
    int256 actualArea = integralAtPoint(endPercent) - integralAtPoint(startPercent);

    uint256 ratio = uint256(actualArea * 100 / maxArea);
    console.log("ratio: %d", ratio);

    return minCurveAPR + (maxCurveAPR - minCurveAPR) * ratio;
  }

  function linearPeriodReward(uint256 _start, uint256 _end) public view returns (uint256) {
    // stake has ended before linear period started
    if (_end <= linearStartDate) {
      return 0;
    }

    // grab only range inside linear period
    uint256 start = _start < linearStartDate ? linearStartDate : _start;
    uint256 end = _end;

    uint256 maxDuration = endDate - linearStartDate;
    uint256 actualDuration = end - start;

    return 0;
  }

  function integralAtPoint(uint256 _x) public view returns (int256) {
    int256 x = int256(_x);
    int256 p1 = (x ** 3) * mul / 300;
    int256 p2 = (x ** 2) * mul;
    int256 p3 = (x ** 1) * 100 * mul;

    return (p1 - p2 + p3) / mul;
  }

  function calculateFromAverageAPR(
    uint256 _duration,
    uint256 _amount,
    uint256 _averageAPR
  ) public view returns(uint256) {
    return (_duration * _averageAPR * _amount) / (year * 100);
  }
}
