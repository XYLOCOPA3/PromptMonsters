// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IBossMonster
/// @dev This is an interface of BossMonster.
interface IBossMonster {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct MonsterAdjForBossMonster {
    uint256 fieldAdj;
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
    address indexed oldValue,
    address indexed newValue
  );

  event SetMonsterAdjsForBossMonster(
    address indexed publisher,
    address indexed resurrectionPrompt,
    uint256 fieldAdj,
    uint256 specialBuff
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

  /// @dev Get monster adjs for this boss monster
  /// @param resurrectionPrompt resurrection prompt
  /// @return Adjs
  function getMonsterAdjsForBossMonster(
    address resurrectionPrompt
  ) external view returns (MonsterAdjForBossMonster memory);
}
