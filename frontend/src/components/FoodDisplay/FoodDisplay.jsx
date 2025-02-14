import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext.jsx'
import FoodItem from '../FoodItem/FoodItem.jsx'
const FoodDisplay = ({category}) => {
    const {food_list,loading}=useContext(StoreContext)
  return (
      if(loading){
          <div className="food-display-list">
              Loading Food Menu........
          </div>
      } 
    else{
        <div className='food-display' id="food-display">
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
          {food_list.map((item,index)=>{
            if(category==="All" || category===item.category){
              return <FoodItem key={index} id={item._id}  name={item.name} description={item.description} price={item.price} image={item.image}></FoodItem>
            }
          })}
        </div>
      </div>
    }
  )
}
//1.10.31
export default FoodDisplay
