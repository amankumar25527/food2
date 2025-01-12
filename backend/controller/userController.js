import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator"

// create token

const  createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}
//login User

const loginUser=async(req,res,next)=>{
    const {email,password}=req.body;
    try{
        const user=await userModel.findOne({email});
        
        if(!user){
            res.json({success:false,message:"User Doesn't exist"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const token=createToken(user._id);

        res.json({success:true,token,message:"User Login Successfully"});
    }catch(error){
        // res.json({success:false,message:"Error"}); 
       next(error);
    }
    
}


// register user
 const registerUser=async(req,res,next)=>{
    const {name,password,email}=req.body;
    try{
        // checking user already exists
        const exists=await userModel.findOne({email});
        if(exists){
            res.json({
                success:false,
                message:"User already exists"
            })
        }
        // validating email formate and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter valid email"});
        }
        if(password.length<8){
            return res.json({success:false,message:"please enter strong password"})
        }
        // hassing user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser= new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user=await newUser.save();
        const token=createToken(user._id);
        res.json({success:true,token});

    }catch(error){
    //    res.json({success:false,message:"Error"});
      next(error);
    }
 }
 // Route for admin login
const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = jwt.sign(email + password, process.env.JWT_SECRET);
        res.json({ success: true, token });
      } else {
        res.json({ success: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      onsole.log(error);
      res.json({ success: false, message: error.message });
    }
  };
 export {loginUser ,registerUser , adminLogin} 