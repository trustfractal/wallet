// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StakingInfra.sol";

contract Staking is StakingInfra {
  ERC20 public erc20;
  uint256 public totalMaxAmount;
  uint256 public individualMinimumAmount;
  uint256 public APR;
  uint256 public lockedTokens = 0;

  constructor(address _tokenAddress,
              uint256 _totalMaxAmount,
              uint256 _individualMinimumAmount,
              uint256 _APR
             ) {
    require(_totalMaxAmount > 0, "Staking: invalid max amount");
    require(_individualMinimumAmount> 0, "Staking: invalid individual min amount");
    require(_APR > 0, "Staking: invalid APR");
    require(_totalMaxAmount > _individualMinimumAmount, "Staking: max amount needs to be greater than individual minimum");

    erc20 = ERC20(_tokenAddress);
    require(_totalMaxAmount <= erc20.totalSupply(), "Staking: max amount is greater than total available supply");

    totalMaxAmount = _totalMaxAmount;
    individualMinimumAmount = _individualMinimumAmount;
    APR = _APR;
  }

  function getAPRAmount() public view returns (uint256) {
    // TODO
    return 0;
  }

  function stake(uint256 _amount) external whenNotPaused {
    // TODO
  }

  function withdraw(uint256 _amount) external whenNotPaused {
    // TODO
  }

  function getStake(address _subscriber) external view returns (bool) {
    // TODO
    return true;
  }
}
