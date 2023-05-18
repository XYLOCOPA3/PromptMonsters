// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IStamina} from "./IStamina.sol";

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

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

  using SafeERC20 for IERC20;
  IERC20 public erc20;

  uint256 public restorePrice;

  address public promptMonstersWallet;

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

    emit SetPromptMonstersAddress(msg.sender, promptMonstersAddress);
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

    emit SetTimeStd(msg.sender, monsterId, _timeStd);
  }

  /// @dev Set stamina limit
  /// @param _staminaLimit stamina limit
  function setStaminaLimit(
    uint256 _staminaLimit
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaLimit = _staminaLimit;

    emit SetStaminaLimit(msg.sender, _staminaLimit);
  }

  /// @dev Set stamina recovery time
  /// @param _staminaRecoveryTime stamina recovery time
  function setStaminaRecoveryTime(
    uint256 _staminaRecoveryTime
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    staminaRecoveryTime = _staminaRecoveryTime;

    emit SetStaminaRecoveryTime(msg.sender, _staminaRecoveryTime);
  }

  /// @dev Set restore price
  /// @param newState_ restore price
  function setRestorePrice(
    uint256 newState_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 oldState_ = restorePrice;
    restorePrice = newState_;

    emit SetRestorePrice(msg.sender, oldState_, restorePrice);
  }

  /// @dev Set prompt monsters wallet
  /// @param newState_ new state
  function setPromptMonstersWallet(
    address newState_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldState = promptMonstersWallet;
    promptMonstersWallet = newState_;
    emit SetPromptMonstersWallet(_msgSender(), oldState, newState_);
  }

  /// @dev Set ERC20 address
  /// @param newState_ new state
  function setErc20(address newState_) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldState = address(erc20);
    erc20 = IERC20(newState_);
    emit SetErc20(_msgSender(), oldState, newState_);
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
    if (monsterId == type(uint256).max) return;
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

    emit ConsumeStamina(monsterId, consumedStamina, timeStd[monsterId]);
  }

  /// @dev restore stamina
  /// @param monsterId ID of the monster
  function restoreStamina(uint256 monsterId) external {
    promptMonsters.checkMonsterId(monsterId);
    require(
      monsterId != type(uint256).max,
      "Stamina: You cannot restore stamina of the free monster"
    );
    uint256 stamina = _calculateStamina(monsterId);
    require(
      stamina == 0,
      "Stamina: You cannot restore stamina because it is not empty"
    );

    erc20.safeTransferFrom(msg.sender, promptMonstersWallet, restorePrice);

    uint256 oldTimeStd = timeStd[monsterId];
    timeStd[monsterId] = 0;

    emit RestoredStamina(msg.sender, monsterId, restorePrice, oldTimeStd);
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
