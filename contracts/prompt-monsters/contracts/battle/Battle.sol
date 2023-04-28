// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBattleSeason} from "../interfaces/IBattleSeason.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IStamina} from "../stamina/IStamina.sol";

/// @title Battle
/// @notice This is a contract of Battle.
contract Battle is
  Initializable,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  IPromptMonsters public promptMonsters;
  IStamina public stamina;

  address[] private _battleSeasonsAddress;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initializeaddress
  /// @param promptMonstersAddress PromptMonsters contract address
  /// @param staminaAddress Stamina contract address
  function initialize(
    address promptMonstersAddress,
    address staminaAddress
  ) public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    promptMonsters = IPromptMonsters(promptMonstersAddress);
    stamina = IStamina(staminaAddress);

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get battleSeasonAddress
  /// @param seasonId ID of the season
  /// @return address of battleSeason
  function getBattleSeasonAddress(
    uint256 seasonId
  ) external view returns (address) {
    return _battleSeasonsAddress[seasonId];
  }

  /// @notice Get total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getSeasonMatchCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getMatchCount(monsterId);
  }

  /// @notice Get batch total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total match counts
  function getBatchSeasonMatchCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getBatchMatchCount(
        monsterIds
      );
  }

  /// @notice Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getSeasonWinCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getWinCount(monsterId);
  }

  /// @notice Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total win counts
  function getBatchSeasonWinCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getBatchWinCount(
        monsterIds
      );
  }

  /// @notice Get season battleIdList
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return battleIdList
  function getSeasonBattleIdList(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256[] memory) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getBattleIdList(monsterId);
  }

  /// @notice Get _battleSeasonsAddress length
  /// @return battleSeasonsAddressLength
  function getBattleSeasonsAddressLength() external view returns (uint256) {
    return _battleSeasonsAddress.length;
  }

  /// @notice Get season battle data
  /// @param seasonId ID of the season
  /// @return season battle data
  function getSeasonBattleData(
    uint256 seasonId
  ) external view returns (IBattleSeason.BattleData[] memory) {
    return IBattleSeason(_battleSeasonsAddress[seasonId]).getBattleData();
  }

  /// @notice Get season battle data by monster ID
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return season battle data
  function getSeasonBattleDataByMonsterId(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (IBattleSeason.BattleData[] memory) {
    return
      IBattleSeason(_battleSeasonsAddress[seasonId]).getBattleDataByMonsterId(
        monsterId
      );
  }

  /// @notice Get _battleSeasonsAddress
  /// @return _battleSeasonsAddress
  function getBattleSeasonsAddress() external view returns (address[] memory) {
    return _battleSeasonsAddress;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Add battleSeasonAddress
  /// @param battleSeasonAddress address of battleSeason
  function addBattleSeasonAddress(
    address battleSeasonAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _battleSeasonsAddress.push(battleSeasonAddress);
  }

  /// @notice Set battleSeasonAddress
  /// @param seasonId ID of the season
  /// @param battleSeasonAddress address of battleSeason
  function setBattleSeasonAddress(
    uint256 seasonId,
    address battleSeasonAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _battleSeasonsAddress[seasonId] = battleSeasonAddress;
  }

  /// @notice Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = IPromptMonsters(promptMonstersAddress);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Add season battle data
  /// @param seasonId ID of the season
  /// @param winMonsterId ID of the win monster
  /// @param loseMonsterId ID of the lose monster
  /// @param battleLog Battle log
  function addSeasonBattleData(
    uint256 seasonId,
    uint256 winMonsterId,
    uint256 loseMonsterId,
    string memory battleLog
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters.checkMonsterId(winMonsterId);
    promptMonsters.checkMonsterId(loseMonsterId);

    IBattleSeason(_battleSeasonsAddress[seasonId]).addBattleData(
      winMonsterId,
      loseMonsterId,
      battleLog
    );
  }

  /// @notice Calculate stamina of battle
  /// @param monsterId ID of the monster
  /// @return stamina
  function calculateStamina(uint256 monsterId) external view returns (uint256) {
    return stamina.calculateStamina(monsterId);
  }

  /// @notice Consume stamina
  /// @param monsterId ID of the monster
  /// @param consumedStamina stamina to consume
  function consumeStamina(
    uint256 monsterId,
    uint256 consumedStamina
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters.checkMonsterId(monsterId);

    stamina.consumeStamina(monsterId, consumedStamina);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @notice Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
