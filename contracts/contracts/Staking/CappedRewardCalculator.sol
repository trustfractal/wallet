// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";

/// @title Calculates rewards based on an initial downward curve period, and a second constant period
/// @author Miguel Palhas <miguel@subvisual.co>
contract CappedRewardCalculator {
  struct Period {
    uint start;
    uint end;
  }

  Period public curve;
  Period public const;
  uint public curveCap;
  uint public constantAPR;

  uint constant private year = 365 days;
  int private constant mul = 100000000;

  constructor(
    uint _startDate,
    uint _constantStartDate,
    uint _endDate,
    uint _curveCap,
    uint _constantAPR
  ) {
    require(block.timestamp <= _startDate, "CappedRewardCalculator: start date must be in the future");
    require( _startDate < _constantStartDate, "CappedRewardCalculator: constant start date must be after curve start date");
    require( _constantStartDate <= _endDate, "CappedRewardCalculator: end date must be after or at constant start date");

    require(_curveCap > 0, "CappedRewardCalculator: curve cap cannot be 0");
    require(_constantAPR > 0, "CappedRewardCalculator: constant APR cannot be 0");

    curveCap = _curveCap;
    constantAPR = _constantAPR;
    curve = Period(_startDate, _constantStartDate);
    const = Period(_constantStartDate, _endDate);
  }

  function startDate() public view returns (uint) {
    return curve.start;
  }

  function endDate() public view returns (uint) {
    return const.end;
  }

  function calculateReward(
    uint _start,
    uint _end,
    uint _amount
  ) public view returns (uint) {
    uint curveReward = calculateCurveReward(
      _start,
      _end,
      _amount
    );

    uint constantReward = calculateConstantReward(
      _start,
      _end,
      _amount
    );

    return curveReward + constantReward;
  }

  function calculateCurveReward(
    uint _start,
    uint _end,
    uint _amount
  ) internal view returns (uint) {
    (uint start, uint end) = truncateToPeriod(_start, _end, curve.start, curve.end);
    (uint startPercent, uint endPercent) = toPeriodPercents(start, end, curve.start, curve.end);

    uint percentage = curvePeriodPercentage(startPercent, endPercent);

    uint reward = _amount * curveCap * percentage / (100 * 100);

    return reward;
  }

  function calculateConstantReward(
    uint _start,
    uint _end,
    uint _amount
  ) internal view returns (uint) {
    (uint start, uint end) = truncateToPeriod(_start, _end, const.start, const.end);

    uint duration = end - start;

    return (duration * constantAPR * _amount) / (year * 100);
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

  function curvePeriodPercentage(uint _start, uint _end) internal pure returns (uint) {
    int maxArea = integralAtPoint(100) - integralAtPoint(0);
    int actualArea = integralAtPoint(_end) - integralAtPoint(_start);

    uint ratio = uint(actualArea * 100 / maxArea);

    return ratio;
  }

  function integralAtPoint(uint _x) internal pure returns (int) {
    int x = int(_x);
    int p1 = ((x - 100) ** 3) * 100 * mul / 30000;

    return p1 / mul;
  }
}
