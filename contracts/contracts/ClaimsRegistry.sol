// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "hardhat/console.sol";

import "./ClaimsRegistry/Verifier.sol";

contract ClaimsRegistry is Verifier {
  mapping(bytes32 => ClaimSignature) public registry;

  struct ClaimSignature {
    uint8 v;
    bytes32 r;
    bytes32 s;
    // TODO do we want validFrom/validTo?
  }

  // TODO events

  function setClaimWithSignature(
    address issuer,
    address subject,
    bytes32 key,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    // TODO do we need this?
    require(msg.sender == issuer || msg.sender == subject);

    bytes32 encryptedBytes = keccak256(abi.encodePacked(issuer, subject, key));

    require(verifyWithPrefix(hash, v, r, s) == issuer, "ClaimsRegistry: Claim signature does not match issuer");

    ClaimSignature memory claim = ClaimSignature(v, r, s);

    registry[encryptedBytes] = claim;
  }

  function setSelfClaimWithSignature(
    bytes32 key,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public {
    setClaimWithSignature(msg.sender, msg.sender, key, hash, v, r, s);
  }

  function getClaim(
    address issuer,
    address subject,
    bytes32 key
  ) public view returns (uint8, bytes32, bytes32) {
    bytes32 encryptedBytes = keccak256(abi.encodePacked(issuer, subject, key));

    ClaimSignature memory r = registry[encryptedBytes];

    return (r.v, r.r, r.s);
  }

  // TODO who can revoke claims and when?
  function removeClaim(
    address issuer,
    address subject,
    bytes32 key
  ) public {
    require(msg.sender == subject || msg.sender == issuer);

    bytes32 encryptedBytes = keccak256(abi.encodePacked(issuer, msg.sender, key));
    delete registry[encryptedBytes];
  }
}
