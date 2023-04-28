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

  IPromptMonsters public promptMonsters;

  mapping(uint256 => uint256) public timeStd;

  // mapping(uint256 => uint256) public staminaLimit;

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

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    promptMonsters = IPromptMonsters(promptMonstersAddress);
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
    timeStd[monsterId] = _timeStd;
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

    if (timeStdOfMonster != 0) {
      stamina = (block.timestamp - timeStdOfMonster) / 300;

      if (stamina > 100) {
        stamina = 100;
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
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 stamina = calculateStamina(monsterId);
    require(stamina > 0, "Stamina: stamina is 0");

    uint256 newTimeStd = 0;
    if (stamina >= 100) {
      newTimeStd = block.timestamp - ((100 - consumedStamina) * 300);
    } else {
      newTimeStd = timeStd[monsterId] + (300 * consumedStamina);
    }

    timeStd[monsterId] = newTimeStd;
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
