// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

/// @title BossBattleMch1
/// @dev This is a contract of BossBattleMch1.
contract BossBattleMch1 is
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

  mapping(address => bool) public isMonsterInBossBattle;

  BBState public initialBBState;

  mapping(address => uint256) public highScore;

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
  // Modifier
  // --------------------------------------------------------------------------------

  /// @dev check if the monster is in boss battle
  modifier onlyMonsterInBossBattle(address resurrectionPrompt) {
    require(
      isMonsterInBossBattle[resurrectionPrompt],
      "BossBattle: not started"
    );
    _;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get bossMonsterAddress
  function getBossMonsterAddress() external view returns (address) {
    return address(bossMonster);
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set bossMonsterAddress
  /// @param bossMonsterAddress address of bossMonster
  function setBossMonsterAddress(
    address bossMonsterAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = address(bossMonster);
    bossMonster = IBossMonster(bossMonsterAddress);

    emit SetBossMonsterAddress(msg.sender, oldValue, bossMonsterAddress);
  }

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = address(promptMonsters);
    promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(msg.sender, oldValue, promptMonstersAddress);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  function startBossBattle(
    address resurrectionPrompt
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      !isMonsterInBossBattle[resurrectionPrompt],
      "BossBattle: already started"
    );
    // @todo ? if this is the first time to play this BB, set monster's bbStatus for this BossMonster
    bbStates[resurrectionPrompt] = initialBBState;
    isMonsterInBossBattle[resurrectionPrompt] = true;
  }

  /// @dev recordBossBattle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function recordBossBattle(
    address resurrectionPrompt,
    BBState memory bbState
  ) external onlyRole(GAME_ROLE) onlyMonsterInBossBattle(resurrectionPrompt) {
    bbStates[resurrectionPrompt] = bbState;
    // @todo ? if the monster is dead, excute endBossBattle()
    // @todo ? emit event if the monster is alive or dead
  }

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    address resurrectionPrompt
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    // @todo check isMonsterInBossBattle flag
    // @todo update highScore if the score is higher than the previous one
    bbStates[resurrectionPrompt] = initialBBState;
    // @todo turn isMonsterInBossBattle flag to false
    isMonsterInBossBattle[resurrectionPrompt] = false;
  }

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
