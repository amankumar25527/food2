import React from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets.js'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt='' />
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati nemo ut autem, eius nesciunt dolorum laborum maxime fugit ad ipsa nulla corporis quae assumenda cupiditate qui accusantium ea soluta at!</p>
          <div className='footer-social-icons'>
            <img src={assets.facebook_icon}></img>
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon}></img>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>88292878920</li>
            <li>tomato@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 Ⓒ Tomato.com - All Right Reserved</p>
    </div>
  )
}

export default Footer
