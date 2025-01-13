import React, { Profiler, useContext, useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js'
import { Link, useNavigate } from "react-router-dom"
import { StoreContext } from '../../context/StoreContext.jsx'
const Navbar = ({setShowLogin}) => {
    const[menu,setMenu]=useState("home");
    const {getTotalCartAmount,token,setToken}=useContext(StoreContext)
    const navigate=useNavigate();
    const logout=()=>{
      localStorage.removeItem("token");
      setToken("");
      navigate("/")
    }
    
  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
        <Link to='/'  onClick={()=>{setMenu("menu");document.getElementById("explore-menu")?.scrollIntoView({ behavior: "smooth" });} className={menu==="menu"?"active":""}>Menu</Link>
        <Link to='/'  onClick={()=>{setMenu("mobile-app");document.getElementById("app-download")?.scrollIntoView({ behavior: "smooth" });}} className={menu==="mobile-app"?"active":""}>Mobile-App</Link>
        <Link to='/'  onClick={()=>{setMenu("contact-us");document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });}} className={menu==="contact-us"?"active":""}>Contact Us</Link>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt=''></img>
        <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt=''></img></Link>
            <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
          :<div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={()=>navigate("/myorders")}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>
        }
      </div>

    </div>
  )
}
export default Navbar
