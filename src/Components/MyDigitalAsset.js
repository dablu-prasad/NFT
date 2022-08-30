import { ethers } from 'ethers'
import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
// import Home from '../components/templates/Home'
 
import {nftmarketaddress} from './templates/config'
import NFT_MarketPlace from '../Components/templates/artifacts/contracts/mainNFT.sol/mainNFT.json'
import Cards from './Cards'

function MyDigitalAsset() {
    
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const [account]= await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const marketContract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, signer)
   
    const data = await marketContract.fetchMyNFTs()
    console.log(data)
    console.log("Hello My_Digital_Asset")
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await marketContract.uri(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.request.responseURL,
        description:i.description
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
    console.log(nfts)
  }
 if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    
      
    
      
          
            
         
              
            <Cards nfti={nfts} heading="Your Creations" filtered="false"/>
              
              // {/* <div key={i} className="border shadow rounded-xl overflow-hidden" >
              //   <img src={nft.image}   width="400px" height="250px" />
              //   <div className="p-4 bg-black">
              //     <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
              //   </div>
              // </div> */}
            
            
          
     
  )
 }

 export default MyDigitalAsset