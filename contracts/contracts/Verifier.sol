// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Verifier {
  function verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address) {
    return ecrecover(hash, v, r, s);
  }

  function verifyWithPrefix(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns (address) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));

    return verify(prefixedHash, v, r, s);
  }
}
