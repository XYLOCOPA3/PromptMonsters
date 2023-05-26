// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

/// @title BossBattleMzclub1
/// @dev This is a contract of BossBattleMzclub1.
contract BossBattleMzclub1 is
  Initializable,
  IBossBattleEvent,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes32 public GAME_ROLE;

  IBossMonster public bossMonster;

  IPromptMonsters public promptMonsters;

  bool public isInBossBattle;

  BBState public initialBBState;

  mapping(uint256 => uint256) public totalScoreById;

  mapping(uint256 => uint256) public totalScoreByRp;

  // key: resurrection prompt => value: {score, monster hp, boss hp}
  mapping(address => BBState) private bbStates;

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

    initialBBState = BBState(0, 0, 100, 100);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get bossMonsterAddress
  /// @return address of bossMonster
  function getBossMonsterAddress() external view returns (address) {
    return address(bossMonster);
  }

  /// @dev Get promptMonstersAddress
  /// @return address of promptMonsters
  function getPromptMonstersAddress() external view returns (address) {
    return address(promptMonsters);
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set bossMonsterAddress
  /// @param bossMonsterAddress address of bossMonster
  function setBossMonsterAddress(
    address bossMonsterAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bossMonster = IBossMonster(bossMonsterAddress);

    emit SetBossMonsterAddress(msg.sender, bossMonsterAddress);
  }

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
    // @todo if this is the first time to play this BB, set bbStatus in this BossMonster
    // @todo initialize bbStates
  }

  /// @dev battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  /// @return result of the battle
  function battle(
    address resurrectionPrompt,
    BBState memory bbState
  ) external onlyRole(GAME_ROLE) {
    require(isInBossBattle, "BossBattleMzDao: not started");
    // @todo update bbStates
    // @todo if the monster is dead, excute endBossBattle()
    // @todo emit event if the monster is alive
  }

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    address resurrectionPrompt
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {}

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev initialize bbStates
  /// @param resurrectionPrompt resurrection prompt

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
