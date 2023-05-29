// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";

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

  event SetIsBossBattleActive(
    address indexed publisher,
    bool indexed oldValue,
    bool indexed newValue
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

  /// @dev Get isBossBattleActive
  /// @return _isBossBattleActive isBossBattleActive
  function getIsBossBattleActive()
    external
    view
    returns (bool _isBossBattleActive);

  /// @dev Get monster adjs for the boss battle
  /// @param bossBattleEventAddress address of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @return monsterAdjs monster adjs for the boss battle
  function getMonsterAdjsForBossBattle(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external view returns (IBossMonster.MonsterAdjForBossMonster memory);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add bossBattleEventAddress
  /// @param bossBattleEventAddress address of bossBattleEvent
  function addBossBattleEventAddress(address bossBattleEventAddress) external;

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  /// @dev Set isBossBattleActive
  /// @param _isBossBattleActive isBossBattleActive
  function setIsBossBattleActive(bool _isBossBattleActive) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev get boss battle data to calculate battle result
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  /// @return bossBattleData
  function getBossBattleData(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external view returns (BossBattleData memory);

  /// @dev Start boss battle of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  function startBossBattle(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external;

  /// @dev Record battle result with boss of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function recordBossBattle(
    address bossBattleEventAddress,
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  ) external;

  /// @dev End boss battle of the event with win
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattleWithWin(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external;

  /// @dev End boss battle of the event with lose
  /// @param bossBattleEventAddress BossBattleEvent contract address
  function endBossBattleWithLose(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external;
}
