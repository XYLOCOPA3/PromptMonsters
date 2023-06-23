// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IPromptMonsters} from "../prompt-monsters/IPromptMonsters.sol";
import {IERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/IERC1155Upgradeable.sol";

/// @title IPromptMonstersItem
/// @author keit (@keitEngineer)
/// @dev This is an interface of PromptMonstersItem.
interface IPromptMonstersItem is IERC1155Upgradeable {
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
    uint256 indexed tokenId,
    Item item
  );

  event MintedItem(
    address indexed publisher,
    uint256 indexed tokenId,
    address indexed to,
    uint256 amount
  );

  event BurnedItem(
    address indexed publisher,
    uint256 indexed tokenId,
    address indexed to,
    uint256 amount
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev Initialize
  function initialize() external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev Get item length
  /// @return length item length
  function getItemLength() external view returns (uint256 length);

  /// @dev Get external link
  /// @return externalLink external link
  function getExternalLink() external view returns (string memory externalLink);

  /// @dev Get item
  /// @param tokenId token ID
  /// @return item item
  function getItem(uint256 tokenId) external view returns (Item memory item);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev Set name
  /// @param tokenId token ID
  /// @param newValue new value
  function setName(uint256 tokenId, string memory newValue) external;

  /// @dev Set description
  /// @param tokenId token ID
  /// @param newValue new value
  function setDescriptionURL(uint256 tokenId, string memory newValue) external;

  /// @dev Set image URL
  /// @param tokenId token ID
  /// @param newValue new value
  function setImageURL(uint256 tokenId, string memory newValue) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev Get contract URI
  /// @return cURI contract URI
  function contractURI() external view returns (string memory cURI);

  /// @dev Create item
  /// @param item item
  function createItem(Item memory item) external;

  /// @dev Mint only GAME_ROLE
  /// @param tokenId token ID
  /// @param to to address
  function mintOnlyGameRole(
    uint256 tokenId,
    address to,
    uint256 amount
  ) external;

  /// @dev Burn only GAME_ROLE
  /// @param tokenId token ID
  /// @param to to address
  function burnOnlyGameRole(
    uint256 tokenId,
    address to,
    uint256 amount
  ) external;
}
