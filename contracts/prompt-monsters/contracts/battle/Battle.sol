// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBattle} from "./IBattle.sol";
import {ITestBS} from "../interfaces/IBattleSeason.sol";
import {ITestPM} from "../prompt-monsters/IPromptMonsters.sol";
import {ITestS} from "../stamina/IStamina.sol";

/// @title Battle
/// @dev This is a contract of Battle.
contract Battle is
  Initializable,
  IBattle,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  ITestPM public promptMonsters;

  ITestS public stamina;

  address[] private _battleSeasonsAddress;

  uint256 public battleStamina;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev Initializeaddress
  /// @param promptMonstersAddress PromptMonsters contract address
  /// @param staminaAddress Stamina contract address
  function initialize(
    address promptMonstersAddress,
    address staminaAddress
  ) public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    promptMonsters = ITestPM(promptMonstersAddress);
    stamina = ITestS(staminaAddress);
    battleStamina = 1;

    _grantRole(DEFAULT_ADMIN_ROLE, address(this));
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get battleSeasonAddress
  /// @param seasonId ID of the season
  /// @return address of battleSeason
  function getBattleSeasonAddress(
    uint256 seasonId
  ) external view returns (address) {
    return _battleSeasonsAddress[seasonId];
  }

  /// @dev Get total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getSeasonMatchCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return ITestBS(_battleSeasonsAddress[seasonId]).getMatchCount(monsterId);
  }

  /// @dev Get batch total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total match counts
  function getBatchSeasonMatchCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    return
      ITestBS(_battleSeasonsAddress[seasonId]).getBatchMatchCount(monsterIds);
  }

  /// @dev Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getSeasonWinCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return ITestBS(_battleSeasonsAddress[seasonId]).getWinCount(monsterId);
  }

  /// @dev Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total win counts
  function getBatchSeasonWinCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    return
      ITestBS(_battleSeasonsAddress[seasonId]).getBatchWinCount(monsterIds);
  }

  /// @dev Get season battleIdList
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return battleIdList
  function getSeasonBattleIdList(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256[] memory) {
    return ITestBS(_battleSeasonsAddress[seasonId]).getBattleIdList(monsterId);
  }

  /// @dev Get _battleSeasonsAddress length
  /// @return battleSeasonsAddressLength
  function getBattleSeasonsAddressLength() external view returns (uint256) {
    return _battleSeasonsAddress.length;
  }

  /// @dev Get season battle data
  /// @param seasonId ID of the season
  /// @return season battle data
  function getSeasonBattleData(
    uint256 seasonId
  ) external view returns (ITestBS.BattleData[] memory) {
    return ITestBS(_battleSeasonsAddress[seasonId]).getBattleData();
  }

  /// @dev Get season battle data by monster ID
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return season battle data
  function getSeasonBattleDataByMonsterId(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (ITestBS.BattleData[] memory) {
    return
      ITestBS(_battleSeasonsAddress[seasonId]).getBattleDataByMonsterId(
        monsterId
      );
  }

  /// @dev Get _battleSeasonsAddress
  /// @return _battleSeasonsAddress
  function getBattleSeasonsAddress() external view returns (address[] memory) {
    return _battleSeasonsAddress;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add battleSeasonAddress
  /// @param battleSeasonAddress address of battleSeason
  function addBattleSeasonAddress(
    address battleSeasonAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _battleSeasonsAddress.push(battleSeasonAddress);

    emit AddBattleSeasonAddress(msg.sender, battleSeasonAddress);
  }

  /// @dev Set battleSeasonAddress
  /// @param seasonId ID of the season
  /// @param battleSeasonAddress address of battleSeason
  function setBattleSeasonAddress(
    uint256 seasonId,
    address battleSeasonAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _battleSeasonsAddress[seasonId] = battleSeasonAddress;

    emit SetBattleSeasonAddress(msg.sender, seasonId, battleSeasonAddress);
  }

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = ITestPM(promptMonstersAddress);

    emit SetPromptMonstersAddress(msg.sender, promptMonstersAddress);
  }

  /// @dev Set staminaAddress
  /// @param staminaAddress address of stamina
  function setStaminaAddress(
    address staminaAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    stamina = ITestS(staminaAddress);

    emit SetStaminaAddress(msg.sender, staminaAddress);
  }

  /// @dev Set battle stamina
  /// @param battleStamina_ battle stamina
  function setBattleStamina(
    uint256 battleStamina_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    battleStamina = battleStamina_;

    emit SetBattleStamina(msg.sender, battleStamina_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Add season battle data
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @param winMonsterId ID of the win monster
  /// @param loseMonsterId ID of the lose monster
  /// @param battleLog Battle log
  function addSeasonBattleData(
    uint256 seasonId,
    uint256 monsterId,
    uint256 winMonsterId,
    uint256 loseMonsterId,
    string memory battleLog
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters.checkMonsterId(winMonsterId);
    promptMonsters.checkMonsterId(loseMonsterId);
    ITestBS(_battleSeasonsAddress[seasonId]).addBattleData(
      winMonsterId,
      loseMonsterId,
      battleLog
    );
    stamina.consumeStamina(monsterId, battleStamina);
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
