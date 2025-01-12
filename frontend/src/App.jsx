import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder.jsx'
import Footer from './components/Footer/Footer.jsx'
import Loginpop from './components/Loginpop/Loginpop.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify.jsx'
import MyOrders from './pages/MyOrders/MyOrders.jsx'

const App = () => {
  const[showLogin,setShowLogin]=useState(false)
  return (
    <>
      {showLogin?<Loginpop setShowLogin={setShowLogin}></Loginpop>:<></>}
      <div className='app'>
        <ToastContainer/>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<PlaceOrder />}></Route>
          <Route path='/verify' element={<Verify/>}></Route>
          <Route path='/myorders' element={<MyOrders/>}></Route>
        </Routes>
      </div>
      <Footer />


    </>
  )
}

export default App
