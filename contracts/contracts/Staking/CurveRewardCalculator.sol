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
    uint32 start;
    uint32 end;
    uint32 initialAPR;
    uint32 finalAPR;
  }

  Period public curve;
  Period public linear;

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

  function startDate() public view returns (uint32) {
    return curve.start;
  }

  function endDate() public view returns (uint32) {
    return linear.end;
  }

  function calculateReward(
    uint32 _start,
    uint32 _end,
    uint256 _amount
  ) public view returns (uint256) {
    uint256 curveReward = calculatePeriodReward(
      _start,
      _end,
      _amount,
      curve,
      curvePeriodAPR
    );

    uint256 linearReward = calculatePeriodReward(
      _start,
      _end,
      _amount,
      linear,
      linearPeriodAPR
    );

    return curveReward + linearReward;
  }

  function calculatePeriodReward(
    uint32 _start,
    uint32 _end,
    uint256 _amount,
    Period memory period,
    function(uint32,uint32) view returns(uint256) calculateAPR
  ) internal view returns (uint256) {
    (uint32 start, uint32 end) = truncateToPeriod(_start, _end, period.start, period.end);
    (uint32 startPercent, uint32 endPercent) = toPeriodPercents(start, end, period.start, period.end);

    uint256 APR = calculateAPR(startPercent, endPercent);

    return calculateFromAPR(start, end, _amount, APR);
  }

  function toPeriodPercents(
    uint32 _start,
    uint32 _end,
    uint32 _periodStart,
    uint32 _periodEnd
  ) internal pure returns (uint32, uint32) {
    uint32 totalDuration = _periodEnd - _periodStart;

    if (totalDuration == 0) {
      return (0, 100);
    }

    uint32 startPercent = (_start - _periodStart) * 100 / totalDuration;
    uint32 endPercent = (_end - _periodStart) * 100 / totalDuration;

    return (startPercent, endPercent);
  }

  function truncateToPeriod(
    uint32 _start,
    uint32 _end,
    uint32 _periodStart,
    uint32 _periodEnd
  ) internal pure returns (uint32, uint32) {
    if (_end <= _periodStart || _start >= _periodEnd) {
      return (_periodStart, _periodStart);
    }

    uint32 start = _start < _periodStart ? _periodStart : _start;
    uint32 end = _end > _periodEnd ? _periodEnd : _end;

    return (start, end);
  }

  function curvePeriodAPR(uint32 _start, uint32 _end) internal view returns (uint256) {
    int256 maxArea = integralAtPoint(100) - integralAtPoint(0);
    int256 actualArea = integralAtPoint(_end) - integralAtPoint(_start);

    uint256 ratio = uint256(actualArea * 100 / maxArea);

    return curve.finalAPR * 100 + (curve.initialAPR- curve.finalAPR) * ratio;
  }

  function linearPeriodAPR(uint32 _startPercent, uint32 _endPercent) internal view returns (uint256) {
    uint32 mid = 100 - (_startPercent + _endPercent) / 2;

    return linear.finalAPR * 100 + (linear.initialAPR - linear.finalAPR) * mid;
  }

  function integralAtPoint(uint32 _x) internal pure returns (int256) {
    int32 x = int32(_x);
    int256 p1 = (x ** 3) * mul / 300;
    int256 p2 = (x ** 2) * mul;
    int256 p3 = (x ** 1) * 100 * mul;

    return (p1 - p2 + p3) / mul;
  }

  function calculateFromAPR(
    uint32 _start,
    uint32 _end,
    uint256 _amount,
    uint256 _averageAPR
  ) public pure returns(uint256) {
    uint32 duration = _end - _start;

    return (duration * _averageAPR * _amount) / (year * 100 * 100);
  }
}
