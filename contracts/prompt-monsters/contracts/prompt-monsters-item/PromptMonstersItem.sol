// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC165Upgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {AccessControlEnumerableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Base64Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

import {IPromptMonstersItem} from "./IPromptMonstersItem.sol";

contract PromptMonstersItem is
  Initializable,
  IPromptMonstersItem,
  PausableUpgradeable,
  ERC721Upgradeable,
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

  /// @custom:oz-renamed-from _totalTokenSupply
  uint256 private _totalTokenSupply;

  // key -> owner
  /// @custom:oz-renamed-from _ownerToTokenIdsIndex
  mapping(address => mapping(uint256 => uint256))
    private _ownerToTokenIdsIndexMap;

  // key -> owner
  /// @custom:oz-renamed-from _ownerToTokenIds
  mapping(address => uint256[]) private _ownerToTokenIdsMap;

  /// @custom:oz-renamed-from _itemIds
  uint256[] private _itemIds;

  // key -> tokenId
  /// @custom:oz-renamed-from _itemIdMap
  mapping(uint256 => uint256) private _itemIdMap;

  // key -> itemId
  /// @custom:oz-renamed-from _nameMap
  mapping(uint256 => string) private _nameMap;

  // key -> itemId
  /// @custom:oz-renamed-from _descriptionMap
  mapping(uint256 => string) private _descriptionMap;

  // key -> itemId
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
    __ERC721_init("Prompt Monsters Item", "PITEM");
    __Pausable_init();
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
      ERC721Upgradeable,
      AccessControlEnumerableUpgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  /// @dev Only exist token Id
  modifier onlyExist(uint256 tokenId) {
    require(_exists(tokenId), "This token does not exist.");
    _;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get total token supply
  /// @return totalTokenSupply total token supply
  function getTotalTokenSupply()
    external
    view
    returns (uint256 totalTokenSupply)
  {
    totalTokenSupply = _totalTokenSupply;
  }

  /// @dev Get item IDs length
  /// @return length item IDs length
  function getItemIdsLength() external view returns (uint256 length) {
    length = _itemIds.length;
  }

  /// @dev Get item IDs
  /// @return itemIds items
  function getItemIds() external view returns (uint256[] memory itemIds) {
    itemIds = _itemIds;
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
  /// @param itemId item ID
  /// @return item item
  function getItem(
    uint256 itemId
  ) public view returns (IPromptMonstersItem.Item memory item) {
    item = IPromptMonstersItem.Item({
      name: _nameMap[itemId],
      description: _descriptionMap[itemId],
      imageURL: _imageURLMap[itemId]
    });
  }

  /// @dev Get items
  /// @param itemIds item IDs
  /// @return items items
  function getItems(
    uint256[] memory itemIds
  ) external view returns (IPromptMonstersItem.Item[] memory items) {
    uint256 length = itemIds.length;
    items = new IPromptMonstersItem.Item[](length);
    for (uint i; i < length; ) {
      items[i] = getItem(itemIds[i]);
      unchecked {
        ++i;
      }
    }
  }

  /// @dev Get item
  /// @param tokenId token ID
  /// @return item item
  function getItemFromTokenId(
    uint256 tokenId
  )
    public
    view
    onlyExist(tokenId)
    returns (IPromptMonstersItem.Item memory item)
  {
    uint256 itemId = _itemIdMap[tokenId];
    item = IPromptMonstersItem.Item({
      name: _nameMap[itemId],
      description: _descriptionMap[itemId],
      imageURL: _imageURLMap[itemId]
    });
  }

  /// @dev Get items
  /// @param tokenIds token IDs
  /// @return items items
  function getItemsFromTokenIds(
    uint256[] memory tokenIds
  ) external view returns (IPromptMonstersItem.Item[] memory items) {
    uint256 length = tokenIds.length;
    items = new IPromptMonstersItem.Item[](length);
    for (uint i; i < length; ) {
      items[i] = getItem(tokenIds[i]);
      unchecked {
        ++i;
      }
    }
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Triggers stopped state
  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  /// @dev Returns to normal state
  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

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
  /// @param itemId item ID
  /// @param newValue new value
  function setName(
    uint256 itemId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldValue = _nameMap[itemId];
    _nameMap[itemId] = newValue;
    emit SetNameURL(_msgSender(), oldValue, newValue);
  }

  /// @dev Set description
  /// @param itemId item ID
  /// @param newValue new value
  function setDescriptionURL(
    uint256 itemId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldValue = _descriptionMap[itemId];
    _descriptionMap[itemId] = newValue;
    emit SetDescriptionURL(_msgSender(), oldValue, newValue);
  }

  /// @dev Set image URL
  /// @param itemId item ID
  /// @param newValue new value
  function setImageURL(
    uint256 itemId,
    string memory newValue
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    string memory oldValue = _imageURLMap[itemId];
    _imageURLMap[itemId] = newValue;
    emit SetImageURL(_msgSender(), oldValue, newValue);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get token URI
  /// @param tokenId token ID
  /// @return uri token URI
  function tokenURI(
    uint256 tokenId
  ) public view override onlyExist(tokenId) returns (string memory uri) {
    uint256 itemId = _itemIdMap[tokenId];
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            _nameMap[itemId],
            '", "description": "',
            _descriptionMap[itemId],
            '", "image": "',
            _imageURLMap[itemId],
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

  /// @dev Get contract URI
  /// @return cURI contract URI
  function contractURI() external view returns (string memory cURI) {
    string memory name = name();
    string memory svg = string.concat(
      "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>",
      name,
      "</text></svg>"
    );
    string memory json = Base64Upgradeable.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            name,
            '", "description": "',
            name,
            ' is an item used within the Generative AI Game.", "image": "data:image/svg+xml;base64,',
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
  /// @param newItemId new item ID
  /// @param newItem new item
  function createItem(
    uint256 newItemId,
    IPromptMonstersItem.Item memory newItem
  ) external onlyRole(GAME_ROLE) {
    require(
      keccak256(abi.encodePacked(newItem.name)) !=
        keccak256(abi.encodePacked("")),
      "Invalid name"
    );
    require(
      keccak256(abi.encodePacked(newItem.description)) !=
        keccak256(abi.encodePacked("")),
      "Invalid description"
    );
    require(
      keccak256(abi.encodePacked(newItem.imageURL)) !=
        keccak256(abi.encodePacked("")),
      "Invalid imageURL"
    );
    require(
      keccak256(abi.encodePacked(_nameMap[newItemId])) ==
        keccak256(abi.encodePacked("")),
      "This item ID already exists"
    );
    require(newItemId != 0, "Invalid item ID");
    _itemIds.push(newItemId);
    _nameMap[newItemId] = newItem.name;
    _descriptionMap[newItemId] = newItem.description;
    _imageURLMap[newItemId] = newItem.imageURL;
    emit CreatedItem(_msgSender(), newItemId, newItem);
  }

  /// @dev Mint only GAME_ROLE
  /// @param to to address
  /// @param itemId item ID
  function mintOnlyGameRole(
    address to,
    uint256 itemId
  ) external onlyRole(GAME_ROLE) {
    require(
      keccak256(abi.encodePacked(_nameMap[itemId])) !=
        keccak256(abi.encodePacked("")),
      "This item does not exists"
    );
    require(itemId != 0, "Invalid item ID");
    _itemIdMap[_totalTokenSupply] = itemId;
    _safeMint(to, _totalTokenSupply);
    _totalTokenSupply++;
    emit MintedItem(_msgSender(), to, itemId, _totalTokenSupply);
  }

  /// @dev Burn only GAME_ROLE
  /// @param tokenId token ID
  function burnOnlyGameRole(uint256 tokenId) external onlyRole(GAME_ROLE) {
    delete _itemIdMap[tokenId];
    _burn(tokenId);
    emit BurnedItem(_msgSender(), tokenId);
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev Authorize upgrade
  /// @param newImplementation new implementation address
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyRole(GAME_ROLE) {}

  /// @dev Add owner to token IDs
  /// @param to_ recipient
  /// @param tokenId_ token ID
  function _addOwnerToTokenIds(address to_, uint256 tokenId_) private {
    _ownerToTokenIdsIndexMap[to_][tokenId_] = _ownerToTokenIdsMap[to_].length;
    _ownerToTokenIdsMap[to_].push(tokenId_);
  }

  /// @dev Remove owner to token IDs
  /// @param from_ sender
  /// @param tokenId_ token ID
  function _removeOwnerToTokenIds(address from_, uint256 tokenId_) private {
    uint256 lastTokenId = _ownerToTokenIdsMap[from_][
      _ownerToTokenIdsMap[from_].length - 1
    ];
    uint256 tokenIdIndex = _ownerToTokenIdsIndexMap[from_][tokenId_];
    if (tokenId_ != lastTokenId)
      _ownerToTokenIdsMap[from_][tokenIdIndex] = lastTokenId;
    _ownerToTokenIdsMap[from_].pop();
    delete _ownerToTokenIdsIndexMap[from_][tokenId_];
    if (tokenId_ != lastTokenId)
      _ownerToTokenIdsIndexMap[from_][lastTokenId] = tokenIdIndex;
  }

  /// @dev Before token transfer
  /// @param from sender
  /// @param to recipient
  /// @param tokenId token ID
  /// @param batchSize batch size
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId,
    uint256 batchSize
  ) internal override whenNotPaused {
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
}
