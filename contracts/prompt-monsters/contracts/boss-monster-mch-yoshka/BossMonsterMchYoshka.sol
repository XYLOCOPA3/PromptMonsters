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

  bytes32 public GAME_ROLE;

  IPromptMonsters public promptMonsters;

  BossStatus public bossStatus;

  mapping(address => MonsterAdjForBossMonster) private _monstersAdjs;

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

  /// @dev Get bossStatus
  /// @return bossStatus

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = address(promptMonsters);
    promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(msg.sender, oldValue, promptMonstersAddress);
  }

  /// @dev Set bossStatus
  /// @param bossStatus  bossStatus

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get monster adjs for this boss monster
  /// @param resurrectionPrompt resurrection prompt
  /// @return Adjs
  function getMonsterAdjsForBossMonster(
    address resurrectionPrompt
  ) external view returns (MonsterAdjForBossMonster memory) {
    return _monstersAdjs[resurrectionPrompt];
  }

  /// @dev Assign monster adjs for this boss monster
  /// @param resurrectionPrompt resurrection prompt
  /// @param fieldAdj terrain adj
  /// @param specialBuff special buff
  function setMonsterAdjsForBossMonster(
    address resurrectionPrompt,
    uint256 fieldAdj,
    uint256 specialBuff
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _monstersAdjs[resurrectionPrompt] = MonsterAdjForBossMonster(
      fieldAdj,
      specialBuff
    );
    emit SetMonsterAdjsForBossMonster(
      _msgSender(),
      resurrectionPrompt,
      fieldAdj,
      specialBuff
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
