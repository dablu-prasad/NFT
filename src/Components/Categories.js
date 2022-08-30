import React from 'react'
import Cards from './Cards';

import Navbar from './Navbar';
import CategoryCard from './CategoryCard';
import FilterCard from './FilterCard'
function Categories(props) {

 
  return (
    <>
      
      
      <FilterCard flag="true" categories={props.filter} heading={props.heading}/>
    </>
    
  )
}

export default Categories