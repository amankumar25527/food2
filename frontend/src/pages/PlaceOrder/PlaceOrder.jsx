import React, { useContext, useEffect, useState } from 'react'
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext.jsx'
import { assets } from '../../assets/assets.js'
import { toast } from "react-toastify";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState("cod");
  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, delivery_fee } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK is not loaded. Please refresh the page.");
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(url + '/api/order/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            navigate("/order")
            setCartItems({})
          }
        } catch (error) {
          console.log(error);
          toast.error(error)

        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      food_list.map((item) => {
        if (cartItems[item._id] > 0) {
          let itemInfo = item;
          itemInfo["quantity"] = cartItems[item._id]
          orderItems.push(itemInfo);
        }
      })
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + delivery_fee,
      };
      switch (method) {
        // API calls for cod
        case "cod":
          const response = await axios.post(url+"/api/order/place",orderData,{ headers: { token } });

          if (response.data.success) {
            setCartItems({});
            navigate("/order");
          } else {
            toast.error(response.data.message);
          }
          break;
          case "stripe":
            const responseStripe = await axios.post(url + "/api/order/stripe",orderData,{ headers: { token } });
            if (responseStripe.data.success) {
              const { session_url } = responseStripe.data;
              window.location.replace(session_url);
            } else {
              toast.error(responseStripe.data.message);
            }
            break;
        case "razorpay":
          const responseRazorpay = await axios.post(url+"/api/order/razorpay", orderData, { headers: { token } })
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order)

          }
          break
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  
  useEffect(()=>{
    if(!token){
      navigate("/cart");
    }
    else if(getTotalCartAmount()===0){
      navigate("/cart");
    }
  },[token])
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fileds">
          <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' required />
          <input name='lastName' value={data.lastName} onChange={onChangeHandler} type="text" placeholder='Last name' required />
        </div>
        <input name='email' value={data.email} onChange={onChangeHandler} type="email" placeholder='Email address' required />
        <input name='street' value={data.street} onChange={onChangeHandler} type="text" placeholder='Street' required />
        <div className="multi-fileds">
          <input name='city' value={data.city} onChange={onChangeHandler} type="text" placeholder='City' required />
          <input name='state' value={data.state} onChange={onChangeHandler} type="text" placeholder='State' required />
        </div>
        <div className="multi-fileds">
          <input name='zipcode' value={data.zipcode} onChange={onChangeHandler} type="text" placeholder='Zip Code' required />
          <input name='country' value={data.country} onChange={onChangeHandler} type="text" placeholder='Country' required />
        </div>
        <input name='phone' value={data.phone} onChange={onChangeHandler} type="text" placeholder='Phone' required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : delivery_fee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + delivery_fee}</b>
            </div>
          </div>
          <div className="payment-method">
            <div onClick={()=>setMethod("cod")}  className="payment-option">
              <input type="radio" id="cod" name="paymentMethod" value="COD" required />
              <label className="cod">Cash on Delivery (COD)</label>
            </div>

            <div onClick={()=>setMethod("razorpay")} className="payment-option">
              <input type="radio" id="razorpay" name="paymentMethod" value="Razorpay" />
              <label className="razorpay">
                <img src={assets.razorpay_logo} alt="Razorpay" className="razorpay-logo" />
              </label>
            </div>
            <div onClick={()=>setMethod("stripe")} className="payment-option">
              <input type="radio" id="stripe" name="paymentMethod" value="stripe" />
              <label className="stripe">
                <img src={assets.stripe_logo} alt="stripe" className="stripe-logo" />
              </label>
            </div>
          </div>
          <button type='submit'>PLACE ORDER</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
