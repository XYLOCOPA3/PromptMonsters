// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MCHCoin is ERC20 {
  constructor() ERC20("MCH Coin", "MCHC") {
    _mint(msg.sender, 1_000_000_000e18);
  }

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
