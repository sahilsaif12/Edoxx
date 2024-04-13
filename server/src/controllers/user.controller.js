import mongoose from "mongoose";
import { Avatar } from "../models/avatar.model.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const options = {
    httpOnly: true,
   // secure: true
}


const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color
}


const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }

}


const registerUser = async (req, res) => {

    const {fullName, email, password, gender } = req.body

    if ([email, password, fullName, gender].some((field) => field?.trim() === "")) {
        return res.status(400)
            .json(
                new ApiResponse(400, "Few fields are empty. All fields are required ! ")
            )
    }


    const existedUser = await User.findOne({ email })
    if (existedUser) {
        return res.status(401)
            .json(
                new ApiResponse(401, "An user already exists with this email")
            )
    }

    const user = await User.create({
        email,
        gender,
        password,
        fullName,
    })
console.log(user);
    if (!user) {
        return res.status(500)
            .json(
                ApiResponse(500, "something went wrong while registering the user")
            )
    }

    const male = ["boy", "man", "male1", "male2", "male3", "male7", "boy2", "boy99"]
    const female = ["girl4", "girl3", "girl6", "girl9", "girl20"]
    let avtName = ""
    if (gender == "male") {
        avtName = male[Math.floor(Math.random() * male.length)]
    } else {
        avtName = female[Math.floor(Math.random() * female.length)]
    }
    const bgColor = generateRandomColor()
    const hairColor = generateRandomColor()
    const shirtColor = generateRandomColor()

    const avatar = await Avatar.create({
        avtName,
        bgColor,
        hairColor,
        shirtColor,
        owner: user._id
    })

    await User.findByIdAndUpdate(user._id,
        { avatar: avatar._id }
    )


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, "user registered successfully", { accessToken, refreshToken  })
    )
}


const loginUser=async (req, res) => {

    const {email,password} =  req.body
    if ([email, password].some((field) => field?.trim() === "")) {
        return res.status(400)
            .json(
                new ApiResponse(400, "email and password are required ! ")
            )
    }

    const user=await User.findOne({email })

    if (!user) {
        return res.status(404)
            .json(
                new ApiResponse(404, "User not found ! ")
            )
        
    }

    const isPasswordValid=await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        return res.status(401)
            .json(
                new ApiResponse(401, "incorrect password ! ")
            )
    }

    const {accessToken, refreshToken }=await generateAccessAndRefreshToken(user._id)
    

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        // {accessToken,refreshToken}
        new ApiResponse(200,"user logged in successfully",{accessToken:accessToken,refreshToken:refreshToken})
    )
}


const logoutUser=async(req,res) => {    
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,"user logged out successfully")
    )
    
}


const userDetails = async (req, res) => {
    const user = req.user
    const details = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup: {
                from: 'avatars',
                foreignField: 'owner',
                localField: '_id',
                as: 'avatar',
                pipeline: [
                    {
                        $project: {
                            owner: 0,
                        }
                    }
                ]
            }
        },
        {
            $unwind:"$avatar"
        },
        {
            $lookup: {
                from: 'rooms',
                foreignField: '_id',
                localField: 'rooms',
                as: 'rooms',
                pipeline:[
                    {
                        $project:{
                            data:0
                        }
                    },
                    {
                        $sort: { createdAt: -1 } 
                    }
                ]
            },
        },
        {
            $project:{
                password:0,
            }
        }
        
    ])

    if (details && details.length == 0) {
        res.status(400)
            .json(
                new ApiResponse(200, "details not available")
            )
    }

    res.status(200)
        .json(
            new ApiResponse(200, "User details fetched successfully", details[0])
        )
}

const userVerified = async (req, res) => {
    const user = req.user
    const { accessToken, refreshToken  } = await generateAccessAndRefreshToken(user._id)

    return res.status(200)
        .json(
            new ApiResponse(200, "User is verified", { accessToken:accessToken,refreshToken:refreshToken })
        )
}



export {
    registerUser,
    loginUser,
    logoutUser,
    userDetails,
    userVerified,
    generateAccessAndRefreshToken,
    options

}