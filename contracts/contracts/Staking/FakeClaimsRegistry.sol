// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "hardhat/console.sol";

import "../ClaimsRegistry.sol";

contract FakeClaimsRegistry is IClaimsRegistryVerifier {
  bool result;

  constructor() {
    result = false;
  }

  function setResult(bool _r) public {
    result = _r;
  }

  function verifyClaim(address, address, bytes calldata) external override view returns (bool) {
    return result;
  }
}
