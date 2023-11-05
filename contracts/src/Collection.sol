// SPDX-License-Identifier: MIT
// solhint-disable-next-line
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721URIStorage, Ownable {
    string public collectionName;
    uint256 public cardCount;

    // Mapping to store card numbers for each token ID
    mapping(uint256 => uint256) public cardNumber;

    constructor(string memory _name, uint256 _cardCount) ERC721(_name, "COLL") {
        collectionName = _name;
        cardCount = _cardCount;
    }
  
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
           return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits = digits - 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // Mint a card with a specified card number
    function mintCard(address to, uint256 tokenId, uint256 _cardNumber, string memory imgUri) public onlyOwner {
        _mint(to, tokenId);
        _setTokenURI(tokenId, imgUri);
        string memory metadataUri = string(abi.encodePacked(imgUri));
        _setTokenURI(tokenId, metadataUri);
        cardNumber[tokenId] = _cardNumber;

    }
    
    struct NFTInfo {
    address owner;
    uint256 cardNumber;
    string imgUri;
    }


    function getCardInfo(uint256 tokenId) public view returns (NFTInfo memory) {
    require(_exists(tokenId), "Token does not exist");
    return NFTInfo({
        owner: ownerOf(tokenId),
        cardNumber: cardNumber[tokenId],
        imgUri: tokenURI(tokenId)

    });

    
}


  
}
