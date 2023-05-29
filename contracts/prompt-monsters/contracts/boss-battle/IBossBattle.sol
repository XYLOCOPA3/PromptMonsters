// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";

/// @title IBossBattle
/// @dev This is an interface of BossBattle.
interface IBossBattle {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct BossBattleData {
    string name;
    string[] skills;
    uint32[] skillsTypes;
    uint32 atk;
    uint32 def;
    uint32 inte; // INT
    uint32 mgr;
    uint256 fieldAdj;
    uint256 specialBuff;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event AddBossBattleEventAddress(
    address indexed publisher,
    address indexed bossBattleEventAddress
  );

  event SetPromptMonstersAddress(
    address indexed publisher,
    address indexed oldValue,
    address indexed newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get bossBattleEventAddress
  /// @return bossBattleEventAddress address of bossBattleEvent
  function getBossBattleEventAddress(
    uint256 index
  ) external view returns (address bossBattleEventAddress);

  /// @dev Get promptMonstersAddress
  /// @return promptMonstersAddress address of promptMonsters
  function getPromptMonstersAddress()
    external
    view
    returns (address promptMonstersAddress);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add bossBattleEventAddress
  /// @param bossBattleEventAddress address of bossBattleEvent
  function addBossBattleEventAddress(address bossBattleEventAddress) external;

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------
}
