import React from 'react'
import { Link } from 'react-router-dom';
function CategoryItems(props) {
  return (
    
    <>
    <li className='category__item'>
      <Link className='category__item__link' to={props.path}>
        <figure className='category__item__pic-wrap' data-category={props.label}>
          <img
            className='category__item__img'
            alt='Travel Image'
            src={props.src}
          />
        </figure>
        <div className='category__item__info'>
          <h5 className='category__item__text'>{props.text}</h5>
        </div>
      </Link>
    </li>
  </>

  )
}

export default CategoryItems