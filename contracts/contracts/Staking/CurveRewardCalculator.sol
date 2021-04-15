// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";

contract CurveRewardCalculator {
  uint32 public startDate;       // beginning of curve period
  uint32 public linearStartDate; // end of curve period / beginning of linear period
  uint32 public endDate;         // end of linear period (and entire staking)

  uint32 public maxCurveAPR;    // beginning of the curve corresponds to this APR
  uint32 public minCurveAPR;    // end of the curve (and beginning of linear period) corresponds to this APR
  uint32 public finalLinearAPR; // lienar period descends towards this APR

  uint256 constant private year = 365 days;
  int256 private constant mul = 100000000;

  constructor(
    uint32 _startDate,
    uint32 _linearStartDate,
    uint32 _endDate,
    uint32 _maxCurveAPR,
    uint32 _minCurveAPR,
    uint32 _finalLinearAPR
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

  function calculateReward(
    uint32 _start,
    uint32 _end
  ) public view returns (uint256) {
    require(_start >= startDate);
    require(_end > _start);
    require(_end <= endDate);

    (uint32 curveStart, uint32 curveEnd) = truncateToPeriod(_start, _end, startDate, linearStartDate);
    (uint32 linearStart, uint32 linearEnd) = truncateToPeriod(_start, _end, linearStartDate, endDate);

    (uint32 curveStartPercent, uint32 curveEndPercent) = toPeriodPercents(curveStart, curveEnd, startDate, linearStartDate);
    (uint32 linearStartPercent, uint32 linearEndPercent) = toPeriodPercents(linearStart, linearEnd, linearStartDate, endDate);

    uint256 curveAPR = curvePeriodAPR(curveStartPercent, curveEndPercent);
    uint256 linearAPR = curvePeriodAPR(curveStartPercent, curveEndPercent);

    return 0;
    // return calculateFromAverageAPR()

    // return curvePeriodReward(curveStart, curveEnd) + linearPeriodReward(linearStart, linearEnd);
  }

  function toPeriodPercents(
    uint32 _start,
    uint32 _end,
    uint32 _periodStart,
    uint32 _periodEnd
  ) internal view returns (uint32, uint32) {
    uint32 totalDuration = _periodEnd - _periodStart;

    uint32 startPercent = (_start - _periodStart) * 100 / totalDuration;
    uint32 endPercent = (_end - _periodStart) * 100 / totalDuration;

    return (startPercent, endPercent);
  }

  function truncateToPeriod(
    uint32 _start,
    uint32 _end,
    uint32 _periodStart,
    uint32 _periodEnd
  ) internal view returns (uint32, uint32) {
    uint32 start = _start < _periodStart ? _periodStart : _start;
    uint32 end = _end > _periodEnd ? _periodEnd : _end;

    return (start, end);
  }

  function curvePeriodAPR(uint32 _start, uint32 _end) internal view returns (uint256) {
    int256 maxArea = integralAtPoint(100) - integralAtPoint(0);
    int256 actualArea = integralAtPoint(_end) - integralAtPoint(_start);

    uint256 ratio = uint256(actualArea * 100 / maxArea);

    return minCurveAPR + (maxCurveAPR - minCurveAPR) * ratio;
  }

  function linearPeriodAPR(uint32 _start, uint32 _end) internal view returns (uint256) {
    uint32 maxDuration = endDate - linearStartDate;
    uint32 actualDuration = _end - _start;

    return 0;
  }

  function integralAtPoint(uint32 _x) internal view returns (int256) {
    int32 x = int32(_x);
    int256 p1 = (x ** 3) * mul / 300;
    int256 p2 = (x ** 2) * mul;
    int256 p3 = (x ** 1) * 100 * mul;

    return (p1 - p2 + p3) / mul;
  }

  function calculateFromAverageAPR(
    uint32 _duration,
    uint256 _amount,
    uint256 _averageAPR
  ) public view returns(uint256) {
    return (_duration * _averageAPR * _amount) / (year * 100);
  }
}
