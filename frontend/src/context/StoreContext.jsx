import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets.js";
export const StoreContext=createContext(null);
const StoreContextProvider=(props)=>{
    const url="https://food-project-backend-kibv.onrender.com"
    const[cartItems,setCartItems]=useState({});
    const[token,setToken]=useState("");
    const[food_list,setFoodList]=useState([]);
    const[loading,setLoading]=useState(true);
    const delivery_fee=100;
    const addToCart=async(itemId)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}});
        }
    }

    const removeFromCart=async(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}});
        }
    }
    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems])
    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=food_list.find((product)=>product._id===item)
                totalAmount=totalAmount+itemInfo.price*cartItems[item];
            }
        }
        return totalAmount;
    }
   const fetchFoodList = async () => {
        try {
            setLoading(true); // start loading
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        } finally {
            setLoading(false); // stop loading regardless of success/failure
        }
    };
    const loadCartData=async(token)=>{
        const response=await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData)
    }
    useEffect(() => {
        // Load food list independently to make it show faster
        fetchFoodList(); 
    
        // Handle token and cart in parallel (no need to wait for food list)
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
            loadCartData(tokenFromStorage);
        }
    }, []);
    
    const contextValue={food_list,cartItems,setCartItems,addToCart,removeFromCart,getTotalCartAmount,url,token,setToken,delivery_fee,loading};
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;
