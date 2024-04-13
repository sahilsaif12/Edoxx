import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { checkRoom, createRoom, joinRoom } from "../controllers/room.controller.js";

const router=Router()

router.route("/createRoom").post(verifyJwt,createRoom)
router.route("/joinRoom/:roomId").get(verifyJwt,joinRoom)
router.route("/checkRoom/:roomId").get(verifyJwt,checkRoom)

export default router