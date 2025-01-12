import express from "express";
import authMiddleware from "../middleware/auth.js";
import {listOrders, placeOrder, updateStatus, userOrder} from "../controller/orderController.js"
import { placeOrderRazorpay} from "../controller/orderController.js";
import { verifyRazorpay} from "../controller/orderController.js";
import { placeOrderStripe } from "../controller/orderController.js";
import { verifyStripe } from "../controller/orderController.js";
const orderRouter =express.Router();
// Payment Feature

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/razorpay", authMiddleware, placeOrderRazorpay);
orderRouter.post("/stripe", authMiddleware,placeOrderStripe);
orderRouter.post('/verifyRazorpay',authMiddleware, verifyRazorpay);
orderRouter.post('/verifyStripe',authMiddleware, verifyStripe)
orderRouter.post("/userorders",authMiddleware,userOrder);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateStatus)
export default orderRouter;