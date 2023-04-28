// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IBattleSeason
/// @notice This is an interface of SeasonforBattle.
interface IBattleSeason {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct BattleData {
    uint256 timestamp;
    string battleLog;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event BattleDataEvent(
    uint256 indexed battleId,
    uint256 timestamp,
    uint256 indexed winMonsterId,
    uint256 indexed loseMonsterId,
    string battleLog
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Initialize
  /// @param battleLeaderBoardAddress PromptMonsters contract address
  function initialize(address battleLeaderBoardAddress) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get total match count of the monster
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getMatchCount(uint256 monsterId) external view returns (uint256);

  /// @notice Get batch total match count of the monster
  /// @param monsterIds IDs of the monster
  /// @return batch total match counts
  function getBatchMatchCount(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory);

  /// @notice Get total wint count of the monster
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getWinCount(uint256 monsterId) external view returns (uint256);

  /// @notice Get batch total win count of the monster
  /// @param monsterIds IDs of the monster
  /// @return batch total win counts
  function getBatchWinCount(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory);

  /// @notice Get battle ID list
  /// @param monsterId ID of the monster
  /// @return battle ID list
  function getBattleIdList(
    uint256 monsterId
  ) external view returns (uint256[] memory);

  /// @notice Get battle data
  /// @return battle data
  function getBattleData() external view returns (BattleData[] memory);

  /// @notice Get battle data by monster ID
  /// @param monsterId ID of the battle
  /// @return battle data
  function getBattleDataByMonsterId(
    uint256 monsterId
  ) external view returns (BattleData[] memory);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

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
  ) external;
}
