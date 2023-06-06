// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IDistributor
/// @dev This is an interface of Distributor.
interface IDistributor {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event setERC20Address(address indexed erc20Address);

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
  /// @return erc20Address ERC20 token address
  function getERC20Address() external view returns (address erc20Address) {}

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set ERC20 address by DISTRIBUTOR_ROLE
  /// @param erc20Address ERC20 token address
  function setERC20Address(address erc20Address) external returns () {}

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
