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
    address indexed oldState,
    address indexed newState
  );

  event SetPromptMonstersAddress(
    address indexed publisher,
    address indexed oldState,
    address indexed newState
  );

  event SetBossBattleEventActivated(
    address indexed publisher,
    bool indexed oldState,
    bool indexed newState
  );

  event SetBatchIsMonsterInBossBattle(
    address indexed publisher,
    bool[] indexed oldState,
    bool[] indexed newState
  );

  event SetInitialIBBState(
    address indexed publisher,
    BBState indexed oldState,
    BBState indexed newState
  );

  event SetBatchHighScores(
    address indexed publisher,
    uint256[] indexed oldState,
    uint256[] indexed newState
  );

  event SetBatchBbStates(
    address indexed publisher,
    BBState[] indexed oldState,
    BBState[] indexed newState
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

  /// @dev Set bossMonsterAddress
  /// @param bossMonsterAddress address of bossMonster
  function setBossMonsterAddress(address bossMonsterAddress) external;

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  /// @dev Set isBossBattleEventActive
  /// @param _isBossBattleEventActive isBossBattleEventActive
  function setBossBattleEventActivated(bool _isBossBattleEventActive) external;

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
