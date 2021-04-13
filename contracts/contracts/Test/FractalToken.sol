// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FractalToken is ERC20 {
  constructor(address targetOwner) ERC20("Fractal Protocol Token", "FCL") {
    _mint(targetOwner, 465000000000000000000000000);
  }
}
