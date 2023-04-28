// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IStamina
/// @notice This is an interface of SeasonforBattle.
interface IStamina {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Initialize
  /// @param promptMonstersAddress PromptMonsters contract address
  function initialize(address promptMonstersAddress) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get prompt monsters contract address
  /// @return prompt monsters contract address
  function getPromptMonstersAddress() external view returns (address);

  /// @notice Get time std of the monster
  /// @param monsterId ID of the monster
  /// @return time std
  function getTimeStd(uint256 monsterId) external view returns (uint256);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Set prompt monsters contract address
  /// @param promptMonstersAddress PromptMonsters contract address
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  /// @notice Set last fight time of the monster
  /// @param monsterId ID of the monster
  /// @param _timeStd last fight time
  function setTimeStd(uint256 monsterId, uint256 _timeStd) external;

  /// @notice Set stamina limit
  /// @param _staminaLimit stamina limit
  function setStaminaLimit(uint256 _staminaLimit) external;

  /// @notice Set stamina recovery time
  /// @param _staminaRecoveryTime stamina recovery time
  function setStaminaRecoveryTime(uint256 _staminaRecoveryTime) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Calculate stamina
  /// @param monsterId ID of the monster
  /// @return stamina
  function calculateStamina(uint256 monsterId) external view returns (uint256);

  /// @notice Consume stamina
  /// @param monsterId ID of the monster
  /// @param consumedStamina stamina
  function consumeStamina(uint256 monsterId, uint256 consumedStamina) external;
}
