import express from "express"
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import razorpay from 'razorpay'
import Stripe from "stripe"
const currency='inr'
const deliveryCharge=100
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//getway setup

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
//placing user order for  frontend
// placing order by using cod
const placeOrder=async (req,res)=>{
    try {
        const{userId,items,amount,address}=req.body;
        const orderData={
            userId:userId,
            items:items,
            address:address,
            amount:amount,
            paymentMethod:"COD",
            payment:false
        }
        const newOrder=new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId,{cartData:{}});
        res.json({success:true,message:"order is placed"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
};

// Placing order using Razorpay method
const placeOrderRazorpay = async (req, res) => {
    try {
      const { userId, items, amount, address } = req.body;
      const { origin } = req.headers;
      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "Razorpay",
        payment: false,
        date: Date.now(),
      };
      const newOrder = new orderModel(orderData);
      await newOrder.save();
      
      const options = {
        amount: amount*100,
        currency: currency.toUpperCase(),
        receipt: newOrder._id.toString()
      }
      await razorpayInstance.orders.create(options,(error,order)=>{
        if (error) {
          console.log(error);
          return res.json({success:false, message:error})
        }
        res.json({success:true, order})
      })
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
  const verifyRazorpay = async(req,res)=>{
    try {
      const {userId, razorpay_order_id} = req.body
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
      if (orderInfo.status==='paid') {
        await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        res.json({success:true, message:"Payment Successful"})
      }else{
        res.json({success:false, message:"Payment Failed"})
      }
      
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  }
  const placeOrderStripe=async(req,res)=>{
    const origin="https://food-user-frontend.onrender.com"
    try {
      const newOrder=new orderModel({
        userId:req.body.userId,
        items:req.body.items,
        amount:req.body.amount,
        address:req.body.address,
        paymentMethod: "Stripe",
        payment: false,
        date: Date.now(),
      })
      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
      const line_items=req.body.items.map((item)=>({
        price_data: {
          currency: currency,
          product_data:{
            name: item.name,
          },
          unit_amount: item.price * 100
        },
        quantity:item.quantity
      }))
      line_items.push({
        price_data:{
          currency:currency,
          product_data:{
            name:"Delivery Charges"
          },
          unit_amount:100*100
        },
        quantity:1
      })
      const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode:'payment',
      })
      res.json({success:true, session_url:session.url})
    } catch (error) {
      console.log(error);
       res.json({ success: false, message: error.message });
    }
  }

  // Verify Stripe
  const verifyStripe = async (req, res) => {
    const { success, orderId, userId } = req.body; // Include userId for cart update if needed
  
    try {
      if (success === true || success === "true") {
        if (!orderId) {
          return res.status(400).json({ success: false, message: "Order ID is required" });
        }
  
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
  
        if (userId) {
          await userModel.findByIdAndUpdate(userId, { cartData: {} });
        }
  
        res.json({ success: true, message: "Paid" });
      } else {
        if (!orderId) {
          return res.status(400).json({ success: false, message: "Order ID is required" });
        }
  
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: false, message: "Not Paid" });
      }
    } catch (error) {
      console.error("Error in verifyStripe:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  // user order for frontend
  const userOrder =async(req,res)=>{
    try {
      const orders=await orderModel.find({userId:req.body.userId});
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"ERROR"})
    }
  }
  // listing order for admin pannel
  const  listOrders=async(req,res)=>{
    try {
      const orders=await orderModel.find({})
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"ERROR"})
    }
  }
  // updating order status
  const updateStatus=async(req,res)=>{
    try {
      if(req.body.payment){
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status,payment:true})
         res.json({success:true,message:"status updated"})
      }
      else{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
         res.json({success:true,message:"status updated"})
      }
      
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"ERROR"})
    }
  }
export {placeOrder,placeOrderRazorpay,verifyRazorpay,placeOrderStripe,verifyStripe,userOrder,listOrders,updateStatus}
