import React from 'react'
import Web3Modal from "web3modal"
import { nftmarketaddress } from './templates/config'
import NFT_MarketPlace from '../Components/templates/artifacts/contracts/mainNFT.sol/mainNFT.json'
import { Link } from 'react-router-dom';
import { ethers } from 'ethers'
import { Button } from 'react-bootstrap';
function CardItem(props) {
  function log(e){
    e.preventDefault();
    buyNft(props.nft)
  }
  console.log(props.nft);
  async function buyNft(nft) {
    
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    // console.log(price)
    // console.log(nfts)
    const transaction = await contract.createMarketSale(nft.tokenId, 1, { value: price })
    // console.log(transaction)
    //await transaction.wait()
    // loadNFTs()
  }
  return (
    <>
    <div className='cards__item' key={props.keey}>
      <div className='cards__item__link'  >
        {/* <Link to={'/detail'}> */}
        <figure className='cards__item__pic-wrap' data-category={`${props.label} ETH`}  >
          <img
            className='cards__item__img'
            alt='Travel Image'
            src={props.src}
            
          />
        </figure>
        <div className='cards__item__info'>
          <h5 className='cards__item__text'>{props.text}</h5>
         
          
        </div>
       <a className='pay' href='#' onClick={log}><div className='fat'></div> </a> 
       {/* </Link> */}
      </div>
    </div>
  </>
);
  
}

export default CardItem