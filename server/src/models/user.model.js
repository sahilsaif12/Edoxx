import mongoose,{Mongoose, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        email:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            index:true,
            trim: true,
        },
        gender:{
            type: String,
            required: true,
            index:true,
            trim: true,
        },
        password:{
            type:String,
            required: true,
        },
        avatar:{
            type:Schema.Types.ObjectId,
            ref:'Avatar',
        },
        rooms:{
            type:[
                {
                    type:Schema.Types.ObjectId,
                    ref:"rooms"
                    
                }
            ]
        }
    },
    {timestamps:true}
)

userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hashSync(this.password,10)
        next()
        
    }
})

userSchema.methods.isPasswordCorrect= async function(password){
    
    return await bcrypt.compare(password,this.password)
}



userSchema.methods.generateAccessToken= async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRE
        }
    )
}

userSchema.methods.generateRefreshToken= async function(){
    return await jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRE
        }
    )
}
export const User=mongoose.model("User",userSchema)