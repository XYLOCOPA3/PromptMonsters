// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

/// @title BossBattleMzDao
/// @dev This is a contract of BossBattleMzDao.
contract BossBattleMzDao is
  Initializable,
  IBossBattleEvent,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes32 public GAME_ROLE;

  IPromptMonsters public promptMonsters;

  bool public isInBossBattle;

  BossStatus public bossStatus;

  // key: resurrection prompt => value: {score, monster hp, boss hp}
  mapping(address => BBState) private bbStates;

  // key: resurrection prompt, value: {terrainAdj, specialBuff}
  mapping(address => MonsterStatusForBbEvent) private _bbStatuses;

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

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(msg.sender, promptMonstersAddress);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  function startBossBattle(
    address resurrectionPrompt
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(!isInBossBattle, "BossBattleMzDao: already started");
    isInBossBattle = true;
  }

  /// @dev battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param skillIndex skill index of the monster to use
  /// @return result of the battle
  function battle(
    address resurrectionPrompt,
    uint256 skillIndex
  ) external onlyRole(GAME_ROLE) returns (bool) {
    require(isInBossBattle, "BossBattleMzDao: not started");
    // @todo return if the monster is alive
    return true;
  }

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    address resurrectionPrompt
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {}

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
