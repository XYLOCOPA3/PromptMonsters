// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattle} from "./IBossBattle.sol";
import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
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

  bool public whenBossBattleActive;

  IPromptMonsters public promptMonsters;

  mapping(uint256 => bool) public isInBossBattleById;

  mapping(address => bool) public isInBossBattleByRp;

  address[] private _bossBattleEventsAddress;

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

  /// @dev Get bossBattleEventAddress
  /// @return bossBattleEventAddress address of bossBattleEvent
  function getBossBattleEventAddress(
    uint256 index
  ) external view returns (address bossBattleEventAddress) {
    bossBattleEventAddress = _bossBattleEventsAddress[index];
  }

  /// @dev Get promptMonstersAddress
  /// @return promptMonstersAddress address of promptMonsters
  function getPromptMonstersAddress()
    external
    view
    returns (address promptMonstersAddress)
  {
    promptMonstersAddress = address(promptMonsters);
  }

  /// @dev Get whenBossBattleActive

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add bossBattleEventAddress
  /// @param bossBattleEventAddress address of bossBattleEvent
  function addBossBattleEventAddress(
    address bossBattleEventAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _bossBattleEventsAddress.push(bossBattleEventAddress);

    emit AddBossBattleEventAddress(msg.sender, bossBattleEventAddress);
  }

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = IPromptMonsters(promptMonstersAddress);

    emit SetPromptMonstersAddress(msg.sender, promptMonstersAddress);
  }

  /// @dev Set whenBossBattleActive

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Start boss battle of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  function startEventBossBattle(
    address bossBattleEventAddress
  ) external onlyRole(GAME_ROLE) {
    // @todo check if this is the first time of boss battle with PromptMonsters aditional status for boss battle
    // @todo if this is the first time, set additional status for skills in PromptMonsters
    // @todo excute startBossBattle() in arbitary BossBattleEvent contract
  }

  /// @dev retrieve boss battle data for the Event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  /// @return bossBattleData
  function retrieveEventBossBattleData(
    address bossBattleEventAddress
  ) external view returns (BBState memory bossBattleData) {
    // @todo retrieve boss battle data from arbitary BossBattleEvent contract
  }

  /// @dev Battle with boss of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  function battleEventBoss(
    address bossBattleEventAddress
  ) external onlyRole(GAME_ROLE) {
    // @todo excute battle() in arbitary BossBattleEvent contract
  }

  /// @dev End boss battle of the event
  /// @param bossBattleEventAddress BossBattleEvent contract address
  function endEventBossBattle(
    address bossBattleEventAddress
  ) external onlyRole(GAME_ROLE) {
    // @todo excute endBossBattle() in arbitary BossBattleEvent contract
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
