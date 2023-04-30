// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IStamina} from "./IStamina.sol";

/// @title Stamina
/// @dev This is a contract of Stamina.
contract Stamina is
  Initializable,
  IStamina,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes32 public GAME_ROLE;

  IPromptMonsters public promptMonsters;

  uint256 public staminaLimit;

  uint256 public staminaRecoveryTime;

  mapping(uint256 => uint256) public timeStd;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev Initialize
  /// @param promptMonstersAddress PromptMonsters contract address
  function initialize(address promptMonstersAddress) public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    promptMonsters = IPromptMonsters(promptMonstersAddress);

    staminaLimit = 3;
    staminaRecoveryTime = 28800;

    GAME_ROLE = keccak256("GAME_ROLE");

    _grantRole(GAME_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get prompt monsters contract address
  /// @return prompt monsters contract address
  function getPromptMonstersAddress() external view returns (address) {
    return address(promptMonsters);
  }

  /// @dev Get time std of the monster
  /// @param monsterId ID of the monster
  /// @return time std
  function getTimeStd(uint256 monsterId) external view returns (uint256) {
    return timeStd[monsterId];
  }

  /// @dev Get time std of the monsters
  /// @param monsterIds ID of the monsters
  /// @return time stds
  function getTimeStds(
    uint256[] memory monsterIds
  ) external view returns (uint256[] memory) {
    uint256[] memory _timeStds = new uint256[](monsterIds.length);
    for (uint256 i = 0; i < monsterIds.length; i++) {
      _timeStds[i] = timeStd[monsterIds[i]];
    }
    return _timeStds;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set prompt monsters contract address
  /// @param promptMonstersAddress PromptMonsters contract address
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = IPromptMonsters(promptMonstersAddress);
  }

  /// @dev Set last fight time of the monster
  /// @param monsterId ID of the monster
  /// @param _timeStd last fight time
  function setTimeStd(
    uint256 monsterId,
    uint256 _timeStd
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters.checkMonsterId(monsterId);
    timeStd[monsterId] = _timeStd;
  }

  /// @dev Set stamina limit
  /// @param _staminaLimit stamina limit
  function setStaminaLimit(
    uint256 _staminaLimit
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaLimit = _staminaLimit;
  }

  /// @dev Set stamina recovery time
  /// @param _staminaRecoveryTime stamina recovery time
  function setStaminaRecoveryTime(
    uint256 _staminaRecoveryTime
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaRecoveryTime = _staminaRecoveryTime;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Calculate stamina
  /// @param monsterId ID of the monster
  /// @return stamina
  function calculateStamina(uint256 monsterId) public view returns (uint256) {
    uint256 timeStdOfMonster = timeStd[monsterId];
    uint256 _staminaLimit = staminaLimit;
    if (timeStdOfMonster == 0) return _staminaLimit;
    uint256 stamina = (block.timestamp - timeStdOfMonster) /
      staminaRecoveryTime;
    if (stamina > _staminaLimit) return _staminaLimit;
    return stamina;
  }

  /// @dev Consume stamina
  /// @param monsterId ID of the monster
  /// @param consumedStamina consumed stamina
  function consumeStamina(
    uint256 monsterId,
    uint256 consumedStamina
  ) external onlyRole(GAME_ROLE) {
    promptMonsters.checkMonsterId(monsterId);
    uint256 _timeStd = timeStd[monsterId];
    uint256 _staminaLimit = staminaLimit;
    uint256 _staminaRecoveryTime = staminaRecoveryTime;
    uint256 timeDiff = block.timestamp - _timeStd;
    if (_timeStd == 0 || timeDiff >= _staminaLimit * _staminaRecoveryTime) {
      timeStd[monsterId] =
        block.timestamp -
        ((_staminaLimit - consumedStamina) * _staminaRecoveryTime);
      return;
    }
    timeStd[monsterId] = _timeStd + (_staminaRecoveryTime * consumedStamina);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Calculate stamina
  /// @param monsterId ID of the monster
  /// @return stamina
  function _calculateStamina(
    uint256 monsterId
  ) internal view returns (uint256) {
    uint256 timeStdOfMonster = timeStd[monsterId];
    uint256 _staminaLimit = staminaLimit;
    if (timeStdOfMonster == 0) return _staminaLimit;
    uint256 stamina = (block.timestamp - timeStdOfMonster) /
      staminaRecoveryTime;
    if (stamina > _staminaLimit) return _staminaLimit;
    return stamina;
  }

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
