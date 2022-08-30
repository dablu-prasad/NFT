const hre = require("hardhat");
const fs = require('fs');
async function main() {
  const MainNFT = await hre.ethers.getContractFactory("mainNFT");
  const mainNFT = await MainNFT.deploy();
  await mainNFT.deployed();
  console.log("nftMarket deployed to:", mainNFT.address);


  let config = `export const nftmarketaddress = "${mainNFT.address}"`

let data = JSON.stringify(config)
fs.writeFileSync('./src/Components/templates/config.js', JSON.parse(data))
 }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
