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

  event Distributed(
    address indexed from,
    address indexed to,
    bool isOAS,
    uint256 indexed amount
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev distribute presents and rewards by admin
  /// @param to wallet address to be distributed
  /// @param isOAS If true, distribute OAS as native token. If false, distribute MCHC as ERC20
  /// @param amount distributed OAS amount
  function distribute(address to, bool isOAS, uint amount) external payable;
}
