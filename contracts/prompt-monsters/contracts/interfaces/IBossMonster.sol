// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IPromptMonstersExtension} from "../prompt-monsters-extension/IPromptMonstersExtension.sol";

/// @title IBossMonster
/// @dev This is an interface of BossMonster.
interface IBossMonster {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct MonsterAdj {
    uint32 fieldAdj;
    uint32 weaknessFeatureAdj;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetPromptMonsters(
    address indexed publisher,
    address indexed oldValue,
    address indexed newValue
  );

  event SetBoss(
    address indexed publisher,
    IPromptMonsters.Monster oldValue,
    IPromptMonsters.Monster newValue
  );

  event SetSkillTypes(
    address indexed publisher,
    uint32[] oldValue,
    uint32[] newValue
  );

  event SetMonsterAdjs(
    address indexed publisher,
    address[] indexed resurrectionPrompts,
    MonsterAdj[] oldValue,
    MonsterAdj[] newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _promptMonsters
  /// @return returnState _promptMonsters
  function getPromptMonsters()
    external
    view
    returns (IPromptMonsters returnState);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonsters(address promptMonstersAddress) external;

  /// @dev Set bossStatus
  /// @param _bossStatus boss status
  function setBossStatus(IPromptMonsters.Monster memory _bossStatus) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get monster adjs
  /// @param resurrectionPrompts resurrection prompts
  /// @return monsterAdjs monster adjs
  function getMonsterAdjs(
    address[] memory resurrectionPrompts
  ) external view returns (MonsterAdj[] memory monsterAdjs);

  // /// @dev Get boss extension
  // /// @return bossExtension boss extension
  // function getBossExtension()
  //   external
  //   view
  //   returns (BossExtension memory bossExtension);

  /// @dev Set monster adjs for this boss monster
  /// @param resurrectionPrompts resurrection prompt
  /// @param monsterAdjs monster adjs
  function setMonsterAdjs(
    address[] memory resurrectionPrompts,
    MonsterAdj[] memory monsterAdjs
  ) external;
}
