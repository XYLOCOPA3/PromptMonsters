// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";

/// @title IBossBattle
/// @dev This is an interface of BossBattle.
interface IBossBattle {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct bossBattleData {
    string name;
    string[4] skills;
    uint32 atk;
    uint32 def;
    uint32 inte; // INT
    uint32 mgr;
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
  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------
}
