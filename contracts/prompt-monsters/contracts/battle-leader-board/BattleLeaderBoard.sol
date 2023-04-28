// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBattleSeason} from "../interfaces/IBattleSeason.sol";

/// @title BattleLeaderBoard
/// @notice This is a contract of BattleLeaderBoard.
contract BattleLeaderBoard is
  Initializable,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

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
  function initialize() public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

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
  function getBattleSeasonData(
    uint256 seasonId
  ) external view returns (IBattleSeason.BattleData[] memory) {
    return IBattleSeason(_battleSeasonsAddress[seasonId]).getBattleData();
  }

  /// @notice Get season battle data by monster ID
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return season battle data
  function getBattleSeasonDataByMonsterId(
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

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Add season battle data
  /// @param seasonId ID of the season
  /// @param winMonsterId ID of the win monster
  /// @param loseMonsterId ID of the lose monster
  /// @param battleLog Battle log
  function addBattleSeasonData(
    uint256 seasonId,
    uint256 winMonsterId,
    uint256 loseMonsterId,
    string memory battleLog
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IBattleSeason(_battleSeasonsAddress[seasonId]).addBattleData(
      winMonsterId,
      loseMonsterId,
      battleLog
    );
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
