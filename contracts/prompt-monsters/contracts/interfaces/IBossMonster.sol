// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IPromptMonstersExtension} from "../prompt-monsters-extension/IPromptMonstersExtension.sol";

/// @title IBossMonster
/// @dev This is an interface of BossMonster.
interface IBossMonster {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  struct MonsterAdj {
    uint32 weaknessFeatureAdj;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event AddedLanguage(
    address indexed publisher,
    uint256 index,
    string language
  );

  event SetLanguage(
    address indexed publisher,
    uint256 indexed index,
    string oldValue,
    string newValue
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

  event SetMonsterAdj(
    address indexed publisher,
    address indexed resurrectionPrompts,
    MonsterAdj oldValue,
    MonsterAdj newValue
  );

  event AddedSkills(
    address indexed publisher,
    string indexed language,
    string[] skills
  );

  event ChangedMintable(
    address indexed publisher,
    address indexed to,
    bool mintable
  );

  event MintedBoss(
    address indexed publisher,
    address indexed to,
    IPromptMonstersExtension.MonsterExtension monsterExtension,
    string imageURL
  );

  event SetPromptMonsters(
    address indexed publisher,
    IPromptMonsters oldValue,
    IPromptMonsters newValue
  );

  event SetFeature(
    address indexed publisher,
    string language,
    string oldValue,
    string newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _languages
  /// @return returnValue _languages
  function getLanguages() external view returns (string[] memory returnValue);

  /// @dev Get monster adj
  /// @param resurrectionPrompt resurrection prompt
  /// @return monsterAdj monster adj
  function getMonsterAdj(
    address resurrectionPrompt
  ) external view returns (MonsterAdj memory monsterAdj);

  /// @dev Get boss extension
  /// @param language language
  /// @return bossExtension boss extension
  function getBossExtension(
    string memory language
  )
    external
    view
    returns (IPromptMonstersExtension.MonsterExtension memory bossExtension);

  /// @dev Get _mintable
  /// @param user user
  /// @return returnValue _mintable
  function getMintable(address user) external view returns (bool returnValue);

  /// @dev Get _promptMonsters
  /// @return returnValue _promptMonsters
  function getPromptMonsters()
    external
    view
    returns (IPromptMonsters returnValue);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add language
  /// @param language language
  function addLanguage(string memory language) external;

  /// @dev Set _languages
  /// @param index index
  /// @param language language
  function setLanguage(uint256 index, string memory language) external;

  /// @dev Set boss
  /// @param language language
  /// @param boss boss
  function setBoss(
    string memory language,
    IPromptMonsters.Monster memory boss
  ) external;

  /// @dev Set _skillTypes
  /// @param skills skills
  /// @param skillTypes skillTypes
  function setSkillTypes(
    string[] memory skills,
    uint32[] memory skillTypes
  ) external;

  /// @dev Set monster adj for this boss monster
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  function setMonsterAdj(
    address resurrectionPrompt,
    MonsterAdj memory monsterAdj
  ) external;

  /// @dev Set skills
  /// @param skills skills
  function addSkills(string memory language, string[] memory skills) external;

  /// @dev Set _promptMonsters
  /// @param newValue _promptMonsters
  function setPromptMonsters(address newValue) external;

  /// @dev Set boss feature
  /// @param language language
  /// @param newValue new feature
  function setFeature(string memory language, string memory newValue) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev changeMintable
  /// @param user user
  function changeMintable(address user) external;

  /// @dev mintBoss
  /// @param to to
  /// @param monsterExtension monsterExtension
  /// @param imageURL imageURL
  function mintBoss(
    address to,
    IPromptMonstersExtension.MonsterExtension memory monsterExtension,
    string memory imageURL
  ) external;
}
