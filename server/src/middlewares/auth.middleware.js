import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
// import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const verifyJwt = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    const refreshToken = req.cookies?.refreshToken || req.header("RefreshToken")
    // console.log(accessToken);
    // console.log(refreshToken);
    if (accessToken == "undefined" || !accessToken) {
        if (!refreshToken) {
            // console.log("hereeee");
            return res.status(404)
            .json(
                new ApiResponse(404, "No access token available")
            )
            // throw new Error('No access token available');
        }
    }

    let decodedToken = null
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            // Check if the error is due to token expiration
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, result) => {
                if (err) {
                    return res.status(400)
                        .json(
                            new ApiResponse(400, "both token expired or not verified'")
                        )
                    // throw new Error('both token expired or not verified');
                }
                else {
                    decodedToken = result
                }
            })

        } else {
            decodedToken = decoded
        }
    })
    // console.log(decodedToken);
    const user = await User.findById(decodedToken?._id)
    if (!user) {
        return res.status(401)
            .json(
                new ApiResponse(401, "Unauthorized token")
            )
        // throw new Error('Unauthorized token');
    }


    req.user = user
    next()
}

export { verifyJwt }