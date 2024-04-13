import mongoose,{Schema} from "mongoose";

const roomSchema=new Schema(
    {
        roomId:{
            type:String,
            required:true,
            trim:true,
        },
        data:{
            type:String,
            default:"{}"
            // required:true,
        },
        roomName:{
            type:String,
            required:true,
            trim:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"users",
            required:true,
        },
        contributors:{
            type:[
                {
                    type:Schema.Types.ObjectId,
                    ref:"users"
                    
                }
            ]
        }
        
    },
    {timestamps:true}
)



export const Room=mongoose.model("Room",roomSchema)