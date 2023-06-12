// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ITestBS} from "../interfaces/IBattleSeason.sol";

/// @title IBattle
/// @dev This is an interface of Battle.
interface ITestB {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event AddBattleSeasonAddress(
    address indexed publisher,
    address indexed battleSeasonAddress
  );

  event SetBattleSeasonAddress(
    address indexed publisher,
    uint256 indexed seasonId,
    address indexed battleSeasonAddress
  );

  event SetPromptMonstersAddress(
    address indexed publisher,
    address indexed newValue
  );

  event SetStaminaAddress(address indexed publisher, address indexed newValue);

  event SetBattleStamina(address indexed publisher, uint256 indexed newValue);

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initializeaddress
  /// @param promptMonstersAddress PromptMonsters contract address
  /// @param staminaAddress Stamina contract address
  function initialize(
    address promptMonstersAddress,
    address staminaAddress
  ) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get battleSeasonAddress
  /// @param seasonId ID of the season
  /// @return address of battleSeason
  function getBattleSeasonAddress(
    uint256 seasonId
  ) external view returns (address);

  /// @dev Get total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total match counts
  function getSeasonMatchCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256);

  /// @dev Get batch total match count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total match counts
  function getBatchSeasonMatchCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory);

  /// @dev Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return total win counts
  function getSeasonWinCount(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256);

  /// @dev Get total win count of the monster
  /// @param seasonId ID of the season
  /// @param monsterIds ID of the monsters
  /// @return total win counts
  function getBatchSeasonWinCount(
    uint256 seasonId,
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory);

  /// @dev Get season battleIdList
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return battleIdList
  function getSeasonBattleIdList(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (uint256[] memory);

  /// @dev Get _battleSeasonsAddress length
  /// @return battleSeasonsAddressLength
  function getBattleSeasonsAddressLength() external view returns (uint256);

  /// @dev Get season battle data
  /// @param seasonId ID of the season
  /// @return season battle data
  function getSeasonBattleData(
    uint256 seasonId
  ) external view returns (ITestBS.BattleData[] memory);

  /// @dev Get season battle data by monster ID
  /// @param seasonId ID of the season
  /// @param monsterId ID of the monster
  /// @return season battle data
  function getSeasonBattleDataByMonsterId(
    uint256 seasonId,
    uint256 monsterId
  ) external view returns (ITestBS.BattleData[] memory);

  /// @dev Get _battleSeasonsAddress
  /// @return _battleSeasonsAddress
  function getBattleSeasonsAddress() external view returns (address[] memory);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Add battleSeasonAddress
  /// @param battleSeasonAddress address of battleSeason
  function addBattleSeasonAddress(address battleSeasonAddress) external;

  /// @dev Set battleSeasonAddress
  /// @param seasonId ID of the season
  /// @param battleSeasonAddress address of battleSeason
  function setBattleSeasonAddress(
    uint256 seasonId,
    address battleSeasonAddress
  ) external;

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress address of promptMonsters
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  /// @dev Set staminaAddress
  /// @param staminaAddress address of stamina
  function setStaminaAddress(address staminaAddress) external;

  /// @dev Set battle stamina
  /// @param battleStamina_ battle stamina
  function setBattleStamina(uint256 battleStamina_) external;

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
  ) external;
}
