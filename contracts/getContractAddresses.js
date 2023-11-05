// scripts/getContractAddresses.js
async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace 'Main' and 'Collection' with your actual contract names
  const mainContractName = 'Main';
  const collectionContractName = 'Collection';

  const mainContract = await ethers.getContract(mainContractName);
  const collectionContract = await ethers.getContract(collectionContractName);

  console.log('Main Contract Address:', mainContract.address);
  console.log('Collection Contract Address:', collectionContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
