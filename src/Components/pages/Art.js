import React, { useEffect, useState } from 'react'
import Categories from '../Categories'
import HeroSection from '../HeroSection'
import './Art.css'
function Art(props) {
   const [show,setshow]= useState(true);
  
    const handel = ()=>{
        setshow(!show);
    }

    //const x = show?"showmore":"showless"
//console.log(x,show);
  

    return (
        <>

            <div className='herocontainer_1'>
            </div>
            <h1>{props.heading}</h1>
            <div className='container'>




                <div className='info'>

                    <h5 className='infotext'>{props.para1}<br /><br />
                    

                        <span className={show?"showmore":"showless"}>{props.para2}</span></h5>

                        
                </div>
                <button className='expand' onClick={handel}>expand</button>
                <div className='collection'>
                <Categories filter="art" heading="Trending collections in Art" />
                </div>
                

            </div>











        </>
    )
}

export default Art