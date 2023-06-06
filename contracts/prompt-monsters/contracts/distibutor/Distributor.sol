// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IDistributor} from "./IDistributor.sol";

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Distributor
/// @dev This is a contract of Distributor.
contract Distributor is
  Initializable,
  IDistributor,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  using SafeERC20 for IERC20;
  bytes32 private DISTRIBUTOR_ROLE;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev Initialize
  function initialize() public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();
    DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(DISTRIBUTOR_ROLE, 0xb506264B57B1e8371f94f06292eD5b670d25eaB1);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev distribute presents and rewards by admin
  /// @param to wallet address to be distributed
  /// @param isOAS If true, distribute OAS as native token. If false, distribute MCHC as ERC20
  /// @param amount distributed OAS amount
  function distribute(
    address to,
    bool isOAS,
    uint256 amount
  ) external payable onlyRole(DISTRIBUTOR_ROLE) {
    if (isOAS) {
      require(
        msg.value == amount,
        "Distributor: amount and msg.value are not same value"
      );
      (bool success, ) = payable(to).call{value: msg.value}("");
      require(success, "Distributor: Failed to send native token");
    } else {
      require(msg.value == 0, "Distributor: msg.value has to be 0");
      address token = 0x5B1CC635E524cAbb63a581c050C895534755F297; //MCHC contract address
      uint beforeBalance = IERC20(token).balanceOf(to);
      IERC20(token).safeTransfer(to, amount);
      uint afterBalance = IERC20(token).balanceOf(to);

      uint acutualAmount = afterBalance - beforeBalance;
      require(acutualAmount != 0, "Distributor: Failed to send ERC20 token");
    }
    emit Distributed(msg.sender, to, isOAS, amount);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
