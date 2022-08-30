import React from 'react';
import '../../App.css';

import HeroSection from '../HeroSection';
import Navbar from '../Navbar';
//import Cards from '../Cards';
import Instruction from '../Instruction';
import Index_Home from '../templates/Index_Home';
import ModalBox from '../ModalBox';
import MyDigitalAsset from '../MyDigitalAsset';
import CategoryCard from '../CategoryCard';


function Home() {
  return (
    <>
      <HeroSection />
      <Index_Home></Index_Home>
     
      <CategoryCard/>
      <Instruction/>
      
 
    
    </>
  );
}

export default Home;