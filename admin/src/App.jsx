import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add.jsx'
import List from './pages/List/List.jsx'
import Orders from './pages/Order/Orders.jsx'
import Login from './components/Login/Login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  const url = "https://food-project-backend-kibv.onrender.com"
  const [admintoken, setToken] = useState(localStorage.getItem('admintoken') ? localStorage.getItem('admintoken') : '');
  useEffect(() => {
    localStorage.setItem('admintoken', admintoken)
  }, [admintoken])
  return (
    <div>
      <ToastContainer />
      {admintoken === "" ? (
        <Login setToken={setToken} url={url} />
      ) : (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <Sidebar setToken={setToken}/>
            <Routes>
              <Route path='/add' element={<Add url={url} />}></Route>
              <Route path='/list' element={<List url={url} />}></Route>
              <Route path='/orders' element={<Orders url={url} />}></Route>
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App

