// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Staking is Ownable, Pausable {
  function pause() public onlyOwner whenNotPaused {
    _pause();
  }

  function unpause() public onlyOwner whenPaused {
    _unpause();
  }
}
