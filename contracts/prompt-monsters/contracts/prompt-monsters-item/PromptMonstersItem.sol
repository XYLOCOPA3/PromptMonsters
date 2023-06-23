// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Base64Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";

import {IPromptMonstersItem} from "./IPromptMonstersItem.sol";

/// @title PromptMonstersItem
/// @author keit (@keitEngineer)
/// @dev This is a contract of PromptMonstersItem.
contract PromptMonstersItem is
  Initializable,
  IPromptMonstersItem,
  ERC1155Upgradeable,
  ERC1155SupplyUpgradeable,
  AccessControlEnumerableUpgradeable,
  UUPSUpgradeable
{
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  /// @custom:oz-renamed-from GAME_ROLE
  bytes32 public constant GAME_ROLE = keccak256("GAME_ROLE");

  /// @custom:oz-renamed-from _externalLink
  string private _externalLink;

  /// @custom:oz-renamed-from _itemIds
  uint256[] private _itemIds;

  /// @custom:oz-renamed-from _nameMap
  mapping(uint256 => string) private _nameMap;

  /// @custom:oz-renamed-from _descriptionMap
  mapping(uint256 => string) private _descriptionMap;

  /// @custom:oz-renamed-from _imageURLMap
  mapping(uint256 => string) private _imageURLMap;

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
    __ERC1155_init("");
    __ERC1155Supply_init();
    __AccessControlEnumerable_init();
    __UUPSUpgradeable_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(GAME_ROLE, msg.sender);
  }

  /// @dev Supports interface
  /// @param interfaceId interface ID
  function supportsInterface(
    bytes4 interfaceId
  )
    public
    view
    override(
      IERC165Upgradeable,
      ERC1155Upgradeable,
      AccessControlEnumerableUpgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get item length
  /// @return length item length
  function getItemLength() external view returns (uint256 length) {
    length = _itemIds.length;
  }

  /// @dev Get external link
  /// @return externalLink external link
  function getExternalLink()
    external
    view
    returns (string memory externalLink)
  {
    externalLink = _externalLink;
  }

  /// @dev Get item
  /// @param tokenId token ID
  /// @return item item
  function getItem(
    uint256 tokenId
  ) external view returns (IPromptMonstersItem.Item memory item) {
    require(
      keccak256(abi.encodePacked(_nameMap[tokenId])) !=
        keccak256(abi.encodePacked("")),
      "getItem: Invalid token ID"
    );
    item = IPromptMonstersItem.Item({
      name: _nameMap[tokenId],
      description: _descriptionMap[tokenId],
      imageURL: _imageURLMap[tokenId]
    });
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set external link
  /// @param newValue new value
  function setExternalLink(
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldValue = _externalLink;
    _externalLink = newValue;
    emit SetExternalLink(_msgSender(), oldValue, newValue);
  }

  /// @dev Set name
  /// @param tokenId token ID
  /// @param newValue new value
  function setName(
    uint256 tokenId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(tokenId < _itemIds.length, "setName: Invalid token ID");
    string memory oldValue = _nameMap[tokenId];
    _nameMap[tokenId] = newValue;
    emit SetNameURL(_msgSender(), oldValue, newValue);
  }

  /// @dev Set description
  /// @param tokenId token ID
  /// @param newValue new value
  function setDescriptionURL(
    uint256 tokenId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(tokenId < _itemIds.length, "setDescriptionURL: Invalid token ID");
    string memory oldValue = _descriptionMap[tokenId];
    _descriptionMap[tokenId] = newValue;
    emit SetDescriptionURL(_msgSender(), oldValue, newValue);
  }

  /// @dev Set image URL
  /// @param tokenId token ID
  /// @param newValue new value
  function setImageURL(
    uint256 tokenId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(tokenId < _itemIds.length, "setImageURL: Invalid token ID");
    string memory oldValue = _imageURLMap[tokenId];
    _imageURLMap[tokenId] = newValue;
    emit SetImageURL(_msgSender(), oldValue, newValue);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get token URI
  /// @param tokenId token ID
  /// @return tokenURI token URI
  function uri(
    uint256 tokenId
  ) public view override returns (string memory tokenURI) {
    require(exists(tokenId), "uri: Invalid token ID");
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            _nameMap[tokenId],
            '", "description": "',
            _descriptionMap[tokenId],
            '", "image": "',
            _imageURLMap[tokenId],
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
    tokenURI = finalTokenUri;
  }

  /// @dev Get contract URI
  /// @return cURI contract URI
  function contractURI() external view returns (string memory cURI) {
    string memory svg = string.concat(
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 512 512'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>Prompt Monsters Item</text></svg>"
    );
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "Prompt Monsters Item", "description": "Prompt Monsters Item is an item used within the Generative AI Game.", "image": "data:image/svg+xml;base64,',
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
    cURI = finalTokenUri;
  }

  /// @dev Create item
  /// @param item item
  function createItem(
    IPromptMonstersItem.Item memory item
  ) external onlyRole(GAME_ROLE) {
    require(
      keccak256(abi.encodePacked(item.name)) != keccak256(abi.encodePacked("")),
      "Invalid name"
    );
    require(
      keccak256(abi.encodePacked(item.description)) !=
        keccak256(abi.encodePacked("")),
      "Invalid description"
    );
    require(
      keccak256(abi.encodePacked(item.imageURL)) !=
        keccak256(abi.encodePacked("")),
      "Invalid imageURL"
    );
    uint256 newTokenId = _itemIds.length;
    _itemIds.push(newTokenId);
    _nameMap[newTokenId] = item.name;
    _descriptionMap[newTokenId] = item.description;
    _imageURLMap[newTokenId] = item.imageURL;
    emit CreatedItem(_msgSender(), newTokenId, item);
  }

  /// @dev Mint only GAME_ROLE
  /// @param tokenId token ID
  /// @param to to address
  function mintOnlyGameRole(
    uint256 tokenId,
    address to,
    uint256 amount
  ) external onlyRole(GAME_ROLE) {
    require(tokenId < _itemIds.length, "setImageURL: Invalid token ID");
    _mint(to, tokenId, amount, "0x00");
    emit MintedItem(_msgSender(), tokenId, to, amount);
  }

  /// @dev Burn only GAME_ROLE
  /// @param tokenId token ID
  /// @param to to address
  function burnOnlyGameRole(
    uint256 tokenId,
    address to,
    uint256 amount
  ) external onlyRole(GAME_ROLE) {
    _burn(to, tokenId, amount);
    emit BurnedItem(_msgSender(), tokenId, to, amount);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

  /// @dev Before token transfer hook
  /// @param operator operator address
  /// @param from from address
  /// @param to to address
  /// @param ids token IDs
  /// @param amounts token amount
  /// @param data data
  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }
}
