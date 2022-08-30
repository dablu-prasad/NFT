import React, { useEffect} from 'react'
import NFT_MarketPlace from '../Components/templates/artifacts/contracts/mainNFT.sol/mainNFT.json'
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ethers } from "ethers";
import { nftmarketaddress} from './templates/config'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import "./Forms.css"
import "./Cards.css"
import Created_Nfts from './templates/Created_Nfts';
import Sold_Nfts from './templates/Sold_Nfts';
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";

const API_TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENkZTI1YzM5YjFDNjA0NmVmM2Q5M0E5MjIwNTc3QjI2NDIzRkIzNTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTI0NDI4NTkzMywibmFtZSI6Ik5GVF9NYXJrZXRwbGFjZSJ9.Sb13Jn-AM8tMxhgnF8QqO19PazwMETXK8uXFAGJJ6Wc'

 function Forms() {
 
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '',categories:'',file1:'' })
  const [formErrors,setFormError]= useState({});
   const [iscreated,setiscreated]= useState(true);
  const [disable , setdisable]= useState(false)

  const validate =(val)=>{
      const errors = {};
      const regex= /^.{100,200}$/;
      if(!val.file1){
        errors.file1 = "Upload file"
        
      }
      if(!val.price){
        errors.price = "Give the price"
        
      }
      if(!val.description){
        errors.description = "Give the description"
       
      }else if(!regex.test(val.description)){
        errors.description='minimum 100 character'
      
      }
      if(!val.name){
        errors.name = "Give the name"
       
      }
      if(!val.categories){
        errors.categories = "category is not selected"
      
      }
      return errors;
  };
  
  

  useEffect(()=>{
    setFormError(validate(formInput));
    console.log(formErrors);
    if(Object.keys(formErrors).length===0 && iscreated){
      
    }
  },[formInput]);
 
 
  
  async function createMarket(e) {
    e.preventDefault();
    const file = document.querySelector('input[type="file"]');

    const { name, description, price ,categories} = formInput
    if (!name || !description || !price || !file || !categories)  return
    
    const storage = new NFTStorage({ token: API_TOKEN });
    try {
      const metadata = await storage.store({
        name: name,
        description: description,
        price:price,
        categories:categories,
        image: file.files[0],
      })
      console.log(metadata);
      const imgUrl = metadata.embed().image.href;
      const name1= metadata.data.name;
      const description1= metadata.data.description;
       const categories1=metadata.data.categories;
       const price1=metadata.data.price;
      createSale(imgUrl,name1,description1,categories1)

    } catch (error) {
      console.log('Error uploading file: ', error)
    }
   
   // clearText();
  }


  async function createSale(url,name1,description1,categories1) {
    const [account]=await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.providers.Web3Provider(window.ethereum);   
  const signer = provider.getSigner()
   const price = ethers.utils.parseUnits(formInput.price, 'ether')

   /* next, create the item */
   let contract = new ethers.Contract(nftmarketaddress, NFT_MarketPlace.abi, signer)
  // let messageHash = ethers.utils.solidityKeccak256(['string'], [message]);
      const message = `Welcome to NFT Market ! \nClick to sign in and accept the NFT Market Place  Terms of Service:http://localhost:3000\n\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet\taddress : ${account}`
      ;
   let messageHash = ethers.utils.solidityKeccak256(['string'], [message]);
    console.log(messageHash);
  const x = await signer.signMessage(ethers.utils.arrayify(messageHash))
      console.log(x);
 
   const y = await ethers.utils.splitSignature(x);
    console.log(price.toString());
   let transaction = await contract.mintNFT(account,name1,description1,price.toString(),url) 
   
   
   console.log(transaction);

}

  return (
    <>
      <div className='main-form-container'>


        <div className='form container2'>
          <Form >
            <h1>Create NewItem</h1><br />
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Choose File</Form.Label>
              <Form.Label></Form.Label>
              <Form.Control type="file" placeholder="Drop File"  required></Form.Control>

            </Form.Group>
            <p>{formErrors.file1}</p>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Name</Form.Label>
              <Form.Control  required type="Text" placeholder="give Name to your NFT" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />
            </Form.Group>
            <p>{formErrors.name}</p>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control required as="textarea" placeholder="Description" onChange={e => updateFormInput({ ...formInput, description: e.target.value })} />
              <Form.Text className="text-muted">The description will be included on the item's detail page underneath its image. Markdown syntax is supported. Atleast 50 words</Form.Text>
            </Form.Group>
            <p>{formErrors.description}</p>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Price</Form.Label>
              <Form.Control required type="number" placeholder="give Name to your NFT" onChange={e => updateFormInput({ ...formInput, price: e.target.value })} />
            </Form.Group>
            <p>{formErrors.price}</p>
            <Form.Label>Select category</Form.Label>
            <Form.Select aria-label="Default select example" onChange={e => updateFormInput({ ...formInput, categories: e.target.value })} required>
            <option >select</option>
              <option value="art">Art</option>
              <option value="music">Music</option>
              <option value="sport">Sport</option>
              <option value="photography">Photography</option>
              <option value="adventure">Adventure</option>
              <option value="luxry">Luxury</option>
            </Form.Select>
            <p>{formErrors.categories}</p>
            <br />
           
            <Button disabled={disable} variant="primary" type="submit" onClick={createMarket} >
              create
            </Button>
          </Form>

        </div>
        <div className='form container3'></div>



        <div className='card-items'>
        
          <ul className='cards__items'>
            <Created_Nfts/>
            
          </ul>


        </div>



        <div className="card-items">

          <ul className='cards__items'>
            <Sold_Nfts/>
          </ul>




        </div>

      </div>




    </>
  )
}

export default Forms