// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattle} from "./IBossBattle.sol";
import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

/// @title BossBattle
/// @dev This is a contract of BossBattle.
contract BossBattle is
  Initializable,
  IBossBattle,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes32 public GAME_ROLE;

  bool public isBossBattleActive;

  IPromptMonsters public promptMonsters;

  address[] private _bossBattleEvents;

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

  /// @dev Get addresses of bossBattleEvent
  /// @param bbeIds_ IDs of bossBattleEvent
  /// @return bossBattleEvents addresses of bossBattleEvent
  function getBossBattleEvents(
    uint256[] memory bbeIds_
  ) external view returns (address[] memory bossBattleEvents) {
    uint256 length = bbeIds_.length;
    bossBattleEvents = new address[](length);
    for (uint i; i < length; ) {
      bossBattleEvents[i] = _bossBattleEvents[bbeIds_[i]];
      unchecked {
        ++i;
      }
    }
  }

  /// @dev Get bossBattleEventAddress
  /// @return length addresses of bossBattleEvent
  function getBossBattleEventsLength() external view returns (uint256 length) {
    length = _bossBattleEvents.length;
  }

  // /// @dev Get monster adjs for the boss battle
  // /// @param bbeId_ ID of bossBattleEvent
  // /// @param rps_ array of resurrection prompt
  // /// @return monsterAdjs monster adjs for the boss battle
  // function getMonsterAdjsForBossBattle(
  //   uint256 bbeId_,
  //   address[] rps_
  // ) public view returns (IBossMonster.MonsterAdj[] memory monsterAdjs) {
  //   require(bbeId_ < _bossBattleEvents.length, "BossBattle: Invalid bbeId");
  //   address bossMonsterAddress = address(
  //     IBossBattleEvent(_bossBattleEvents[bbeId_]).getBossMonsterAddress()
  //   );
  //   monsterAdjs = new IBossMonster.MonsterAdj[](rps_.length);
  //   return
  //     IBossMonster(bossMonsterAddress).getMonsterAdjsForBossMonster(
  //       resurrectionPrompt
  //     );
  // }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  // /// @dev Add bossBattleEventAddress
  // /// @param bossBattleEventAddress address of bossBattleEvent
  // function addBossBattleEventAddress(
  //   address bossBattleEventAddress
  // ) external onlyRole(DEFAULT_ADMIN_ROLE) {
  //   _bossBattleEventsAddress.push(bossBattleEventAddress);

  //   emit AddBossBattleEventAddress(_msgSender(), bossBattleEventAddress);
  // }

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = address(promptMonsters);
    promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(
      _msgSender(),
      oldValue,
      promptMonstersAddress
    );
  }

  /// @dev Set isBossBattleActive
  /// @param _isBossBattleActive isBossBattleActive
  function setIsBossBattleActive(
    bool _isBossBattleActive
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool oldValue = isBossBattleActive;
    isBossBattleActive = _isBossBattleActive;

    emit SetIsBossBattleActive(_msgSender(), oldValue, _isBossBattleActive);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  // /// @dev get boss battle data to calculate battle result
  // /// @param bossBattleEventAddress BossBattleEvent contract address
  // /// @param resurrectionPrompt resurrection prompt
  // /// @return bossBattleData
  // function getBossBattleData(
  //   address bossBattleEventAddress,
  //   address resurrectionPrompt
  // ) external view returns (BossBattleData memory) {
  //   IPromptMonsters.MonsterwithSkillTypes memory monster = promptMonsters
  //     .getMonsterWithSkillTypes(resurrectionPrompt);

  //   IBossMonster.MonsterAdj memory monsterAdjs = getMonsterAdjsForBossBattle(
  //     bossBattleEventAddress,
  //     resurrectionPrompt
  //   );

  //   return
  //     BossBattleData({
  //       name: monster.name,
  //       skills: monster.skills,
  //       skillsTypes: monster.skillsTypes,
  //       atk: monster.atk,
  //       def: monster.def,
  //       inte: monster.inte,
  //       mgr: monster.mgr,
  //       fieldAdj: monsterAdjs.fieldAdj,
  //       specialBuff: monsterAdjs.specialBuff
  //     });
  // }

  // /// @dev Start boss battle of the event
  // /// @param bossBattleEventAddress BossBattleEvent contract address
  // /// @param resurrectionPrompt resurrection prompt
  // function startBossBattle(
  //   address bossBattleEventAddress,
  //   address resurrectionPrompt
  // ) external onlyRole(GAME_ROLE) {
  //   uint32[] memory skillsTypes = promptMonsters
  //     .getMonsterWithSkillTypes(resurrectionPrompt)
  //     .skillsTypes;
  //   require(skillsTypes[0] != 0, "no skills");

  //   IBossMonster.MonsterAdj memory monsterAdjs = getMonsterAdjsForBossBattle(
  //     bossBattleEventAddress,
  //     resurrectionPrompt
  //   );
  //   require(monsterAdjs.fieldAdj != 0, "no fieldAdj");

  //   require(isBossBattleActive, "boss battle is not active");

  //   IBossBattleEvent(bossBattleEventAddress).startBossBattle(
  //     resurrectionPrompt
  //   );
  // }

  /// @dev Record battle result with boss of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function recordBossBattle(
    address bossBattleEventAddress,
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(bossBattleEventAddress).recordBossBattle(
      resurrectionPrompt,
      bbState
    );
  }

  /// @dev End boss battle of the event with win
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattleWithWin(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(bossBattleEventAddress).endBossBattleWithWin(
      resurrectionPrompt
    );
  }

  /// @dev End boss battle of the event with lose
  /// @param bossBattleEventAddress BossBattleEvent contract address
  function endBossBattleWithLose(
    address bossBattleEventAddress,
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(bossBattleEventAddress).endBossBattle(resurrectionPrompt);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Initialize initial status for BossBattleMzDao
  function _initializeBBStatus() internal onlyRole(DEFAULT_ADMIN_ROLE) {}

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
