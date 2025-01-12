import mongoose from "mongoose";
import validator from "validator"
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
  }, { minimize: false }); //This option should be part of the schema options, not inside a field definition. It prevents Mongoose from removing empty objects ({}) from documents.
  
const userModel= mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;
