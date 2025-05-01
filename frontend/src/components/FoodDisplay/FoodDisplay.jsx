import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem.jsx';

const FoodDisplay = ({ category }) => {
  const { food_list, loading } = useContext(StoreContext);

  const skeletonArray = Array(6).fill(0); // Show 6 skeleton cards

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {loading ? (
          skeletonArray.map((_, index) => (
            <div className="food-skeleton" key={index}></div>
          ))
        ) : (
          food_list.map((item, index) => {
            if (category === "All" || category === item.category) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
