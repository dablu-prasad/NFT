import React from 'react';
import './Cards.css';
import CardItem from './CardItem';
import { Button } from 'bootstrap';

function Cards(props) {
 
  
  let flag = false;
  let categories = props.filter;
  let filteredNFTS ={};
  if(flag!="false"){
    props.nfti.map((nfts,i)=>{
          if(nfts.categories==categories)
          filteredNFTS =nfts;
      })
  }
  
  return (
    <div className='cards'>
      <h1>{props.heading}</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <div className='cards__item'>
            {
              
              props.nfti.map((nfts,i)=>(
               
             
               
                <CardItem
                src={nfts.image}
                text={nfts.description}
                label={nfts.price}
                path='/services'
                nft={nfts}
              />
                  
             
              ))
              
            }
           
            
          </div>
          

          
        </div>
      </div>
    </div>
  );
}

export default Cards;