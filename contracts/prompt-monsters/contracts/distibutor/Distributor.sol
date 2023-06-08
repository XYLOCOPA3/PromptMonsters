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

  address private ERC20_ADDRESS;

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
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get ERC20 address
  /// @return erc20Address ERC20 token address
  function getERC20Address() external view returns (address erc20Address) {
    erc20Address = ERC20_ADDRESS;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set ERC20 address
  /// @param erc20Address ERC20 token address
  function setERC20Address(
    address erc20Address
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = ERC20_ADDRESS;
    ERC20_ADDRESS = erc20Address;
    emit SetERC20TokenAddress(msg.sender, oldValue, erc20Address);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev distribute native token for presents and rewards by DISTRIBUTOR_ROLE
  /// @param to wallet address to be distributed
  function distributeNativeToken(
    address to
  ) external payable onlyRole(DISTRIBUTOR_ROLE) {
    require(0 < msg.value, "Distributor: msg.value is zero");
    (bool success, ) = payable(to).call{value: msg.value}("");
    require(success, "Distributor: Failed to send native token");

    emit DistributedNativeToken(msg.sender, to, msg.value);
  }

  /// @dev distribute ERC20 for presents and rewards by DISTRIBUTOR_ROLE
  /// @param to wallet address to be distributed
  /// @param amount distributed ERC20 amount
  function distributeERC20(
    address to,
    uint256 amount
  ) external payable onlyRole(DISTRIBUTOR_ROLE) {
    require(msg.value == 0, "Distributor: msg.value has to be 0");

    uint beforeBalance = IERC20(ERC20_ADDRESS).balanceOf(to);
    IERC20(ERC20_ADDRESS).safeTransfer(to, amount);
    uint afterBalance = IERC20(ERC20_ADDRESS).balanceOf(to);

    uint acutualAmount = afterBalance - beforeBalance;
    require(acutualAmount != 0, "Distributor: Failed to send ERC20 token");

    emit DistributedERC20(msg.sender, to, amount);
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
