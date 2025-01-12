import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoutes.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
const app=express();
// app config
const port=process.env.PORT || 4000;


// globle middleware
app.use(express.json());
app.use(cors());
// db connection
connectDB();

// api endpoints

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter)

// app.get("/",(req,res)=>{
//     res.send("hello")
// })
// global error handling
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  });
app.listen(port,()=>{
    console.log(`server is starting on port http://localhost:${port}`)
})
//mongodb+srv://25527amankumarcse1:<db_password>@cluster0.qtrj5.mongodb.net/?