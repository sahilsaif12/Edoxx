
// ----------- NOT USED --------------


import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
// import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateAccessAndRefreshToken, options } from "../controllers/user.controller.js"

const verifySignUpJwt = async (req, res, next) => {
    console.log(req.cookies);
    const accessToken = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    const refreshToken = req.cookies.refreshToken || req.header("RefreshToken")
    console.log(accessToken);
    console.log(refreshToken);
    if (!(accessToken && refreshToken)) {
        return next()
    }

    let decodedToken = null
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, result) => {
                if (err) {
                    console.log("heree");
                    return next()
                }
                else {
                    decodedToken = result
                }
            })
        } else {
            decodedToken = decoded
        }
    })

    const user = await User.findById(decodedToken?._id)
    if (!user) {
        return next()
    }
    // console.log(user)

    const {newAccessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    console.log(newAccessToken,newRefreshToken);
    return res.status(400)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(410, "user already signed in", {msg:"already signed in", accessToken:newAccessToken, refreshToken:newRefreshToken })
    )
}

export { verifySignUpJwt }