// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title IStamina
/// @dev This is an interface of SeasonforBattle.
interface IStamina {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetPromptMonstersAddress(
    address indexed publisher,
    address indexed newValue
  );

  event SetTimeStd(
    address indexed publisher,
    uint256 indexed monsterId,
    uint256 indexed newValue
  );

  event SetStaminaLimit(address indexed publisher, uint256 indexed newValue);

  event SetStaminaRecoveryTime(
    address indexed publisher,
    uint256 indexed newValue
  );

  event SetRestorePrice(
    address indexed publisher,
    uint256 indexed oldState,
    uint256 indexed newState
  );

  event ConsumeStamina(
    uint256 indexed monsterId,
    uint256 indexed consumedStamina,
    uint256 indexed newTimeStd
  );

  event SetPromptMonstersWallet(
    address indexed publisher,
    address oldValue,
    address newValue
  );

  event RestoredStamina(
    address indexed publisher,
    uint256 indexed monsterId,
    uint256 indexed restorePrice,
    uint256 timeStd
  );

  event SetErc20(address indexed publisher, address oldValue, address newValue);

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  /// @param promptMonstersAddress PromptMonsters contract address
  function initialize(address promptMonstersAddress) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get prompt monsters contract address
  /// @return prompt monsters contract address
  function getPromptMonstersAddress() external view returns (address);

  /// @dev Get time std of the monster
  /// @param monsterId ID of the monster
  /// @return time std
  function getTimeStd(uint256 monsterId) external view returns (uint256);

  /// @dev Get time std of the monsters
  /// @param monsterIds ID of the monsters
  /// @return time stds
  function getTimeStds(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set prompt monsters contract address
  /// @param promptMonstersAddress PromptMonsters contract address
  function setPromptMonstersAddress(address promptMonstersAddress) external;

  /// @dev Set last fight time of the monster
  /// @param monsterId ID of the monster
  /// @param _timeStd last fight time
  function setTimeStd(uint256 monsterId, uint256 _timeStd) external;

  /// @dev Set stamina limit
  /// @param _staminaLimit stamina limit
  function setStaminaLimit(uint256 _staminaLimit) external;

  /// @dev Set stamina recovery time
  /// @param _staminaRecoveryTime stamina recovery time
  function setStaminaRecoveryTime(uint256 _staminaRecoveryTime) external;

  /// @dev Set restore price
  /// @param newState_ restore price
  function setRestorePrice(uint256 newState_) external;

  /// @dev Set prompt monsters wallet
  /// @param newState_ new state
  function setPromptMonstersWallet(address newState_) external;

  /// @dev Set ERC20 address
  /// @param newState_ new state
  function setErc20(address newState_) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Consume stamina
  /// @param monsterId ID of the monster
  /// @param consumedStamina consumed stamina
  function consumeStamina(uint256 monsterId, uint256 consumedStamina) external;

  /// @dev restore stamina
  /// @param monsterId ID of the monster
  function restoreStamina(uint256 monsterId) external;
}
