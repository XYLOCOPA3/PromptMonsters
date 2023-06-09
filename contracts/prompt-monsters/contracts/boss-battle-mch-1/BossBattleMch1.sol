// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

import {IBossBattleEvent, IBossMonster} from "../interfaces/IBossBattleEvent.sol";
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

  /// @custom:oz-renamed-from GAME_ROLE
  bytes32 private GAME_ROLE;

  /// @custom:oz-renamed-from _bossMonster
  IBossMonster private _bossMonster;

  /// @custom:oz-renamed-from _highScoreMap
  mapping(address => uint32) private _highScoreMap;

  /// @custom:oz-renamed-from _bossBattleStartedMap
  mapping(address => bool) private _bossBattleStartedMap;

  /// @custom:oz-renamed-from _bossBattleContinuedMap
  mapping(address => bool) private _bossBattleContinuedMap;

  /// @custom:oz-renamed-from _lpMap
  mapping(address => uint32) private _lpMap;

  /// @custom:oz-renamed-from _turnMap
  mapping(address => uint32) private _turnMap;

  /// @custom:oz-renamed-from _scoreMap
  mapping(address => uint32) private _scoreMap;

  /// @custom:oz-renamed-from _monsterAdjMap
  mapping(address => uint32) private _monsterAdjMap;

  /// @custom:oz-renamed-from _bossAdjMap
  mapping(address => uint32) private _bossAdjMap;

  /// @custom:oz-renamed-from _bossSignMap
  mapping(address => uint32) private _bossSignMap;

  /// @custom:oz-renamed-from _hasHealItemMap
  mapping(address => bool) private _hasHealItemMap;

  /// @custom:oz-renamed-from _hasBuffItemMap
  mapping(address => bool) private _hasBuffItemMap;

  /// @custom:oz-renamed-from _hasDebuffItemMap
  mapping(address => bool) private _hasDebuffItemMap;

  /// @custom:oz-renamed-from _hasEscapeItemMap
  mapping(address => bool) private _hasEscapeItemMap;

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
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  /// @dev Modifier for only started boss battle
  /// @param resurrectionPrompt resurrectionPrompt
  modifier onlyStarted(address resurrectionPrompt) {
    require(
      _bossBattleStartedMap[resurrectionPrompt],
      "BossBattleEvent: monster has not started boss battle"
    );
    _;
  }

  /// @dev Modifier for only not started boss battle
  /// @param resurrectionPrompt resurrectionPrompt
  modifier onlyNotStarted(address resurrectionPrompt) {
    require(
      !_bossBattleStartedMap[resurrectionPrompt],
      "BossBattleEvent: monster has already started boss battle"
    );
    _;
  }

  /// @dev Modifier for only continued boss battle
  /// @param resurrectionPrompt resurrectionPrompt
  modifier onlyContinued(address resurrectionPrompt) {
    require(
      _bossBattleContinuedMap[resurrectionPrompt],
      "BossBattleEvent: monster has not continued boss battle"
    );
    _;
  }

  /// @dev Modifier for only not continued boss battle
  /// @param resurrectionPrompt resurrectionPrompt
  modifier onlyNotContinued(address resurrectionPrompt) {
    require(
      !_bossBattleContinuedMap[resurrectionPrompt],
      "BossBattleEvent: monster has already continued boss battle"
    );
    _;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _bossMonster
  /// @return returnState _bossMonster
  function getBossMonster() external view returns (IBossMonster returnState) {
    returnState = _bossMonster;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set _bossMonster
  /// @param bossMonsterAddress bossMonster address
  function setBossMonster(
    address bossMonsterAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IBossMonster oldValue = _bossMonster;
    _bossMonster = IBossMonster(bossMonsterAddress);

    emit SetBossMonster(_msgSender(), oldValue, _bossMonster);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get BBState
  /// @param resurrectionPrompt resurrection prompt
  /// @return bbState BBState
  function getBBState(
    address resurrectionPrompt
  ) public view returns (IBossBattleEvent.BBState memory bbState) {
    bbState = IBossBattleEvent.BBState(
      _bossBattleStartedMap[resurrectionPrompt],
      _bossBattleContinuedMap[resurrectionPrompt],
      _lpMap[resurrectionPrompt],
      _turnMap[resurrectionPrompt],
      _scoreMap[resurrectionPrompt],
      _monsterAdjMap[resurrectionPrompt],
      _bossAdjMap[resurrectionPrompt],
      _bossSignMap[resurrectionPrompt],
      _hasHealItemMap[resurrectionPrompt],
      _hasBuffItemMap[resurrectionPrompt],
      _hasDebuffItemMap[resurrectionPrompt],
      _hasEscapeItemMap[resurrectionPrompt]
    );
  }

  /// @dev Start boss battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  /// @param bossSign boss sign
  function startBossBattle(
    address resurrectionPrompt,
    uint32 monsterAdj,
    uint32 bossSign
  ) external onlyRole(GAME_ROLE) onlyNotStarted(resurrectionPrompt) {
    _initBBState(resurrectionPrompt, monsterAdj, bossSign);

    IBossBattleEvent.BBState memory bbState = getBBState(resurrectionPrompt);
    emit StartedBossBattle(_msgSender(), resurrectionPrompt, bbState);
  }

  /// @dev updateBossBattleResult
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function updateBossBattleResult(
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  )
    external
    onlyRole(GAME_ROLE)
    onlyStarted(resurrectionPrompt)
    onlyContinued(resurrectionPrompt)
  {
    IBossBattleEvent.BBState memory oldValue = getBBState(resurrectionPrompt);

    _bossBattleContinuedMap[resurrectionPrompt] = false;
    _lpMap[resurrectionPrompt] = bbState.lp;
    _scoreMap[resurrectionPrompt] = bbState.score;
    _monsterAdjMap[resurrectionPrompt] = bbState.monsterAdj;
    _bossAdjMap[resurrectionPrompt] = bbState.bossAdj;
    _hasHealItemMap[resurrectionPrompt] = bbState.hasHealItem;
    _hasBuffItemMap[resurrectionPrompt] = bbState.hasBuffItem;
    _hasDebuffItemMap[resurrectionPrompt] = bbState.hasDebuffItem;
    _hasEscapeItemMap[resurrectionPrompt] = bbState.hasEscapeItem;

    IBossBattleEvent.BBState memory newBbState = getBBState(resurrectionPrompt);

    emit UpdatedBossBattleResult(
      _msgSender(),
      resurrectionPrompt,
      oldValue,
      newBbState
    );
  }

  /// @dev Continue boss battle
  /// @param resurrectionPrompt resurrection prompt
  /// @param bossSign boss sign
  function continueBossBattle(
    address resurrectionPrompt,
    uint32 bossSign
  )
    external
    onlyRole(GAME_ROLE)
    onlyStarted(resurrectionPrompt)
    onlyNotContinued(resurrectionPrompt)
  {
    require(
      _lpMap[resurrectionPrompt] > 0,
      "BossBattleEvent: You have already lost all LP"
    );
    IBossBattleEvent.BBState memory oldValue = getBBState(resurrectionPrompt);

    _bossBattleContinuedMap[resurrectionPrompt] = true;
    _turnMap[resurrectionPrompt] = _turnMap[resurrectionPrompt] + 1;
    _bossSignMap[resurrectionPrompt] = bossSign;

    IBossBattleEvent.BBState memory bbState = getBBState(resurrectionPrompt);

    emit ContinuedBossBattle(
      _msgSender(),
      resurrectionPrompt,
      oldValue,
      bbState
    );
  }

  /// @dev End boss battle
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    address resurrectionPrompt
  )
    external
    onlyRole(GAME_ROLE)
    onlyStarted(resurrectionPrompt)
    onlyNotContinued(resurrectionPrompt)
  {
    IBossBattleEvent.BBState memory oldValue = getBBState(resurrectionPrompt);

    _bossBattleStartedMap[resurrectionPrompt] = false;
    _updateHighScore(resurrectionPrompt);

    IBossBattleEvent.BBState memory bbState = getBBState(resurrectionPrompt);
    emit EndedBossBattle(_msgSender(), resurrectionPrompt, oldValue, bbState);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Init BBState
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  /// @param bossSign boss sign
  function _initBBState(
    address resurrectionPrompt,
    uint32 monsterAdj,
    uint32 bossSign
  ) internal onlyRole(GAME_ROLE) {
    _bossBattleStartedMap[resurrectionPrompt] = true;
    _bossBattleContinuedMap[resurrectionPrompt] = true;
    _lpMap[resurrectionPrompt] = 400;
    _turnMap[resurrectionPrompt] = 1;
    _scoreMap[resurrectionPrompt] = 0;
    _monsterAdjMap[resurrectionPrompt] = monsterAdj;
    _bossAdjMap[resurrectionPrompt] = 100;
    _bossSignMap[resurrectionPrompt] = bossSign;
    _hasHealItemMap[resurrectionPrompt] = false;
    _hasBuffItemMap[resurrectionPrompt] = false;
    _hasDebuffItemMap[resurrectionPrompt] = false;
    _hasEscapeItemMap[resurrectionPrompt] = false;
  }

  /// @dev Update high score
  /// @param resurrectionPrompt resurrection prompt
  function _updateHighScore(
    address resurrectionPrompt
  ) internal onlyRole(GAME_ROLE) {
    if (_lpMap[resurrectionPrompt] == 0) return;
    if (_highScoreMap[resurrectionPrompt] >= _scoreMap[resurrectionPrompt])
      return;
    uint32 oldValue = _highScoreMap[resurrectionPrompt];
    _highScoreMap[resurrectionPrompt] = _scoreMap[resurrectionPrompt];
    emit UpdatedHighScore(
      _msgSender(),
      resurrectionPrompt,
      oldValue,
      _highScoreMap[resurrectionPrompt]
    );
  }

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

  // TODO: 後で消す(開発用) ------------
  /// @dev Delete BBState
  /// @param resurrectionPrompt resurrection prompt
  function deleteBBState(
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    delete _bossBattleStartedMap[resurrectionPrompt];
    delete _bossBattleContinuedMap[resurrectionPrompt];
    delete _lpMap[resurrectionPrompt];
    delete _turnMap[resurrectionPrompt];
    delete _scoreMap[resurrectionPrompt];
    delete _monsterAdjMap[resurrectionPrompt];
    delete _bossAdjMap[resurrectionPrompt];
    delete _bossSignMap[resurrectionPrompt];
    delete _hasHealItemMap[resurrectionPrompt];
    delete _hasBuffItemMap[resurrectionPrompt];
    delete _hasDebuffItemMap[resurrectionPrompt];
    delete _hasEscapeItemMap[resurrectionPrompt];
  }
}
