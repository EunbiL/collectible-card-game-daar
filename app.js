const React = require('react');
const { useState, useEffect } = require('react');
import Web3 from 'web3';
import { ethers, JsonRpcProvider } from 'ethers';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [userNFTs, setUserNFTs] = useState([]);

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);

          // Fetch user's NFTs and associated metadata here
          const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
          const mainContractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
          const mainContractABI = require('./contracts/deployments/localhost/Main.json').abi;
          const mainContract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

          // Replace the collectionIndex with the desired index
          const collectionIndex = 1;

          // Get the user's NFTs from the contract
          const userNFTs = await getUserNFTs(mainContract, collectionIndex, accounts[0]);
          setUserNFTs(userNFTs);
        }
      }
    }

    connectWallet();
  }, []);

  // Function to get user's NFTs from the contract
  async function getUserNFTs(mainContract, collectionIndex, userAddress) {
    const userNFTs = [];
    const collectionAddress = await mainContract.getCollectionAddress(collectionIndex);
    const collectionContract = new ethers.Contract(collectionAddress, mainContractABI, provider);

    // Query the collection contract for the user's NFTs
    const userNFTCount = await collectionContract.balanceOf(userAddress);
    for (let i = 0; i < userNFTCount.toNumber(); i++) {
      const tokenId = await collectionContract.tokenOfOwnerByIndex(userAddress, i);
      const nftInfo = await mainContract.getNFTInfo(collectionIndex, tokenId);
      userNFTs.push({
        tokenId: tokenId,
        owner: nftInfo[0],
        cardNumber: nftInfo[1],
        imgUri: nftInfo[2],
      });
    }
    return userNFTs;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Your NFTs</h1>
        <p>Connected Address: {userAddress}</p>
        <div>
          {userNFTs.map((nft, index) => (
            <div key={index} className="nft-card">
              <img src={nft.imgUri} alt={`NFT ${nft.tokenId}`} />
              <p>Owner: {nft.owner}</p>
              <p>Card Number: {nft.cardNumber}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
