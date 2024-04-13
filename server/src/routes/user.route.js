import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { verifySignUpJwt } from "../middlewares/signup.middleware.js";
import { loginUser, logoutUser, registerUser, userDetails, userVerified } from "../controllers/user.controller.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJwt,logoutUser)
router.route("/userDetails").get(verifyJwt,userDetails)
router.route("/userVerify").get(verifyJwt,userVerified)

// router.route("/login").post(loginUser)

//@ secure routes

// router.route("/logout").get(verifyJwt,logoutUser)
// router.route("/refreshToken").get(refreshAccessToken)
// router.route("/changePassword").post(verifyJwt,changeCurrentPassword)
// router.route("/currentUser").get(verifyJwt,getCurrentUser)
// router.route("/updateDetails").patch(verifyJwt,updateAccountDetails)
// router.route("/updateAvatar").patch(verifyJwt,upload.single("avatar"),updateUserAvatar)
// router.route("/updateCoverImage").patch(verifyJwt,upload.single("coverImage"),updateUserCoverImage)
// router.route("/channel/:channelId").get(verifyJwt,getUserChannelProfile)
// router.route("/watchHistory").get(verifyJwt,getWatchHistory)
export default router