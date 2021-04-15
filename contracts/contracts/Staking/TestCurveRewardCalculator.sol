// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// curve definition:
// https://www.desmos.com/calculator/8xyyuznuz3
//
// integral:
// https://www.wolframalpha.com/input/?i=integrate%5B-1%2B1.01*10%5E%282-0.02*x%29%2C+x%5D

import "hardhat/console.sol";
import "./CurveRewardCalculator.sol";

contract TestCurveRewardCalculator is CurveRewardCalculator {
  constructor(
    uint _startDate,
    uint _linearStartDate,
    uint _endDate,
    uint _maxCurveAPR,
    uint _minCurveAPR,
    uint _finalLinearAPR
  ) CurveRewardCalculator(_startDate, _linearStartDate, _endDate, _maxCurveAPR, _minCurveAPR, _finalLinearAPR) { }

  function testToCurvePercents(uint _start, uint _end) public view returns (uint, uint) {
    return toPeriodPercents(_start, _end, curve.start, curve.end);
  }

  function testToLinearPercents(uint _start, uint _end) public view returns (uint, uint) {
    return toPeriodPercents(_start, _end, linear.start, linear.end);
  }

  function testTruncateToCurvePeriod(uint _start, uint _end) public view returns (uint, uint) {
    return truncateToPeriod(_start, _end, curve.start, curve.end);
  }

  function testTruncateToLinearPeriod(uint _start, uint _end) public view returns (uint, uint) {
    return truncateToPeriod(_start, _end, linear.start, linear.end);
  }

  function testCurvePeriodAPR(uint _start, uint _end) public view returns (uint) {
    return curvePeriodAPR(_start, _end);
  }
}
