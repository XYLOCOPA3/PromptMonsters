// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

/// @title IPromptMonstersItem
/// @author keit (@keitEngineer)
/// @dev This is an interface of PromptMonstersItem.
interface IPromptMonstersItem is IERC721Upgradeable {
  // --------------------------------------------------------------------------------
  // Struct
  // --------------------------------------------------------------------------------

  struct Item {
    string name;
    string description;
    string imageURL;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetExternalLink(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  event SetNameURL(address indexed publisher, string oldValue, string newValue);

  event SetDescriptionURL(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  event SetImageURL(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  event CreatedItem(
    address indexed publisher,
    uint256 indexed newItemId,
    Item newItem
  );

  event MintedItem(
    address indexed publisher,
    address indexed to,
    uint256 indexed itemId,
    uint256 tokenId
  );

  event BurnedItem(address indexed publisher, uint256 indexed tokenId);

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get total token supply
  /// @return totalTokenSupply total token supply
  function getTotalTokenSupply()
    external
    view
    returns (uint256 totalTokenSupply);

  /// @dev Get item IDs length
  /// @return length item IDs length
  function getItemIdsLength() external view returns (uint256 length);

  /// @dev Get item IDs
  /// @return itemIds items
  function getItemIds() external view returns (uint256[] memory itemIds);

  /// @dev Get external link
  /// @return externalLink external link
  function getExternalLink() external view returns (string memory externalLink);

  /// @dev Get item
  /// @param itemId item ID
  /// @return item item
  function getItem(uint256 itemId) external view returns (Item memory item);

  /// @dev Get items
  /// @param itemIds item IDs
  /// @return items items
  function getItems(
    uint256[] memory itemIds
  ) external view returns (Item[] memory items);

  /// @dev Get item
  /// @param tokenId token ID
  /// @return item item
  function getItemFromTokenId(
    uint256 tokenId
  ) external view returns (Item memory item);

  /// @dev Get items
  /// @param tokenIds token IDs
  /// @return items items
  function getItemsFromTokenIds(
    uint256[] memory tokenIds
  ) external view returns (Item[] memory items);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Triggers stopped state
  function pause() external;

  /// @dev Returns to normal state
  function unpause() external;

  /// @dev Set name
  /// @param itemId item ID
  /// @param newValue new value
  function setName(uint256 itemId, string memory newValue) external;

  /// @dev Set description
  /// @param itemId item ID
  /// @param newValue new value
  function setDescriptionURL(uint256 itemId, string memory newValue) external;

  /// @dev Set image URL
  /// @param itemId item ID
  /// @param newValue new value
  function setImageURL(uint256 itemId, string memory newValue) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get contract URI
  /// @return cURI contract URI
  function contractURI() external view returns (string memory cURI);

  /// @dev Create item
  /// @param newItemId new item ID
  /// @param item item
  function createItem(uint256 newItemId, Item memory item) external;

  /// @dev Mint only GAME_ROLE
  /// @param to to address
  /// @param itemId item ID
  function mintOnlyGameRole(address to, uint256 itemId) external;

  /// @dev Burn only GAME_ROLE
  /// @param tokenId token ID
  function burnOnlyGameRole(uint256 tokenId) external;
}
