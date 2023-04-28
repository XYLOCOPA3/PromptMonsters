// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IStamina} from "./IStamina.sol";

/// @title Stamina
/// @notice This is a contract of Stamina.
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

  /// @notice Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initialize
  /// @param promptMonstersAddress PromptMonsters contract address
  function initialize(address promptMonstersAddress) public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    promptMonsters = IPromptMonsters(promptMonstersAddress);

    staminaLimit = 100;
    staminaRecoveryTime = 300;

    GAME_ROLE = keccak256("GAME_ROLE");

    _grantRole(GAME_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get prompt monsters contract address
  /// @return prompt monsters contract address
  function getPromptMonstersAddress() external view returns (address) {
    return address(promptMonsters);
  }

  /// @notice Get time std of the monster
  /// @param monsterId ID of the monster
  /// @return time std
  function getTimeStd(uint256 monsterId) external view returns (uint256) {
    return timeStd[monsterId];
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Set prompt monsters contract address
  /// @param promptMonstersAddress PromptMonsters contract address
  function setPromptMonstersAddress(
    address promptMonstersAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters = IPromptMonsters(promptMonstersAddress);
  }

  /// @notice Set last fight time of the monster
  /// @param monsterId ID of the monster
  /// @param _timeStd last fight time
  function setTimeStd(
    uint256 monsterId,
    uint256 _timeStd
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    promptMonsters.checkMonsterId(monsterId);
    timeStd[monsterId] = _timeStd;
  }

  /// @notice Set stamina limit
  /// @param _staminaLimit stamina limit
  function setStaminaLimit(
    uint256 _staminaLimit
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaLimit = _staminaLimit;
  }

  /// @notice Set stamina recovery time
  /// @param _staminaRecoveryTime stamina recovery time
  function setStaminaRecoveryTime(
    uint256 _staminaRecoveryTime
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaRecoveryTime = _staminaRecoveryTime;
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Calculate stamina
  /// @param monsterId ID of the monster
  /// @return stamina
  function calculateStamina(uint256 monsterId) public view returns (uint256) {
    uint256 timeStdOfMonster = timeStd[monsterId];
    uint256 stamina;
    uint256 _staminaLimit = staminaLimit;

    if (timeStdOfMonster != 0) {
      stamina = (block.timestamp - timeStdOfMonster) / staminaRecoveryTime;

      if (stamina > _staminaLimit) {
        stamina = _staminaLimit;
      }
    } else {
      stamina = 1;
    }

    return stamina;
  }

  /// @notice Consume stamina
  /// @param monsterId ID of the monster
  /// @param consumedStamina stamina
  function consumeStamina(
    uint256 monsterId,
    uint256 consumedStamina
  ) external onlyRole(GAME_ROLE) {
    promptMonsters.checkMonsterId(monsterId);

    uint256 stamina = calculateStamina(monsterId);
    require(stamina > 0, "Stamina: stamina is 0");

    uint256 _staminaLimit = staminaLimit;
    uint256 _staminaRecoveryTime = staminaRecoveryTime;

    if (timeStd[monsterId] != 0) {
      uint256 newTimeStd;

      if (stamina >= _staminaLimit) {
        newTimeStd =
          block.timestamp -
          ((_staminaLimit - consumedStamina) * 300);
      } else {
        newTimeStd =
          timeStd[monsterId] +
          (_staminaRecoveryTime * consumedStamina);
      }

      timeStd[monsterId] = newTimeStd;
    } else {
      timeStd[monsterId] = block.timestamp;
    }
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
