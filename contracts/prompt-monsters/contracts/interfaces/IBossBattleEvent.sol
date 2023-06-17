// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IBossMonster} from "../interfaces/IBossMonster.sol";

/// @title IBossBattleEvent
/// @dev This is an interface of BossBattleEvent.
interface IBossBattleEvent {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  struct BBState {
    bool bossBattleStarted;
    bool bossBattleContinued;
    uint32 lp;
    uint32 turn;
    uint32 score;
    uint32 monsterAdj;
    uint32 bossAdj;
    uint32 bossSign;
    bool hasHealItem;
    bool hasBuffItem;
    bool hasDebuffItem;
    bool hasEscapeItem;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetBossMonster(
    address indexed publisher,
    IBossMonster oldValue,
    IBossMonster newValue
  );

  event StartedBossBattle(
    address indexed publisher,
    address indexed resurrectionPrompt,
    BBState bbState
  );

  event UpdatedBossBattleResult(
    address indexed publisher,
    address indexed resurrectionPrompt,
    BBState oldValue,
    BBState newValue
  );

  event ContinuedBossBattle(
    address indexed publisher,
    address indexed resurrectionPrompt,
    BBState oldValue,
    BBState newValue
  );

  event EndedBossBattle(
    address indexed publisher,
    address indexed resurrectionPrompt,
    BBState oldValue,
    BBState newValue
  );

  event UpdatedHighScore(
    address indexed publisher,
    address indexed resurrectionPrompt,
    uint32 oldValue,
    uint32 newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _bossMonster
  /// @return returnState _bossMonster
  function getBossMonster() external view returns (IBossMonster returnState);

  /// @dev Get _highScores
  /// @param rps_ resurrection prompts
  /// @return highScores high scores
  function getHighScores(
    address[] memory rps_
  ) external view returns (uint32[] memory highScores);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set _bossMonster
  /// @param bossMonsterAddress bossMonster address
  function setBossMonster(address bossMonsterAddress) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get BBState
  /// @param resurrectionPrompt resurrection prompt
  /// @return bbState BBState
  function getBBState(
    address resurrectionPrompt
  ) external view returns (BBState memory bbState);

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  /// @param bossSign boss sign
  function startBossBattle(
    address resurrectionPrompt,
    uint32 monsterAdj,
    uint32 bossSign
  ) external;

  /// @dev updateBossBattleResult
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function updateBossBattleResult(
    address resurrectionPrompt,
    BBState memory bbState
  ) external;

  /// @dev Continue boss battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bossSign boss sign
  function continueBossBattle(
    address resurrectionPrompt,
    uint32 bossSign
  ) external;

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(address resurrectionPrompt) external;

  // TODO: 後で消す(開発用) ------------
  /// @dev Delete BBState
  /// @param resurrectionPrompt resurrection prompt
  function deleteBBState(address resurrectionPrompt) external;
}
