// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonstersExtension} from "../prompt-monsters-extension/IPromptMonstersExtension.sol";

/// @title IBossBattle
/// @dev This is an interface of BossBattle.
interface IBossBattle {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetEventKey(
    address indexed publisher,
    uint256 indexed index,
    string oldValue,
    string newValue
  );

  event SetBossBattleEvent(
    address indexed publisher,
    string indexed eventKey,
    uint256 indexed bbeId,
    address oldValue,
    address newValue
  );

  event AddedEventKey(
    address indexed publisher,
    uint256 indexed index,
    string eventKey
  );

  event AddedBossBattleEvent(
    address indexed publisher,
    string indexed eventKey,
    address bossBattleEvent
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _eventKeys
  /// @return returnValue _eventKeys
  function getEventKeys() external view returns (string[] memory returnValue);

  /// @dev Get _bossBattleEventMap
  /// @return returnValue _bossBattleEventMap
  function getBossBattleEvents()
    external
    view
    returns (address[][] memory returnValue);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set bossBattleEvent
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param bossBattleEvent address of bossBattleEvent
  function setBossBattleEvent(
    string memory eventKey,
    uint256 bbeId,
    address bossBattleEvent
  ) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Add event key
  /// @param eventKey event key
  function addEventKey(string memory eventKey) external;

  /// @dev Add bossBattleEvent
  /// @param eventKey ID of event
  /// @param bossBattleEvent address of bossBattleEvent
  function addBossBattleEvent(
    string memory eventKey,
    address bossBattleEvent
  ) external;

  /// @dev get boss battle data to calculate battle result
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @return monsterAdj monster adj
  function getMonsterAdj(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external view returns (IBossMonster.MonsterAdj memory monsterAdj);

  /// @dev Set monsterAdj
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  function setMonsterAdj(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    IBossMonster.MonsterAdj memory monsterAdj
  ) external;

  /// @dev get boss battle state
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @return bbState boss battle state
  function getBBState(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external view returns (IBossBattleEvent.BBState memory bbState);

  /// @dev get boss battle data to calculate battle result
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param language language
  /// @return monsterExtension monster extension
  function getBossExtension(
    string memory eventKey,
    uint256 bbeId,
    string memory language
  )
    external
    view
    returns (IPromptMonstersExtension.MonsterExtension memory monsterExtension);

  /// @dev Start boss battle of the event
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  /// @param bossSign boss sign
  function startBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    uint32 monsterAdj,
    uint32 bossSign
  ) external;

  /// @dev updateBossBattleResult
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function updateBossBattleResult(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  ) external;

  /// @dev Continue boss battle
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param bossSign boss sign
  function continueBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    uint32 bossSign
  ) external;

  /// @dev End boss battle
  /// @param eventKey ID of event
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external;
}
