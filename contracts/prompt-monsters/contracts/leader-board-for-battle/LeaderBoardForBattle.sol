// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {ISeasonForBattle} from "../s1-for-battle/ISeasonForBattle.sol";

/// @title LeaderBoardForBattle
/// @notice This is a contract of LeaderBoardForBattle.
contract LeaderBoardForBattle is
  Initializable,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------
  address[] public seasonsForBattleAddress;

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

  /// @notice Get seasonForBattleAddress
  /// @param seasonId ID of the season
  /// @return address of seasonForBattle
  function getSeasonForBattleAddress(
    uint256 seasonId
  ) external view returns (address) {
    return seasonsForBattleAddress[seasonId];
  }

  /// @notice Get total match count of the monster
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getSeasonMatchCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return
      ISeasonForBattle(seasonsForBattleAddress[seasonId]).getMatchCount(
        monsterId
      );
  }

  /// @notice Get total win count of the monster
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getSeasonWinCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256) {
    return
      ISeasonForBattle(seasonsForBattleAddress[seasonId]).getWinCount(
        monsterId
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
      ISeasonForBattle(seasonsForBattleAddress[seasonId]).getBattleIdList(
        monsterId
      );
  }

  /// @notice Get seasonsForBattleAddress length
  /// @return seasonsForBattleAddressLength
  function getSeasonsForBattleAddressLength() external view returns (uint256) {
    return seasonsForBattleAddress.length;
  }

  /// @notice Get season battle data
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return season battle data
  function getSeasonBattleData(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (ISeasonForBattle.BattleData[] memory) {
    return
      ISeasonForBattle(seasonsForBattleAddress[seasonId]).getBattleData(
        monsterId
      );
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Set seasonForBattleAddress
  /// @param seasonForBattleAddress address of seasonForBattle
  function setSeasonForBattleAddress(
    address seasonForBattleAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    seasonsForBattleAddress.push(seasonForBattleAddress);
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
    ISeasonForBattle(seasonsForBattleAddress[seasonId]).addBattleData(
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
