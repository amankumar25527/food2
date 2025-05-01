import React, { useContext, useEffect, useState, useRef } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem.jsx';

const FoodDisplay = ({ category }) => {
  const { food_list, loading } = useContext(StoreContext);
  const [visibleItems, setVisibleItems] = useState(6);
  const loaderRef = useRef(null);

  // Filter the food list based on category
  const filteredList = category === "All"
    ? food_list
    : food_list.filter(item => item.category === category);

  // Lazy loading logic using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setVisibleItems(prev => Math.min(prev + 6, filteredList.length));
      }
    }, { threshold: 1 });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [filteredList.length, loading]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {loading ? (
          <div className="loader-wrapper">
            <div className="circle-loader"></div>
          </div>
        ) : (
          filteredList.slice(0, visibleItems).map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        )}
      </div>

      {/* Lazy loader trigger */}
      {!loading && visibleItems < filteredList.length && (
        <div ref={loaderRef} className="lazy-loader">
          <div className="circle-loader small"></div>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
