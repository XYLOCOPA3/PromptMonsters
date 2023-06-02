// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

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

  IPromptMonsters private _promptMonsters;

  BossStatus private _bossStatus;

  mapping(address => uint32) private _fieldAdjs;

  mapping(address => uint32) private _specialAdjs;

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

  /// @dev Get _promptMonsters
  /// @return returnState _promptMonsters
  function getPromptMonsters()
    external
    view
    returns (IPromptMonsters returnState)
  {
    returnState = _promptMonsters;
  }

  /// @dev Get _bossStatus
  /// @return returnState _bossStatus
  function getBossStatus()
    external
    view
    returns (BossStatus memory returnState)
  {
    returnState = _bossStatus;
  }

  /// @dev Get _fieldAdjs
  /// @param resurrectionPrompts resurrection prompts
  /// @return returnState _fieldAdjs
  function getFiledAdjs(
    address[] memory resurrectionPrompts
  ) external view returns (uint32[] memory returnState) {
    uint256 length = resurrectionPrompts.length;
    returnState = new uint32[](length);
    for (uint i; i < length; ) {
      returnState[i] = _fieldAdjs[resurrectionPrompts[i]];
      unchecked {
        i++;
      }
    }
  }

  /// @dev Get _specialAdjs
  /// @param resurrectionPrompts resurrection prompts
  /// @return returnState _specialAdjs
  function getSpecialAdjs(
    address[] memory resurrectionPrompts
  ) external view returns (uint32[] memory returnState) {
    uint256 length = resurrectionPrompts.length;
    returnState = new uint32[](length);
    for (uint i; i < length; ) {
      returnState[i] = _specialAdjs[resurrectionPrompts[i]];
      unchecked {
        i++;
      }
    }
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = address(_promptMonsters);
    _promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(
      _msgSender(),
      oldValue,
      promptMonstersAddress
    );
  }

  /// @dev Set bossStatus
  /// @param bossStatus boss status
  function setBossStatus(
    BossStatus memory bossStatus
  ) external onlyRole(GAME_ROLE) {
    BossStatus memory oldValue = _bossStatus;
    _bossStatus = bossStatus;

    emit SetBossStatus(_msgSender(), oldValue, _bossStatus);
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
        _specialAdjs[resurrectionPrompts[i]]
      );
      unchecked {
        i++;
      }
    }
  }

  /// @dev Set monster adjs for this boss monster
  /// @param resurrectionPrompts resurrection prompt
  /// @param monsterAdjs monster adjs
  function setBatchMonsterAdjs(
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
        _specialAdjs[resurrectionPrompts[i]]
      );
      _fieldAdjs[resurrectionPrompts[i]] = monsterAdjs[i].fieldAdj;
      _specialAdjs[resurrectionPrompts[i]] = monsterAdjs[i].specialAdj;
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
