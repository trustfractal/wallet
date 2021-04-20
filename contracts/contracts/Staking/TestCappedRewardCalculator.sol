// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";
import "./CappedRewardCalculator.sol";

contract TestCappedRewardCalculator is CappedRewardCalculator {
  constructor(
    uint _startDate,
    uint _linearStartDate,
    uint _endDate,
    uint _cap,
    uint _constantAPR
  ) CappedRewardCalculator(_startDate, _linearStartDate, _endDate, _cap, _constantAPR) { }

  function testToCurvePercents(uint _start, uint _end) public view returns (uint, uint) {
    return toPeriodPercents(_start, _end, curve.start, curve.end);
  }

  function testTruncateToCurvePeriod(uint _start, uint _end) public view returns (uint, uint) {
    return truncateToPeriod(_start, _end, curve.start, curve.end);
  }

  function testTruncateToConstantPeriod(uint _start, uint _end) public view returns (uint, uint) {
    return truncateToPeriod(_start, _end, const.start, const.end);
  }

  function testCurvePeriodPercentage(uint _start, uint _end) public view returns (uint) {
    return curvePeriodPercentage(_start, _end);
  }

  function testIntegralAtPoint(uint x) public pure returns (int) {
    return integralAtPoint(x);
  }
}
