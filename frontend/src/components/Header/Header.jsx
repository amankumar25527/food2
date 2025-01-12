import React from 'react'
import './Header.css'
const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2>Order your favourite food here</h2>
        <p>choose from a diverse menue featuring a delectable array of dishes crafeted with the finest
        ingredent and  culinary expertise. Our mission is to satisfy your craving and elevate your dining experience.</p>
       <a href="#explore-menu"><button>View menue</button></a>
      </div>
    </div>
  )
}

export default Header
