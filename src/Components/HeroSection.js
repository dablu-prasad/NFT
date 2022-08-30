import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  return (
    <>
    
    <div className='herocontainer1'></div>

      <div className='hero-container'>
        {/* <video src='/videos/video-1.mp4' autoPlay loop muted /> */}
        <h2 className='heading'>Discover, collect, and sell extraordinary NFTs</h2>
        <p>What are you waiting for?</p>
        <div className='hero-btns'>
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
          >
            GET STARTED
          </Button>
          {/* <Button
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large'
            onClick={console.log('hey')}
          >
            WATCH TRAILER <i className='far fa-play-circle' />
          </Button> */}
        </div>
      </div>

    
    </>
  );
}

export default HeroSection;