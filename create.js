const express = require('express');
const { ethers, JsonRpcProvider } = require('ethers');

const app = express();
const port = 3000;

const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
const mainContractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; 
const mainContractABI = require('./contracts/deployments/localhost/Main.json').abi;

const mainContract = new ethers.Contract(mainContractAddress, mainContractABI, provider);

app.get('/createCollection', async (req, res) => {
  try {
    const collectionName = 'MyCollection1'; 
    const wallet = new ethers.Wallet('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider); 
    const mainContractWithSigner = mainContract.connect(wallet);
    
    const collectionCount = await mainContract.getCollectionCount();

    const tx = await mainContractWithSigner.createCollection(collectionName, 10); 

    await tx.wait();

    const updatedCollectionCount = await mainContract.getCollectionCount();

    const responseText = `Collection Count Before: ${collectionCount}, Collection Count After: ${updatedCollectionCount}, Collection "${collectionName}" created!`;

    res.send(responseText);
  } catch (error) {
    res.status(500).send('Error creating collection: ' + error.message);
  }
});


app.get('/mintCard', async (req, res) => {
  const userAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; 
  const collectionIndex = 1; 
  const tokenId = 3; 
  const cardNumber = 3; 
  const imgUri = 'https://img.freepik.com/vecteurs-libre/illustration-singe-style-nft-dessine-main_23-2149622046.jpg?t=st=1699122163~exp=1699122763~hmac=0e7ea8e717f53941975373bb00e6fcf2d5e6b436dcf2261d131a50680b8561ec'; 

  const wallet = new ethers.Wallet('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider); 
  const mainContractWithSigner = mainContract.connect(wallet);

  try {
      const tx = await mainContractWithSigner.mintCardToUser(userAddress, collectionIndex, tokenId, cardNumber, imgUri);

      await tx.wait();
      res.send('Card minted successfully!');
  } catch (error) {
      res.status(500).send('Error minting card: ' + error.message);
  }
});


app.get('/getCollectionAddress', async (req, res) => {
  try {
    const collectionIndex = 1;

    const collectionAddress = await mainContract.getCollectionAddress(collectionIndex);
    res.send(`Collection Address at Index ${collectionIndex}: ${collectionAddress}`);
  } catch (error) {
    res.status(500).send('Error getting collection address: ' + error.message);
  }
});

app.get('/getNFTInfo', async (req, res) => {
  const collectionIndex = 1;
  const tokenIdArray = [3]; 

  try {
    const nftInfos = await Promise.all(
      tokenIdArray.map(async (tokenId) => {
        const nftInfo = await mainContract.getNFTInfo(collectionIndex, tokenId);
        return {
          tokenId,
          owner: nftInfo[0],
          cardNumber: nftInfo[1],
          imgUri: nftInfo[2],
        };
      })
    );

    // Get the user's address (assuming it's the same for all NFTs)
    const userAddress = nftInfos.length > 0 ? nftInfos[0].owner : '';

    const htmlTemplate = `
      <html>
        <head>
          <title>NFT Information</title>
          <style>
            .card {
              border: 1px solid #ccc;
              padding: 10px;
              margin: 10px;
              display: inline-block;
            }
            .image {
              max-width: 100px;
            }
          </style>
        </head>
        <body>
          <h1>NFT Information of user => ${userAddress}</h1>
          <div>
            ${nftInfos
              .map(
                (nft) => `
                  <div class="card">
                    <img src="${nft.imgUri}" alt="NFT Image" class="image" />
                    <p>Card Number: ${nft.cardNumber}</p>
                  </div>
                `
              )
              .join('')}
          </div>
        </body>
      </html>
    `;

    res.send(htmlTemplate);
  } catch (error) {
    res.status(500).send('Error getting NFT info: ' + error.message);
  }
});

app.get('/getUsersInCollection', async (req, res) => {
  try {
    const collectionIndex = parseInt(1); // You can pass the collection index as a query parameter

    // Get the total number of NFTs in the collection
    const totalNFTs = await mainContract.getNFTCountInCollection(collectionIndex);

    // Initialize an empty set to store user addresses
    const userAddresses = new Set();

    // Loop through each NFT in the collection to find unique user addresses
    for (let tokenId = 1; tokenId <= totalNFTs; tokenId++) {
      const nftInfo = await mainContract.getNFTInfo(collectionIndex, tokenId);
      const owner = nftInfo[0];
      userAddresses.add(owner);
    }

    // Convert the set to an array for the response
    const userList = Array.from(userAddresses);

    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Error getting users in the collection: ' + error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
