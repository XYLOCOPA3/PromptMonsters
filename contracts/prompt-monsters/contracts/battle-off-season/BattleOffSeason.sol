// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBattleSeason} from "../interfaces/IBattleSeason.sol";

/// @title BattleOffSeason
/// @notice This is a contract of BattleOffSeason.
contract BattleOffSeason is
  Initializable,
  IBattleSeason,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  mapping(uint256 => uint256) public matchCount;

  mapping(uint256 => uint256) public winCount;

  mapping(uint256 => uint256[]) public battleIdList;

  BattleData[] public battleData;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initialize
  /// @param battleLeaderBoardAddress BattleLeaderBoard contract address
  function initialize(address battleLeaderBoardAddress) public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, battleLeaderBoardAddress);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get total match count of the monster
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getMatchCount(uint256 monsterId) external view returns (uint256) {
    return matchCount[monsterId];
  }

  /// @notice Get batch total match count of the monster
  /// @param monsterIds IDs of the monster
  /// @return batch total match counts
  function getBatchMatchCount(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    uint256[] memory _monsterIds = monsterIds;
    uint256 monsterIdsLength = _monsterIds.length;
    uint256[] memory _matchCounts = new uint256[](monsterIdsLength);
    for (uint256 i = 0; i < monsterIdsLength; ) {
      _matchCounts[i] = matchCount[_monsterIds[i]];
      unchecked {
        ++i;
      }
    }
    return _matchCounts;
  }

  /// @notice Get total wint count of the monster
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getWinCount(uint256 monsterId) external view returns (uint256) {
    return winCount[monsterId];
  }

  /// @notice Get batch total win count of the monster
  /// @param monsterIds IDs of the monster
  /// @return batch total win counts
  function getBatchWinCount(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    uint256[] memory _monsterIds = monsterIds;
    uint256 monsterIdsLength = _monsterIds.length;
    uint256[] memory _winCounts = new uint256[](monsterIdsLength);
    for (uint256 i = 0; i < monsterIdsLength; ) {
      _winCounts[i] = winCount[_monsterIds[i]];
      unchecked {
        ++i;
      }
    }
    return _winCounts;
  }

  /// @notice Get battle ID list
  /// @param monsterId ID of the monster
  /// @return battle ID list
  function getBattleIdList(
    uint256 monsterId
  ) external view returns (uint256[] memory) {
    return battleIdList[monsterId];
  }

  /// @notice Get battle data
  /// @return battle data
  function getBattleData() external view returns (BattleData[] memory) {
    return battleData;
  }

  /// @notice Get battle data by monster ID
  /// @param monsterId ID of the monster
  /// @return battle data
  function getBattleDataByMonsterId(
    uint256 monsterId
  ) external view returns (BattleData[] memory) {
    uint256[] memory _battleIdList = battleIdList[monsterId];
    uint256 _battleIdListLength = _battleIdList.length;
    BattleData[] memory _battleData = new BattleData[](_battleIdListLength);

    for (uint256 i = 0; i < _battleIdListLength; ) {
      _battleData[i] = battleData[_battleIdList[i]];
      unchecked {
        ++i;
      }
    }
    return _battleData;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Add battle data
  /// @param winMonsterId ID of the monster who won the battle
  /// @param loseMonsterId ID of the monster who lost the battle
  /// @param battleLog Battle log
  function addBattleData(
    uint256 winMonsterId,
    uint256 loseMonsterId,
    string memory battleLog
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    ++matchCount[winMonsterId];
    ++matchCount[loseMonsterId];

    ++winCount[winMonsterId];

    battleData.push(
      BattleData({
        timestamp: block.timestamp,
        winMonsterId: winMonsterId,
        loseMonsterId: loseMonsterId,
        battleLog: battleLog
      })
    );

    uint256 battleId = battleData.length - 1;
    battleIdList[winMonsterId].push(battleId);
    battleIdList[loseMonsterId].push(battleId);

    emit BattleDataEvent(
      battleId,
      block.timestamp,
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
