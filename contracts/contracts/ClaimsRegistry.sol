// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "hardhat/console.sol";

import "./ClaimsRegistry/Verifier.sol";

contract ClaimsRegistry is Verifier {
  mapping(bytes32 => Claim) public registry;

  struct Claim {
    address subject;
  }

  // TODO events

  function setClaimWithSignature(
    address issuer,
    address subject,
    bytes32 claimHash,
    bytes calldata sig
  ) public {
    bytes32 signable = computeSignableKey(subject, claimHash);

    require(verifyWithPrefix(signable, sig, issuer), "ClaimsRegistry: Claim signature does not match issuer");

    bytes32 key = keccak256(abi.encodePacked(issuer, sig));

    registry[key] = Claim(subject);
  }

  function setSelfClaimWithSignature(
    bytes32 claimHash,
    bytes calldata sig
  ) public {
    setClaimWithSignature(msg.sender, msg.sender, claimHash, sig);
  }

  function getClaim(
    address issuer,
    bytes calldata sig
  ) public view returns (address) {
    bytes32 key = keccak256(abi.encodePacked(issuer, sig));

    return registry[key].subject;
  }

  function verifyClaim(
    address subject,
    address issuer,
    bytes calldata sig
  ) public view returns (bool) {
    return getClaim(issuer, sig) == subject;
  }

  // TODO who can revoke claims and when?
  function removeClaim(
    address issuer,
    address subject,
    bytes calldata sig
  ) public {
    require(msg.sender == subject || msg.sender == issuer);

    bytes32 encryptedBytes = keccak256(abi.encodePacked(issuer, sig));
    delete registry[encryptedBytes];
  }

  function computeSignableKey(address subject, bytes32 hash) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(subject, hash));
  }
}
