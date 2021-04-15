// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract Verifier {
  function verifyWithPrefix(bytes32 hash, bytes calldata sig, address signer) public pure returns (bool) {
    return verify(addPrefix(hash), sig, signer);
  }

  function verify(bytes32 hash, bytes calldata sig, address signer) public pure returns (bool) {
    return recover(hash, sig) == signer;
  }

  function recoverWithPrefix(bytes32 hash, bytes calldata _sig) public pure returns (address) {
    return recover(addPrefix(hash), _sig);
  }

  function recover(bytes32 hash, bytes calldata _sig) public pure returns (address) {
    bytes memory sig = _sig;
    bytes32 r;
    bytes32 s;
    uint8 v;

    if (sig.length != 65) {
      return address(0);
    }

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := and(mload(add(sig, 65)), 255)
    }

    if (v < 27) {
      v += 27;
    }

    if (v != 27 && v != 28) {
      return address(0);
    }

    return ecrecover(hash, v, r, s);
  }

  function addPrefix(bytes32 hash) private pure returns (bytes32) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";

    return keccak256(abi.encodePacked(prefix, hash));
  }
}
