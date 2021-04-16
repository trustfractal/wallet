// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";

contract CurveRewardCalculator {
  struct Period {
    uint start;
    uint end;
    uint initialAPR;
    uint finalAPR;
  }

  Period public curve;
  Period public linear;

  uint constant private year = 365 days;
  int private constant mul = 100000000;

  constructor(
    uint _startDate,
    uint _linearStartDate,
    uint _endDate,
    uint _maxCurveAPR,
    uint _minCurveAPR,
    uint _finalLinearAPR
  ) {
    require(block.timestamp <= _startDate, "CurveRewardCalculator: start date must be in the future");
    require( _startDate < _linearStartDate, "CurveRewardCalculator: linear start date must be after curve start date");
    require( _linearStartDate <= _endDate, "CurveRewardCalculator: end date must be after or at linear start date");
    require( _maxCurveAPR > _minCurveAPR, "CurveRewardCalculator: maxCurveAPR needs to be greater than minCurveAPR");
    require(
      _minCurveAPR > _finalLinearAPR,
      "CurveRewardCalculator: minCurveAPR needs to be greater than finalLinearAPR"
    );

    curve = Period(_startDate, _linearStartDate, _maxCurveAPR, _minCurveAPR);
    linear = Period(_linearStartDate, _endDate, _minCurveAPR, _finalLinearAPR);
  }

  function startDate() public view returns (uint) {
    return curve.start;
  }

  function endDate() public view returns (uint) {
    return linear.end;
  }

  function calculateReward(
    uint _start,
    uint _end,
    uint _amount
  ) public view returns (uint) {
    uint curveReward = calculatePeriodReward(
      _start,
      _end,
      _amount,
      curve,
      curvePeriodAPR
    );

    uint linearReward = calculatePeriodReward(
      _start,
      _end,
      _amount,
      linear,
      linearPeriodAPR
    );

    return curveReward + linearReward;
  }

  function calculatePeriodReward(
    uint _start,
    uint _end,
    uint _amount,
    Period memory period,
    function(uint,uint) view returns(uint) calculateAPR
  ) internal view returns (uint) {
    (uint start, uint end) = truncateToPeriod(_start, _end, period.start, period.end);
    (uint startPercent, uint endPercent) = toPeriodPercents(start, end, period.start, period.end);

    uint APR = calculateAPR(startPercent, endPercent);

    return calculateFromAPR(start, end, _amount, APR);
  }

  function toPeriodPercents(
    uint _start,
    uint _end,
    uint _periodStart,
    uint _periodEnd
  ) internal pure returns (uint, uint) {
    uint totalDuration = _periodEnd - _periodStart;

    if (totalDuration == 0) {
      return (0, 100);
    }

    uint startPercent = (_start - _periodStart) * 100 / totalDuration;
    uint endPercent = (_end - _periodStart) * 100 / totalDuration;

    return (startPercent, endPercent);
  }

  function truncateToPeriod(
    uint _start,
    uint _end,
    uint _periodStart,
    uint _periodEnd
  ) internal pure returns (uint, uint) {
    if (_end <= _periodStart || _start >= _periodEnd) {
      return (_periodStart, _periodStart);
    }

    uint start = _start < _periodStart ? _periodStart : _start;
    uint end = _end > _periodEnd ? _periodEnd : _end;

    return (start, end);
  }

  function curvePeriodAPR(uint _start, uint _end) internal view returns (uint) {
    int maxArea = integralAtPoint(100) - integralAtPoint(0);
    int actualArea = integralAtPoint(_end) - integralAtPoint(_start);

    uint ratio = uint(actualArea * 100 / maxArea);

    return curve.finalAPR * 100 + (curve.initialAPR- curve.finalAPR) * ratio;
  }

  function linearPeriodAPR(uint _startPercent, uint _endPercent) internal view returns (uint) {
    uint mid = 100 - (_startPercent + _endPercent) / 2;

    return linear.finalAPR + (linear.initialAPR - linear.finalAPR) * mid;
  }

  function integralAtPoint(uint _x) internal view returns (int) {
    int M = int(curve.initialAPR);
    int m = int(curve.finalAPR);

    int x = int(_x);
    int p1 = ((x - 100) ** 3) * (M - m) * mul / 30000;
    int p2 = m * x * mul;

    return (p1 + p2) / mul;
  }

  function calculateFromAPR(
    uint _start,
    uint _end,
    uint _amount,
    uint _averageAPR
  ) public pure returns(uint) {
    uint duration = _end - _start;

    return (duration * _averageAPR * _amount) / (year * 100 * 100);
  }
}
