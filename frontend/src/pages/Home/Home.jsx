import React, { useState } from 'react'
import "./Home.css"
import Header from '../../components/Header/Header.jsx'
import ExplorMenu from '../../components/ExplorMenu/ExplorMenu.jsx'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay.jsx'
import AppDownload from '../../components/AppDownload/AppDownload.jsx'
const Home = () => {
  const [category,setCategory]=useState("All")
  return (
    <div>
      <Header/>
      <ExplorMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}></FoodDisplay>
      <AppDownload/>
    </div>
  )
}

export default Home
