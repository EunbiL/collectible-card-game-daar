// scripts/getContractAddresses.js
async function main() {
    const [deployer] = await ethers.getSigners();
    const Main = await ethers.getContract('Main'); // Replace 'Main' with your actual contract name
    const Collection = await ethers.getContract('Collection'); // Replace 'Collection' with your actual contract name
  
    console.log('Main Contract Address:', Main.address);
    console.log('Collection Contract Address:', Collection.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });