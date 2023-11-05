// SPDX-License-Identifier: MIT
// solhint-disable-next-line
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";

contract Main is Ownable {
    address[] private collectionAddresses;
    uint256 private collectionCount;
    mapping(uint256 => string) private tokenURIs;
    mapping(uint256 => string) private collectionNames; // Add a mapping for collection names
    mapping(uint256 => uint256) private nftsInCollection;



    constructor() {
        collectionCount = 0;
    }

    function getCollectionCount() public view returns (uint256) {
        return collectionCount;
    }
    function getNFTCountInCollection(uint256 collectionIndex) public view returns (uint256) {
        require(collectionIndex < collectionCount, "Invalid collection index");
         return nftsInCollection[collectionIndex];
    }

    function createCollection(string calldata name, uint256 cardCount) external onlyOwner {
        address collectionAddress = address(new Collection(name, cardCount));
        collectionAddresses.push(collectionAddress); // Store the address in the collectionAddresses array
        collectionCount++;

    }
    
    function getCollectionAddress(uint256 index) public view returns (address) {
        require(index < collectionCount, "Invalid index");
        return collectionAddresses[index];
    }

    function getAllCollectionAddresses() public view returns (address[] memory) {
        return collectionAddresses;
    }
    event LogInfo(string message, uint256 value);

    function mintCardToUser(address user, uint256 collectionIndex, uint256 tokenId, uint256 cardNumber, string memory imgUri) external onlyOwner {
        require(collectionIndex < collectionCount, "Invalid index");

        // Log collectionIndex and collectionCount for debugging
        emit LogInfo("Collection Index:", collectionIndex);
        emit LogInfo("Collection Count:", collectionCount);

        address collectionAddress = collectionAddresses[collectionIndex];
        require(collectionAddress != address(0), "Collection does not exist");

        Collection collection = Collection(collectionAddress);
        collection.mintCard(user, tokenId, cardNumber, imgUri); // Pass the metadata URI
        tokenURIs[tokenId] = imgUri;
        nftsInCollection[collectionIndex]++;

    }
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURIs[tokenId];
    }

function getNFTInfo(uint256 collectionIndex, uint256 tokenId) public view returns (address owner, uint256 cardNumber, string memory imgUri) {
            address collectionAddress = collectionAddresses[collectionIndex];
            Collection collection = Collection(collectionAddress);
            Collection.NFTInfo memory nftInfo = collection.getCardInfo(tokenId);
            owner = nftInfo.owner;
            cardNumber = nftInfo.cardNumber;
            imgUri = nftInfo.imgUri;}

}
