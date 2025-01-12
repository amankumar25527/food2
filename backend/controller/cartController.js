import userModel from "../models/userModel.js";

// add item to user cart

const addToCart = async (req, res) => {
    // console.log(req.body);
    try {
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:cartData});
        res.json({success:true, message:"Added To Cart"})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"ERROR"})
    }
}

// remove item from user cart

const removeFromCart = async (req, res) => {
    try {
        let userData= await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId]-=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:cartData});
        res.json({success:true,message:"Item is removed from cart"})
    } catch (error) {
        res.json({success:false,message:"ERROR"})
    }

}
// fetch user cart data

const getCart = async (req, res) => {
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;
        res.json({success:true,message:"cart of user is",cartData});
    } catch (error) {
        res.json({success:false,message:"ERROR"});
    }
}

export { addToCart, removeFromCart, getCart }