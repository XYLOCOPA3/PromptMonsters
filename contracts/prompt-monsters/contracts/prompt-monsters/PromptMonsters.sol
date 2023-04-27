// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {StringsUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {Base64Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IPromptMonsters} from "./IPromptMonsters.sol";

/// @title PromptMonsters
/// @author keit (@keitEngineer)
/// @notice This is a contract of PromptMonsters.
contract PromptMonsters is
  Initializable,
  IPromptMonsters,
  ERC721Upgradeable,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable,
  ReentrancyGuardUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------
  using SafeERC20 for IERC20;
  IERC20 public mchCoin;

  uint256 public mintPrice;
  string private _externalLink;

  mapping(address => mapping(uint256 => uint256)) private _ownerToTokenIdsIndex;

  mapping(address => IPromptMonsters.Monster) private _monsterHistory;

  mapping(address => uint256[]) private _ownerToTokenIds;

  IPromptMonsters.Monster[] private _monsters;

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Constructor
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @notice Initialize
  /// @param externalLink_ external link
  /// @param mchCoinAddress MCH Coin address
  /// @param mintPrice_ MCH Coin address
  function initialize(
    string memory externalLink_,
    address mchCoinAddress,
    uint256 mintPrice_
  ) public initializer {
    __ERC721_init("Prompt Monsters", "MON");
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();
    __ReentrancyGuard_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _externalLink = externalLink_;
    mchCoin = IERC20(mchCoinAddress);
    mintPrice = mintPrice_;
  }

  /// @notice Supports interface
  /// @param interfaceId interface ID
  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(
      IERC165Upgradeable,
      ERC721Upgradeable,
      AccessControlEnumerableUpgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get monsters total supply
  /// @return totalSupply token IDs
  function getMonstersTotalSupply()
    external
    view
    returns (uint256 totalSupply)
  {
    totalSupply = _monsters.length;
  }

  /// @notice Get monsters history
  /// @return monsterHistory monster history
  function getMonsterHistory()
    external
    view
    returns (IPromptMonsters.Monster memory monsterHistory)
  {
    monsterHistory = _monsterHistory[msg.sender];
  }

  /// @notice Get token IDs from owner address
  /// @param owner owner
  /// @return tokenIds token IDs
  function getOwnerToTokenIds(
    address owner
  ) external view returns (uint256[] memory tokenIds) {
    tokenIds = _ownerToTokenIds[owner];
  }

  /// @notice Get monsters
  /// @param tokenIds_ token IDs
  /// @return monsters monsters
  function getMonsters(
    uint256[] memory tokenIds_
  ) external view returns (IPromptMonsters.Monster[] memory monsters) {
    uint256 tokenIdsLength = tokenIds_.length;
    require(
      tokenIdsLength <= _monsters.length,
      "PromptMonsters: tokenIdsLength is too large"
    );
    monsters = new IPromptMonsters.Monster[](tokenIdsLength);
    for (uint i; i < tokenIdsLength; ) {
      monsters[i] = _monsters[tokenIds_[i]];
      unchecked {
        ++i;
      }
    }
  }

  /// @notice Get token URI
  /// @param tokenId_ token ID
  /// @return uri token URI
  function tokenURI(
    uint256 tokenId_
  ) public view override returns (string memory uri) {
    _requireMinted(tokenId_);
    string memory svg = _getSvg(tokenId_);
    IPromptMonsters.Monster memory monster = _monsters[tokenId_];
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            monster.name,
            '", "description": "',
            monster.flavor,
            '", "image": "data:image/svg+xml;base64,',
            Base64Upgradeable.encode(bytes(svg)),
            '"}'
          )
        )
      )
    );
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    uri = finalTokenUri;
  }

  /// @notice Get contract URI
  /// @return uri contract URI
  function contractURI() external view returns (string memory uri) {
    string memory name_ = name();
    string memory svg = string.concat(
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
      name_,
      "</text></svg>"
    );
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            name_,
            '", "description": "',
            name_,
            ' is Generative AI Game.", "image": "data:image/svg+xml;base64,',
            Base64Upgradeable.encode(bytes(svg)),
            '", "external_link": "',
            _externalLink,
            '"}'
          )
        )
      )
    );
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );
    uri = finalTokenUri;
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Set external link
  /// @param newState_ new state
  function setExternalLink(
    string memory newState_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldState = _externalLink;
    _externalLink = newState_;
    emit SetExternalLink(_msgSender(), oldState, newState_);
  }

  /// @notice Set MCH Coin address
  /// @param newState_ new state
  function setMchCoin(address newState_) external onlyRole(DEFAULT_ADMIN_ROLE) {
    address oldState = address(mchCoin);
    mchCoin = IERC20(newState_);
    emit SetMchCoin(_msgSender(), oldState, newState_);
  }

  /// @notice Set mint price
  /// @param newState_ new state
  function setMintPrice(
    uint256 newState_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 oldState = mintPrice;
    mintPrice = newState_;
    emit SetMintPrice(_msgSender(), oldState, newState_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Generate monster
  /// @param user_ user address
  /// @param monster_ monster
  function generateMonster(
    address user_,
    IPromptMonsters.Monster memory monster_
  ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
    _monsterHistory[user_] = monster_;
  }

  /// @notice Mint monster
  function mint() external {
    require(
      mchCoin.balanceOf(msg.sender) >= mintPrice,
      "PromptMonsters: insufficient MCH Coin balance"
    );
    IPromptMonsters.Monster memory monster = _monsterHistory[msg.sender];
    require(monster.lv > 0, "PromptMonsters: monster is not generated");
    uint256 newTokenId = _monsters.length;
    _monsters.push(monster);
    mchCoin.safeTransferFrom(msg.sender, address(this), mintPrice);
    _safeMint(msg.sender, newTokenId);
  }

  /// @notice Burn
  ///         This function is not a standard burn function.
  ///         Your NFT will be transferred to the owner of this contract if you call this function.
  /// @param tokenId_ token ID
  function burn(uint256 tokenId_) external nonReentrant {
    safeTransferFrom(
      _msgSender(),
      getRoleMember(DEFAULT_ADMIN_ROLE, 0),
      tokenId_
    );
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @notice Get SVG
  /// @param tokenId_ token ID
  /// @return svg SVG
  function _getSvg(uint256 tokenId_) internal view returns (string memory svg) {
    IPromptMonsters.Monster memory monster = _monsters[tokenId_];
    svg = string.concat(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" />',
      _getSvgText(10, 20, monster.name),
      _getSvgText(
        10,
        60,
        string.concat("LV: ", StringsUpgradeable.toString(monster.lv))
      ),
      _getSvgText(
        10,
        100,
        string.concat("HP: ", StringsUpgradeable.toString(monster.hp))
      ),
      _getSvgText(
        10,
        120,
        string.concat("ATK: ", StringsUpgradeable.toString(monster.atk))
      ),
      _getSvgText(
        10,
        140,
        string.concat("DEF: ", StringsUpgradeable.toString(monster.def))
      ),
      _getSvgText(
        10,
        160,
        string.concat("INT: ", StringsUpgradeable.toString(monster.inte))
      ),
      _getSvgText(
        10,
        180,
        string.concat("MGR: ", StringsUpgradeable.toString(monster.mgr))
      ),
      _getSvgText(
        10,
        200,
        string.concat("AGL: ", StringsUpgradeable.toString(monster.agl))
      )
    );

    uint256 y = 240;
    for (uint i; i < monster.skills.length; i++) {
      if (i + 1 > monster.maxSkillsSet) break;
      svg = string.concat(
        svg,
        _getSvgText(
          10,
          y + 20 * i,
          string.concat(
            "Skill",
            StringsUpgradeable.toString(i + 1),
            ": ",
            monster.skills[i]
          )
        )
      );
    }
    svg = string.concat(svg, "</svg>");
  }

  /// @notice Get SVG text
  /// @param x_ x position
  /// @param y_ y position
  /// @param text_ text
  /// @return svg SVG
  function _getSvgText(
    uint256 x_,
    uint256 y_,
    string memory text_
  ) internal pure returns (string memory svg) {
    svg = string.concat(
      '<text x="',
      StringsUpgradeable.toString(x_),
      '" y="',
      StringsUpgradeable.toString(y_),
      '" class="base">',
      text_,
      "</text>"
    );
  }

  /// @notice Add owner to token IDs
  /// @param to_ recipient
  /// @param tokenId_ token ID
  function _addOwnerToTokenIds(address to_, uint256 tokenId_) private {
    _ownerToTokenIdsIndex[to_][tokenId_] = _ownerToTokenIds[to_].length;
    _ownerToTokenIds[to_].push(tokenId_);
  }

  /// @notice Remove owner to token IDs
  /// @param from_ sender
  /// @param tokenId_ token ID
  function _removeOwnerToTokenIds(address from_, uint256 tokenId_) private {
    uint256 lastTokenId = _ownerToTokenIds[from_][
      _ownerToTokenIds[from_].length - 1
    ];
    if (tokenId_ != lastTokenId) {
      uint256 tokenIdIndex = _ownerToTokenIdsIndex[from_][tokenId_];
      _ownerToTokenIds[from_][tokenIdIndex] = lastTokenId;
    }
    _ownerToTokenIds[from_].pop();
    delete _ownerToTokenIdsIndex[from_][tokenId_];
  }

  /// @notice Before token transfer
  /// @param from sender
  /// @param to recipient
  /// @param tokenId token ID
  /// @param batchSize batch size
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override {
    if (from == address(0)) {
      _addOwnerToTokenIds(to, tokenId);
    } else if (to == address(0)) {
      _removeOwnerToTokenIds(from, tokenId);
    } else {
      _removeOwnerToTokenIds(from, tokenId);
      _addOwnerToTokenIds(to, tokenId);
    }

    super._beforeTokenTransfer(from, to, tokenId, batchSize);
  }

  /// @notice Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
