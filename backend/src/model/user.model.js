import mongoose from "mongoose";
export const userSchema = new mongoose.Schema({
    clerkId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    bio:{
        type:String,
        default:""
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPhoto:{
        type:String,
        default:""
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    location:{
        type:String,
        default:""
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
}, {timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;