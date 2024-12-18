// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IBossMonster, IPromptMonsters, IPromptMonstersExtension} from "../interfaces/IBossMonster.sol";

/// @title BossMonsterMchYoshka
/// @dev This is a contract of BossMonsterMchYoshka.
contract BossMonsterMchYoshka is
  Initializable,
  IBossMonster,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  /// @custom:oz-renamed-from GAME_ROLE
  bytes32 private GAME_ROLE;

  /// @custom:oz-renamed-from _languages
  string[] private _languages;

  // key -> language
  /// @custom:oz-renamed-from _bossMap
  mapping(string => IPromptMonsters.Monster) private _bossMap;

  // key -> skill
  /// @custom:oz-renamed-from _skillTypes
  mapping(string => uint32) private _skillTypes;

  // key -> resurrectionPrompt
  /// @custom:oz-renamed-from _weaknessFeatureAdjs
  mapping(address => uint32) private _weaknessFeatureAdjs;

  // key -> user
  /// @custom:oz-renamed-from _mintableMap
  mapping(address => bool) private _mintableMap;

  /// @custom:oz-renamed-from _promptMonsters
  IPromptMonsters private _promptMonsters;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev Initialize
  function initialize() public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    GAME_ROLE = keccak256("GAME_ROLE");

    _grantRole(GAME_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _languages
  /// @return returnValue _languages
  function getLanguages() external view returns (string[] memory returnValue) {
    returnValue = _languages;
  }

  /// @dev Get monster adj
  /// @param resurrectionPrompt resurrection prompt
  /// @return monsterAdj monster adj
  function getMonsterAdj(
    address resurrectionPrompt
  ) public view returns (IBossMonster.MonsterAdj memory monsterAdj) {
    monsterAdj = IBossMonster.MonsterAdj(
      _weaknessFeatureAdjs[resurrectionPrompt]
    );
  }

  /// @dev Get boss extension
  /// @param language language
  /// @return bossExtension boss extension
  function getBossExtension(
    string memory language
  )
    external
    view
    returns (IPromptMonstersExtension.MonsterExtension memory bossExtension)
  {
    IPromptMonsters.Monster memory boss = _bossMap[language];

    uint256 length = boss.skills.length;
    uint32[] memory skillTypes = new uint32[](length);
    for (uint i; i < length; ) {
      skillTypes[i] = _skillTypes[boss.skills[i]];
      unchecked {
        ++i;
      }
    }

    bossExtension = IPromptMonstersExtension.MonsterExtension(
      boss.feature,
      boss.name,
      boss.flavor,
      boss.skills,
      boss.lv,
      boss.hp,
      boss.atk,
      boss.def,
      boss.inte,
      boss.mgr,
      boss.agl,
      skillTypes,
      address(0)
    );
  }

  /// @dev Get _mintable
  /// @param user user
  /// @return returnValue _mintable
  function getMintable(address user) external view returns (bool returnValue) {
    returnValue = _mintableMap[user];
  }

  /// @dev Get _promptMonsters
  /// @return returnValue _promptMonsters
  function getPromptMonsters()
    external
    view
    returns (IPromptMonsters returnValue)
  {
    returnValue = _promptMonsters;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add language
  /// @param language language
  function addLanguage(
    string memory language
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _languages.push(language);

    emit AddedLanguage(_msgSender(), _languages.length, language);
  }

  /// @dev Set _languages
  /// @param index index
  /// @param language language
  function setLanguage(
    uint256 index,
    string memory language
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      index < _languages.length,
      "BossMonsterMchYoshka: index out of range"
    );
    string memory oldValue = _languages[index];
    _languages[index] = language;

    emit SetLanguage(_msgSender(), index, oldValue, language);
  }

  /// @dev Set boss
  /// @param language language
  /// @param boss boss
  function setBoss(
    string memory language,
    IPromptMonsters.Monster memory boss
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool included;
    for (uint i; i < _languages.length; ) {
      if (
        keccak256(abi.encodePacked(_languages[i])) ==
        keccak256(abi.encodePacked(language))
      ) {
        included = true;
        break;
      }
      unchecked {
        ++i;
      }
    }
    require(included, "BossMonsterMchYoshka: language not included");
    IPromptMonsters.Monster memory oldValue = _bossMap[language];
    _bossMap[language] = boss;

    emit SetBoss(_msgSender(), oldValue, boss);
  }

  /// @dev Set _skillTypes
  /// @param skills skills
  /// @param skillTypes skillTypes
  function setSkillTypes(
    string[] memory skills,
    uint32[] memory skillTypes
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 length = skills.length;
    require(
      length == skillTypes.length,
      "BossMonsterMchYoshka: length mismatch"
    );
    uint32[] memory oldValue = new uint32[](length);
    for (uint i; i < length; ) {
      oldValue[i] = _skillTypes[skills[i]];
      _skillTypes[skills[i]] = skillTypes[i];
      unchecked {
        ++i;
      }
    }

    emit SetSkillTypes(_msgSender(), oldValue, skillTypes);
  }

  /// @dev Set monster adj for this boss monster
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  function setMonsterAdj(
    address resurrectionPrompt,
    IBossMonster.MonsterAdj memory monsterAdj
  ) external onlyRole(GAME_ROLE) {
    IBossMonster.MonsterAdj memory oldValue = getMonsterAdj(resurrectionPrompt);
    _weaknessFeatureAdjs[resurrectionPrompt] = monsterAdj.weaknessFeatureAdj;

    emit SetMonsterAdj(_msgSender(), resurrectionPrompt, oldValue, monsterAdj);
  }

  /// @dev Set skills
  /// @param skills skills
  function addSkills(
    string memory language,
    string[] memory skills
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 length = skills.length;
    for (uint i; i < length; ) {
      _bossMap[language].skills.push(skills[i]);
      unchecked {
        ++i;
      }
    }

    emit AddedSkills(_msgSender(), language, skills);
  }

  /// @dev Set _promptMonsters
  /// @param newValue _promptMonsters
  function setPromptMonsters(
    address newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IPromptMonsters oldValue = _promptMonsters;
    _promptMonsters = IPromptMonsters(newValue);

    emit SetPromptMonsters(_msgSender(), oldValue, _promptMonsters);
  }

  /// @dev Set boss feature
  /// @param language language
  /// @param newValue new feature
  function setFeature(
    string memory language,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldValue = _bossMap[language].feature;
    _bossMap[language].feature = newValue;

    emit SetFeature(_msgSender(), language, oldValue, newValue);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev changeMintable
  /// @param user user
  function changeMintable(address user) external onlyRole(GAME_ROLE) {
    require(!_mintableMap[user], "Already mintable");
    _mintableMap[user] = true;

    emit ChangedMintable(msg.sender, user, _mintableMap[user]);
  }

  /// @dev mintBoss
  /// @param to to
  /// @param monsterExtension monsterExtension
  /// @param imageURL imageURL
  function mintBoss(
    address to,
    IPromptMonstersExtension.MonsterExtension memory monsterExtension,
    string memory imageURL
  ) external onlyRole(GAME_ROLE) {
    require(_mintableMap[to], "Not mintable");
    _mintableMap[to] = false;
    _promptMonsters.mintOnlyGameRole(to, monsterExtension, imageURL);

    emit MintedBoss(_msgSender(), to, monsterExtension, imageURL);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
