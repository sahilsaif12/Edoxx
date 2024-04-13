import { Room } from "../models/room.model.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const createRoom=async(req, res)=>{
    const user=req.user
    const{roomId,roomName}=req.body
    if (roomName?.trim()=="") {
        return res.status(400)
        .json(
            new ApiResponse(400, "Room name is required")
        )
    }
    const oldRoom=await Room.findOne({roomId})
    if (oldRoom) {
        return res.status(400)
        .json(
            new ApiResponse(400, "try another room id")
        )
    }

    const room= await Room.create({
        roomId,
        roomName,
        owner:user._id
    })

    await User.findByIdAndUpdate(
        user._id,
        {
            $push:{
                rooms:{
                    $each:[room._id]
                }
            }
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(200, "New room created successfully",room)
        )
}

const joinRoom=async (req,res)=>{
    const {roomId}=req.params
    const user=req.user
    let room=await Room.findOne({roomId})
    if(!room){
        return res.status(400)
        .json(
            new ApiResponse(400, "No room available with this roomId")
        )
    }

    if (room.owner!=user._id) {
        room=await Room.findByIdAndUpdate(
            room._id,
            {
                $addToSet:{
                    contributors:{
                        $each:[user._id]
                    }
                }
            },
            {new:true}
        )
        await User.findByIdAndUpdate(
            user._id,
            {
                $addToSet:{
                    rooms:{
                        $each:[room._id]
                    }
                }
            }
        )
         
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "joining the room",room)
        )
}

const checkRoom = async(req, res) => {
    const {roomId}=req.params
    const user=req.user

    if(roomId?.trim()==""){
        return res.status(400)
        .json(
            new ApiResponse(400, "No roomId provided")
        )
    }
    
    const room=await Room.findOne({roomId})

    if (!room) {
        return res.status(400)
        .json(
            new ApiResponse(400, "No room available with this roomId")
        )
    }

    const userAuthorized = await User.findOne({
        $and:[{_id:user._id},{rooms:{ $in: [room._id] } }]
          })

    if (!userAuthorized) {
        return res.status(401)
        .json(
            new ApiResponse(401, "Not authorized to access this room")
        )
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "userAuthorized to access this room",room)
        )
}

export{
    createRoom,
    joinRoom,
    checkRoom
}