// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title IDistributor
/// @dev This is an interface of Distributor.
interface IDistributor {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetERC20(
    address indexed publisher,
    IERC20 indexed oldValue,
    IERC20 indexed newValue
  );

  event SetDistributorWallet(
    address indexed publisher,
    address indexed oldValue,
    address indexed newValue
  );

  event DistributedNativeToken(
    address indexed from,
    address indexed to,
    uint256 indexed amount
  );

  event DistributedERC20(
    address indexed from,
    address indexed to,
    uint256 indexed amount
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get ERC20 address
  /// @return erc20 ERC20 token address
  function getERC20() external view returns (IERC20 erc20);

  /// @dev Get _distributorWallet
  /// @return distributorWallet ERC20 token address
  function getDistributorWallet()
    external
    view
    returns (address distributorWallet);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set ERC20 address by DISTRIBUTOR_ROLE
  /// @param erc20Address ERC20 token address
  function setERC20Address(address erc20Address) external;

  /// @dev Set _distributorWallet
  /// @param distributorWallet ERC20 token address
  function setDistributorWallet(address distributorWallet) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev distribute native token for presents and rewards by DISTRIBUTOR_ROLE
  /// @param to wallet address to be distributed
  function distributeNativeToken(address to) external payable;

  /// @dev distribute ERC20 for presents and rewards by DISTRIBUTOR_ROLE
  /// @param to wallet address to be distributed
  /// @param amount distributed ERC20 amount
  function distributeERC20(address to, uint256 amount) external payable;
}
