// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IBossBattleEvent
/// @dev This is an interface of BossBattleEvent.
interface IBossBattleEvent {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct BBState {
    uint32 hp;
    uint32 turn;
    uint32 score;
    uint32 monsterAdj;
    uint32 bossAdj;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetBossMonsterAddress(
    address indexed publisher,
    address indexed oldValue,
    address indexed newValue
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

  /// @dev Get bossMonsterAddress
  function getBossMonsterAddress() external view returns (address);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  function startBossBattle(address resurrectionPrompt) external;

  /// @dev recordBossBattle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function recordBossBattle(
    address resurrectionPrompt,
    BBState memory bbState
  ) external;

  /// @dev End boss battle with win
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattleWithWin(address resurrectionPrompt) external;

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(address resurrectionPrompt) external;
}
