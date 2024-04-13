import mongoose,{Schema} from "mongoose";

const avatarSchema=new Schema(
    {
        avtName:{
            type:String,
            required:true,
            trim:true,
        },
        bgColor:{
            type:String,
            required:true,
            trim:true,
        },
        hairColor:{
            type:String,
            required:true,
            trim:true,
        },
        shirtColor:{
            type:String,
            required:true,
            trim:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
        
    },
    {timestamps:true}
)


export const Avatar=mongoose.model("Avatar",avatarSchema)