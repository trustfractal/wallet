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
    uint32 _startDate,
    uint32 _linearStartDate,
    uint32 _endDate,
    uint32 _maxCurveAPR,
    uint32 _minCurveAPR,
    uint32 _finalLinearAPR
  ) CurveRewardCalculator(_startDate, _linearStartDate, _endDate, _maxCurveAPR, _minCurveAPR, _finalLinearAPR) { }

  function testToCurvePercents(uint32 _start, uint32 _end) public view returns (uint32, uint32) {
    return toPeriodPercents(_start, _end, curve.start, curve.end);
  }

  function testToLinearPercents(uint32 _start, uint32 _end) public view returns (uint32, uint32) {
    return toPeriodPercents(_start, _end, linear.start, linear.end);
  }

  function testTruncateToCurvePeriod(uint32 _start, uint32 _end) public view returns (uint32, uint32) {
    return truncateToPeriod(_start, _end, curve.start, curve.end);
  }

  function testTruncateToLinearPeriod(uint32 _start, uint32 _end) public view returns (uint32, uint32) {
    return truncateToPeriod(_start, _end, linear.start, linear.end);
  }

  function testCurvePeriodAPR(uint32 _start, uint32 _end) public view returns (uint256) {
    return curvePeriodAPR(_start, _end);
  }
}
