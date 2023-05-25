// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IBossBattleEvent
/// @dev This is an interface of BossBattleEvent.
interface IBossBattleEvent {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct BBState {
    uint256 score;
    uint256 monsterHp;
    uint256 bossHp;
    uint256 monsterAdj;
    uint256 bossAdj;
  }

  struct MonsterStatusForBbEvent {
    uint256 terrainAdj;
    uint256 specialBuff;
  }

  struct BossStatus {
    string feature;
    string name;
    string flavor;
    string[] skills;
    uint32 lv;
    uint32 hp;
    uint32 atk;
    uint32 def;
    uint32 inte; // INT
    uint32 mgr;
    uint32 agl;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

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
