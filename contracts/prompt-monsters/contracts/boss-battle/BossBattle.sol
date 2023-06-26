// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IBossBattle, IBossBattleEvent, IBossMonster, IPromptMonstersExtension} from "./IBossBattle.sol";

/// @title BossBattle
/// @dev This is a contract of BossBattle.
contract BossBattle is
  Initializable,
  IBossBattle,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  /// @custom:oz-renamed-from GAME_ROLE
  bytes32 private GAME_ROLE;

  /// @custom:oz-renamed-from _eventKeys
  string[] private _eventKeys;

  // key -> eventKey
  /// @custom:oz-renamed-from _bossBattleEventMap
  mapping(string => address[]) private _bossBattleEventMap;

  using SafeERC20 for IERC20;
  /// @custom:oz-renamed-from _erc20
  IERC20 private _erc20;

  // key -> eventKey
  /// @custom:oz-renamed-from _bossMonsterWalletMap
  mapping(string => address[]) private _bossMonsterWalletMap;

  /// @custom:oz-renamed-from _mintPrice
  uint256 private _mintPrice;

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

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get _eventKeys
  /// @return returnValue _eventKeys
  function getEventKeys() external view returns (string[] memory returnValue) {
    returnValue = _eventKeys;
  }

  /// @dev Get _bossBattleEventMap
  /// @return returnValue _bossBattleEventMap
  function getBossBattleEvents()
    external
    view
    returns (address[][] memory returnValue)
  {
    uint256 length = _eventKeys.length;
    returnValue = new address[][](length);
    for (uint256 i; i < length; ) {
      returnValue[i] = _bossBattleEventMap[_eventKeys[i]];
      unchecked {
        ++i;
      }
    }
  }

  /// @dev Get _erc20
  /// @return returnValue _erc20
  function getErc20() external view returns (IERC20 returnValue) {
    returnValue = _erc20;
  }

  /// @dev Get _bossMonsterWalletMap
  /// @param eventKey event key
  /// @return returnValue _bossMonsterWalletMap
  function getBossMonsterWallets(
    string memory eventKey
  ) external view returns (address[] memory returnValue) {
    returnValue = _bossMonsterWalletMap[eventKey];
  }

  /// @dev Get _mintPrice
  /// @return returnValue _mintPrice
  function getMintPrice() external view returns (uint256 returnValue) {
    returnValue = _mintPrice;
  }

  /// @dev Get _mintable
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param user user
  /// @return returnValue _mintable
  function getMintable(
    string memory eventKey,
    uint256 bbeId,
    address user
  ) external view returns (bool returnValue) {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    returnValue = bossMonster.getMintable(user);
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set _eventKeys
  /// @param index index
  /// @param eventKey eventKey
  function setEventKey(
    uint256 index,
    string memory eventKey
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(
      index < _eventKeys.length,
      "BossMonsterMchYoshka: index out of range"
    );
    string memory oldValue = _eventKeys[index];
    _eventKeys[index] = eventKey;

    emit SetEventKey(_msgSender(), index, oldValue, eventKey);
  }

  /// @dev Set bossBattleEvent
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param bossBattleEvent address of bossBattleEvent
  function setBossBattleEvent(
    string memory eventKey,
    uint256 bbeId,
    address bossBattleEvent
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool included;
    for (uint i; i < _eventKeys.length; ) {
      if (
        keccak256(abi.encodePacked(_eventKeys[i])) ==
        keccak256(abi.encodePacked(eventKey))
      ) {
        included = true;
        break;
      }
      unchecked {
        ++i;
      }
    }
    require(included, "BossBattle: eventKey not included");
    address oldValue = _bossBattleEventMap[eventKey][bbeId];
    _bossBattleEventMap[eventKey][bbeId] = bossBattleEvent;

    emit SetBossBattleEvent(
      _msgSender(),
      eventKey,
      bbeId,
      oldValue,
      bossBattleEvent
    );
  }

  /// @dev Set _erc20
  /// @param newValue _erc20
  function setErc20(address newValue) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IERC20 oldValue = _erc20;
    _erc20 = IERC20(newValue);

    emit SetErc20(_msgSender(), oldValue, _erc20);
  }

  /// @dev Set _bossMonsterWalletMap
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param newValue _bossMonsterWalletMap
  function setBossMonsterWallet(
    string memory eventKey,
    uint256 bbeId,
    address newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldValue = _bossMonsterWalletMap[eventKey][bbeId];
    _bossMonsterWalletMap[eventKey][bbeId] = newValue;

    emit SetBossMonsterWallet(
      _msgSender(),
      eventKey,
      bbeId,
      oldValue,
      newValue
    );
  }

  /// @dev Set _mintPrice
  /// @param newValue _mintPrice
  function setMintPrice(
    uint256 newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 oldValue = _mintPrice;
    _mintPrice = newValue;

    emit SetMintPrice(_msgSender(), oldValue, newValue);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Add event key
  /// @param eventKey event key
  function addEventKey(
    string memory eventKey
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    _eventKeys.push(eventKey);

    emit AddedEventKey(_msgSender(), _eventKeys.length, eventKey);
  }

  /// @dev Add bossBattleEvent
  /// @param eventKey event key
  /// @param bossBattleEvent address of bossBattleEvent
  function addBossBattleEvent(
    string memory eventKey,
    address bossBattleEvent
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool included;
    for (uint i; i < _eventKeys.length; ) {
      if (
        keccak256(abi.encodePacked(_eventKeys[i])) ==
        keccak256(abi.encodePacked(eventKey))
      ) {
        included = true;
        break;
      }
      unchecked {
        ++i;
      }
    }
    require(included, "BossBattle: eventKey not included");

    _bossBattleEventMap[eventKey].push(bossBattleEvent);

    emit AddedBossBattleEvent(_msgSender(), eventKey, bossBattleEvent);
  }

  /// @dev Add _bossMonsterWallet
  /// @param eventKey event key
  /// @param bossMonsterWallet _bossMonsterWallet
  function addBossMonsterWallet(
    string memory eventKey,
    address bossMonsterWallet
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    bool included;
    for (uint i; i < _eventKeys.length; ) {
      if (
        keccak256(abi.encodePacked(_eventKeys[i])) ==
        keccak256(abi.encodePacked(eventKey))
      ) {
        included = true;
        break;
      }
      unchecked {
        ++i;
      }
    }
    require(included, "BossBattle: eventKey not included");

    _bossMonsterWalletMap[eventKey].push(bossMonsterWallet);

    emit AddedBossBattleEvent(_msgSender(), eventKey, bossMonsterWallet);
  }

  /// @dev get boss battle data to calculate battle result
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @return monsterAdj monster adj
  function getMonsterAdj(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external view returns (IBossMonster.MonsterAdj memory monsterAdj) {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    monsterAdj = bossMonster.getMonsterAdj(resurrectionPrompt);
  }

  /// @dev Set monsterAdj
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  function setMonsterAdj(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    IBossMonster.MonsterAdj memory monsterAdj
  ) external onlyRole(GAME_ROLE) {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    bossMonster.setMonsterAdj(resurrectionPrompt, monsterAdj);
  }

  /// @dev get high scores
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompts resurrection prompts
  /// @return highScores high scores
  function getHighScores(
    string memory eventKey,
    uint256 bbeId,
    address[] memory resurrectionPrompts
  ) external view returns (uint32[] memory highScores) {
    highScores = IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId])
      .getHighScores(resurrectionPrompts);
  }

  /// @dev get boss battle state
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @return bbState boss battle state
  function getBBState(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) public view returns (IBossBattleEvent.BBState memory bbState) {
    bbState = IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId]).getBBState(
      resurrectionPrompt
    );
  }

  /// @dev get boss battle data to calculate battle result
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param language language
  /// @return monsterExtension monster extension
  function getBossExtension(
    string memory eventKey,
    uint256 bbeId,
    string memory language
  )
    external
    view
    returns (IPromptMonstersExtension.MonsterExtension memory monsterExtension)
  {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    monsterExtension = bossMonster.getBossExtension(language);
  }

  /// @dev Start boss battle of the event
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param monsterAdj monster adj
  /// @param bossSign boss sign
  function startBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    uint32 monsterAdj,
    uint32 bossSign
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId]).startBossBattle(
      resurrectionPrompt,
      monsterAdj,
      bossSign
    );
  }

  /// @dev updateBossBattleResult
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param bbState bbState to update
  function updateBossBattleResult(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    IBossBattleEvent.BBState memory bbState
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId])
      .updateBossBattleResult(resurrectionPrompt, bbState);
  }

  /// @dev Continue boss battle
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  /// @param bossSign boss sign
  function continueBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt,
    uint32 bossSign
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId]).continueBossBattle(
      resurrectionPrompt,
      bossSign
    );
  }

  /// @dev End boss battle
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param resurrectionPrompt resurrection prompt
  function endBossBattle(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId]).endBossBattle(
      resurrectionPrompt
    );
  }

  /// @dev changeMintable
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  function changeMintable(string memory eventKey, uint256 bbeId) external {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    _erc20.safeTransferFrom(
      msg.sender,
      _bossMonsterWalletMap[eventKey][bbeId],
      _mintPrice
    );
    bossMonster.changeMintable(msg.sender);
  }

  /// @dev mintBoss
  /// @param eventKey event key
  /// @param bbeId ID of bossBattleEvent
  /// @param to to
  /// @param monsterExtension monsterExtension
  /// @param imageURL imageURL
  function mintBoss(
    string memory eventKey,
    uint256 bbeId,
    address to,
    IPromptMonstersExtension.MonsterExtension memory monsterExtension,
    string memory imageURL
  ) external onlyRole(GAME_ROLE) {
    IBossMonster bossMonster = IBossBattleEvent(
      _bossBattleEventMap[eventKey][bbeId]
    ).getBossMonster();
    bossMonster.mintBoss(to, monsterExtension, imageURL);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

  // TODO: 後で消す(開発用) ------------
  /// @dev Delete BBState
  /// @param resurrectionPrompt resurrection prompt
  function deleteBBState(
    string memory eventKey,
    uint256 bbeId,
    address resurrectionPrompt
  ) external onlyRole(GAME_ROLE) {
    IBossBattleEvent(_bossBattleEventMap[eventKey][bbeId]).deleteBBState(
      resurrectionPrompt
    );
  }
}
