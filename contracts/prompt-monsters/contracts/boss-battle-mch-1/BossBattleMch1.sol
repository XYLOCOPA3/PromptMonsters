// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattleEvent} from "../interfaces/IBossBattleEvent.sol";
import {IBossMonster} from "../interfaces/IBossMonster.sol";
import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";

/// @title BossBattleMch1
/// @dev This is a contract of BossBattleMch1.
contract BossBattleMch1 is
  Initializable,
  IBossBattleEvent,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  bytes32 private GAME_ROLE;

  IBossMonster private _bossMonster;

  IPromptMonsters private _promptMonsters;

  bool private _bossBattleEventActivated;

  // TODO: 名前変える
  mapping(address => bool) private _isMonsterInBossBattle;

  IBossBattleEvent.BBState private _initialIBBState;

  mapping(address => uint256) private _highScores;

  mapping(address => IBossBattleEvent.BBState) private _bbStates;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev Initialize
  function initialize() public initializer {
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    GAME_ROLE = keccak256("GAME_ROLE");

    _grantRole(GAME_ROLE, msg.sender);
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

    _initialIBBState = IBossBattleEvent.BBState(400, 0, 0, 100, 100);
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  /// @dev check if the monster is in boss battle
  modifier onlyMonsterInBossBattle(address resurrectionPrompt) {
    require(
      _isMonsterInBossBattle[resurrectionPrompt],
      "BossBattle: not started"
    );
    _;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get GAME_ROLE
  /// @return returnState GAME_ROLE
  function getGameRole() external view returns (bytes32 returnState) {
    returnState = GAME_ROLE;
  }

  /// @dev Get _bossMonster
  /// @return returnState _bossMonster
  function getBossMonsterAddress() external view returns (address returnState) {
    returnState = address(_bossMonster);
  }

  /// @dev Get _promptMonsters
  /// @return returnState _promptMonsters
  function getPromptMonstersAddress()
    external
    view
    returns (address returnState)
  {
    returnState = address(_promptMonsters);
  }

  /// @dev Get _bossBattleEventActivated
  /// @return returnState _bossBattleEventActivated
  function getBossBattleEventActivated()
    external
    view
    returns (bool returnState)
  {
    returnState = _bossBattleEventActivated;
  }

  /// @dev Get batch _isMonsterInBossBattle
  /// @param rps_ resurrection prompts
  /// @return returnState _isMonsterInBossBattle
  function getBatchIsMonsterInBossBattle(
    address[] memory rps_
  ) external view returns (bool[] memory returnState) {
    uint256 length = rps_.length;
    returnState = new bool[](length);
    for (uint256 i; i < length; ) {
      returnState[i] = _isMonsterInBossBattle[rps_[i]];
      unchecked {
        ++i;
      }
    }
  }

  /// @dev Get _initialIBBState
  /// @return returnState _initialIBBState
  function getInitialBBState()
    external
    view
    returns (IBossBattleEvent.BBState memory returnState)
  {
    returnState = _initialIBBState;
  }

  /// @dev Get batch _highScores
  /// @param rps_ resurrection prompts
  /// @return returnState _highScores
  function getBatchHighScores(
    address[] memory rps_
  ) external view returns (uint256[] memory returnState) {
    uint256 length = rps_.length;
    returnState = new uint256[](length);
    for (uint256 i; i < length; ) {
      returnState[i] = _highScores[rps_[i]];
      unchecked {
        ++i;
      }
    }
  }

  /// @dev Get batch _bbStates
  /// @param rps_ resurrection prompts
  /// @return returnState _bbStates
  function getBatchBbStates(
    address[] memory rps_
  ) external view returns (IBossBattleEvent.BBState[] memory returnState) {
    uint256 length = rps_.length;
    returnState = new IBossBattleEvent.BBState[](length);
    for (uint256 i; i < length; ) {
      returnState[i] = _bbStates[rps_[i]];
      unchecked {
        ++i;
      }
    }
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set bossMonsterAddress
  /// @param bossMonsterAddress_ address of bossMonster
  function setBossMonsterAddress(
    address bossMonsterAddress_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldState = address(_bossMonster);
    _bossMonster = IBossMonster(bossMonsterAddress_);

    emit SetBossMonsterAddress(_msgSender(), oldState, bossMonsterAddress_);
  }

  /// @dev Set promptMonstersAddress
  /// @param promptMonstersAddress_ address of promptMonsters
  function setPromptMonstersAddress(
    address promptMonstersAddress_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldState = address(_promptMonsters);
    _promptMonsters = IPromptMonsters(promptMonstersAddress_);

    emit SetPromptMonstersAddress(
      _msgSender(),
      oldState,
      promptMonstersAddress_
    );
  }

  /// @dev Set bossBattleEventActivated
  /// @param bossBattleEventActivated_ bossBattleEventActivated
  function setBossBattleEventActivated(
    bool bossBattleEventActivated_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool oldState = _bossBattleEventActivated;
    _bossBattleEventActivated = bossBattleEventActivated_;

    emit SetBossBattleEventActivated(
      _msgSender(),
      oldState,
      _bossBattleEventActivated
    );
  }

  /// @dev Set batch isMonsterInBossBattle
  /// @param rps_ resurrection prompts
  /// @param isMonsterInBossBattles_ isMonsterInBossBattles
  function setBatchIsMonsterInBossBattle(
    address[] memory rps_,
    bool[] memory isMonsterInBossBattles_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 length = rps_.length;
    require(
      length == isMonsterInBossBattles_.length,
      "BossBattleEvent: mismatch length"
    );
    bool[] memory oldState = new bool[](length);
    for (uint256 i; i < length; ) {
      oldState[i] = _isMonsterInBossBattle[rps_[i]];
      _isMonsterInBossBattle[rps_[i]] = isMonsterInBossBattles_[i];
      unchecked {
        ++i;
      }
    }

    emit SetBatchIsMonsterInBossBattle(
      _msgSender(),
      oldState,
      isMonsterInBossBattles_
    );
  }

  /// @dev Set initialIBBState
  /// @param initialIBBState_ initialIBBState
  function setInitialIBBState(
    IBossBattleEvent.BBState memory initialIBBState_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IBossBattleEvent.BBState memory oldState = _initialIBBState;
    _initialIBBState = initialIBBState_;

    emit SetInitialIBBState(_msgSender(), oldState, _initialIBBState);
  }

  /// @dev Set batch highScores
  /// @param rps_ resurrection prompts
  /// @param highScores_ highScores
  function setBatchHighScores(
    address[] memory rps_,
    uint256[] memory highScores_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 length = rps_.length;
    require(length == highScores_.length, "BossBattleEvent: mismatch length");
    uint256[] memory oldState = new uint256[](length);
    for (uint256 i; i < length; ) {
      oldState[i] = _highScores[rps_[i]];
      _highScores[rps_[i]] = highScores_[i];
      unchecked {
        ++i;
      }
    }

    emit SetBatchHighScores(_msgSender(), oldState, highScores_);
  }

  /// @dev Set batch bbStates
  /// @param rps_ resurrection prompts
  /// @param bbStates_ bbStates
  function setBatchBbStates(
    address[] memory rps_,
    IBossBattleEvent.BBState[] memory bbStates_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 length = rps_.length;
    require(length == bbStates_.length, "BossBattleEvent: mismatch length");
    IBossBattleEvent.BBState[] memory oldState = new IBossBattleEvent.BBState[](
      length
    );
    for (uint256 i; i < length; ) {
      oldState[i] = _bbStates[rps_[i]];
      _bbStates[rps_[i]] = bbStates_[i];
      unchecked {
        ++i;
      }
    }

    emit SetBatchBbStates(_msgSender(), oldState, bbStates_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  function startBossBattle(
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    require(_bossBattleEventActivated, "BossBattle: not active");
    require(
      !_isMonsterInBossBattle[resurrectionPrompt],
      "BossBattle: already started"
    );
    _bbStates[resurrectionPrompt] = _initialIBBState;
    _isMonsterInBossBattle[resurrectionPrompt] = true;
  }

  /// @dev recordBossBattle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function recordBossBattle(
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  ) external onlyRole(GAME_ROLE) onlyMonsterInBossBattle(resurrectionPrompt) {
    _bbStates[resurrectionPrompt] = bbState;
  }

  /// @dev End boss battle with win
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattleWithWin(
    address resurrectionPrompt
  ) public onlyRole(GAME_ROLE) onlyMonsterInBossBattle(resurrectionPrompt) {
    require(_bbStates[resurrectionPrompt].hp > 0, "BossBattle: you lose");
    uint256 score = _bbStates[resurrectionPrompt].score;
    if (score > _highScores[resurrectionPrompt]) {
      _highScores[resurrectionPrompt] = score;
    }
    endBossBattle(resurrectionPrompt);
  }

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    address resurrectionPrompt
  ) public onlyRole(GAME_ROLE) onlyMonsterInBossBattle(resurrectionPrompt) {
    _bbStates[resurrectionPrompt] = _initialIBBState;
    _isMonsterInBossBattle[resurrectionPrompt] = false;
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev initialize bbStates
  /// @param resurrectionPrompt resurrection prompt

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
