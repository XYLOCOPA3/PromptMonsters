// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

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

  bytes32 private GAME_ROLE;

  mapping(address => uint32) private _fieldAdjs;

  mapping(address => uint32) private _weaknessFeatureAdjs;

  IPromptMonsters.Monster private _boss;

  mapping(string => uint32) private _skillTypes;

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
  // Getter
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set boss
  /// @param boss boss
  function setBoss(
    IPromptMonsters.Monster memory boss
  ) external onlyRole(GAME_ROLE) {
    IPromptMonsters.Monster memory oldValue = _boss;
    _boss = boss;

    emit SetBoss(_msgSender(), oldValue, _boss);
  }

  /// @dev Set _skillTypes
  /// @param skills skills
  /// @param skillTypes skillTypes
  function setSkillTypes(
    string[] memory skills,
    uint32[] memory skillTypes
  ) external onlyRole(GAME_ROLE) {
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
        i++;
      }
    }

    emit SetSkillTypes(_msgSender(), oldValue, skillTypes);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get monster adjs
  /// @param resurrectionPrompts resurrection prompts
  /// @return monsterAdjs monster adjs
  function getMonsterAdjs(
    address[] memory resurrectionPrompts
  ) external view returns (IBossMonster.MonsterAdj[] memory monsterAdjs) {
    uint256 length = resurrectionPrompts.length;
    monsterAdjs = new IBossMonster.MonsterAdj[](length);
    for (uint i; i < length; ) {
      monsterAdjs[i] = IBossMonster.MonsterAdj(
        _fieldAdjs[resurrectionPrompts[i]],
        _weaknessFeatureAdjs[resurrectionPrompts[i]]
      );
      unchecked {
        i++;
      }
    }
  }

  /// @dev Get boss extension
  /// @return bossExtension boss extension
  function getBossExtension()
    external
    view
    returns (IPromptMonstersExtension.MonsterExtension memory bossExtension)
  {
    uint256 length = _boss.skills.length;
    uint32[] memory skillTypes = new uint32[](length);
    for (uint i; i < length; ) {
      skillTypes[i] = _skillTypes[_boss.skills[i]];
      unchecked {
        i++;
      }
    }
    bossExtension = IPromptMonstersExtension.MonsterExtension(
      _boss.feature,
      _boss.name,
      _boss.flavor,
      _boss.skills,
      _boss.lv,
      _boss.hp,
      _boss.atk,
      _boss.def,
      _boss.inte,
      _boss.mgr,
      _boss.agl,
      skillTypes,
      address(0)
    );
  }

  /// @dev Set monster adjs for this boss monster
  /// @param resurrectionPrompts resurrection prompt
  /// @param monsterAdjs monster adjs
  function setMonsterAdjs(
    address[] memory resurrectionPrompts,
    IBossMonster.MonsterAdj[] memory monsterAdjs
  ) external onlyRole(GAME_ROLE) {
    uint256 length = resurrectionPrompts.length;
    require(length == monsterAdjs.length, "Invalid length");
    IBossMonster.MonsterAdj[] memory oldState = new IBossMonster.MonsterAdj[](
      length
    );
    for (uint i; i < length; ) {
      oldState[i] = IBossMonster.MonsterAdj(
        _fieldAdjs[resurrectionPrompts[i]],
        _weaknessFeatureAdjs[resurrectionPrompts[i]]
      );
      _fieldAdjs[resurrectionPrompts[i]] = monsterAdjs[i].fieldAdj;
      _weaknessFeatureAdjs[resurrectionPrompts[i]] = monsterAdjs[i]
        .weaknessFeatureAdj;
      unchecked {
        i++;
      }
    }

    emit SetMonsterAdjs(
      _msgSender(),
      resurrectionPrompts,
      oldState,
      monsterAdjs
    );
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
