// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

/// @title IPromptMonsters
/// @author keit (@keitEngineer)
/// @notice This is an interface of PromptMonsters.
interface IPromptMonsters is IERC721Upgradeable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct Monster {
    string name;
    string flavor;
    string[] skills;
    uint32 lv;
    uint32 hp;
    uint32 atk;
    uint32 def;
    uint32 inte; // INT
    uint32 mgr;
    uint32 agl;
    uint16 maxSkills;
    uint16 maxSkillsSet;
  }

  // --------------------------------------------------------------------------------
  // Event
  // --------------------------------------------------------------------------------

  event SetExternalLink(
    address indexed publisher,
    string oldValue,
    string newValue
  );

  event SetMchCoin(
    address indexed publisher,
    address oldValue,
    address newValue
  );

  event SetMintPrice(
    address indexed publisher,
    uint256 oldValue,
    uint256 newValue
  );

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @notice Initialize
  /// @param externalLink_ external link
  /// @param mchCoinAddress MCH Coin address
  /// @param mintPrice_ MCH Coin address
  function initialize(
    string memory externalLink_,
    address mchCoinAddress,
    uint256 mintPrice_
  ) external;

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @notice Get monsters total supply
  /// @return totalSupply token IDs
  function getMonstersTotalSupply() external view returns (uint256 totalSupply);

  /// @notice Get monsters history
  /// @return monsterHistory monster history
  function getMonsterHistory()
    external
    view
    returns (IPromptMonsters.Monster memory monsterHistory);

  /// @notice Get token IDs from owner address
  /// @param owner owner
  /// @return tokenIds token IDs
  function getOwnerToTokenIds(
    address owner
  ) external view returns (uint256[] memory tokenIds);

  /// @notice Get monsters
  /// @param tokenIds_ token IDs
  /// @return monsters monsters
  function getMonsters(
    uint256[] memory tokenIds_
  ) external view returns (Monster[] memory monsters);

  /// @notice Get contract URI
  /// @return uri contract URI
  function contractURI() external view returns (string memory uri);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @notice Set external link
  /// @param newState_ new state
  function setExternalLink(string memory newState_) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @notice Generate monster
  /// @param user_ user address
  /// @param monster_ monster
  function generateMonster(address user_, Monster memory monster_) external;

  /// @notice Mint monster
  function mint() external;

  /// @notice Burn
  /// @param tokenId_ token ID
  function burn(uint256 tokenId_) external;
}
