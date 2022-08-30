/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
//import '../../App.css'
import { nftmarketaddress } from './config'
import NFT_MarketPlace from './artifacts/contracts/mainNFT.sol/mainNFT.json'
import Button from 'react-bootstrap/Button';

import Cards from '../../Components/Cards'
//import Categories from './pages/Categories'

let nfti;

function g(x){
  nfti=x;
}

function Index_Home() {
   const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
     const provider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/Vq79h53VqNJaIcZ65rXJJ05vh9FCeVU0")
   // const provider = new ethers.providers.JsonRpcProvider()

    //await window.ethereum.request({ method: 'eth_requestAccounts' })
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    //const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, provider)
    // console.log(tokenContract)
    const data = await tokenContract.getNFTs()
    console.log(data)
    // let meta ;
    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      
      const tokenUri = await tokenContract.tokenURI(i.tokenId.toNumber())
      console.log(tokenUri)
      console.log(i.tokenPrice)
      const meta = await axios.get(tokenUri)
      console.log(meta.request.responseURL)
    let price = ethers.utils.formatUnits(i.tokenPrice.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.minter,
        owner: i.owner,
        image: meta.request.responseURL,
        name: i.name,
        description: i.description,
        categories:i.category
        //     amount:meta.data.amount
      }
      return item
    }))
    setNfts(items)
   
    setLoadingState('loaded')
  }


 
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nft.tokenId, 1, { value: price })
    loadNFTs()
  }
  g(nfts);
  console.log(nfti);
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
   


      <>
       <Cards nfti={nfts} heading="Check out these EPIC NFTs!" />
        
      </>     
  )
}
export {nfti};
export default Index_Home;