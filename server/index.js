import { Server } from "socket.io"
import express from "express"
import http from "http"
import cookieParser from "cookie-parser";
import connectDb from "./src/Db/index.js";
import cors from "cors";

const app = express()
var server = http.createServer(app);
const port=process.env.PORT || 8000
const io=new Server(server,{
    cors: {
        origin: "https://edox.vercel.app/",
        methods: ['GET', 'POST'],
      },
})

let roomUsers={}

io.on('connection',socket=>{
    console.log("socket connected,  socket id : " + socket.id);
    
    socket.on('join-room',async({roomId,data})=>{
        socket.join(roomId);
        if (!roomUsers[roomId]) {
            roomUsers[roomId] =[]
        }
        const existedUser=roomUsers[roomId].find(user => user._id === data._id)
        if (!existedUser) {
            roomUsers[roomId].push(data)
            socket.broadcast.to(roomId).emit('user-joined',data)
        }
        io.in(roomId).emit('connected-users',roomUsers[roomId])
        const roomData=await Room.findOne({roomId})
        const content=JSON.parse(roomData.data)
        socket.emit('initialize-content',  content);
        // console.log(content);
    })

    socket.on('leave-room',({roomId,data})=>{
        socket.broadcast.to(roomId).emit('user-leave',data)
        socket.leave(roomId);
        roomUsers[roomId] = roomUsers[roomId]?.filter(user=>user._id!==data._id)
        io.in(roomId).emit('connected-users',roomUsers[roomId])
        // console.log("leave");
    })

    socket.on('text-change',({roomId,delta})=>{
        // console.log("here");
        socket.broadcast.to(roomId).emit('text-change',{delta});
    })

    socket.on('save-content',async({roomId,content})=>{
        console.log("here");
        const room=await Room.findOneAndUpdate({roomId},{data:content},{new:true});
        // console.log(room);
    })

    socket.on('cursor-move',({roomId,data,cursorPos})=>{
        socket.broadcast.to(roomId).emit('remote-cursor-move',{data,cursorPos});
    })

    socket.on('cursor-selection',({roomId,data,cursorPos})=>{
        socket.broadcast.to(roomId).emit('remote-cursor-selection',{data,cursorPos});
    })
})



connectDb()
.then(()=>{

    server.listen(port,()=>{
        
        console.log(`\nApp listening on http://localhost:${port}`);
    })
    
})
.catch(err=>{
    console.log(`mongo db connection error : ${err}`);
})
// server.listen(8000,() => {
//     console.log("app is listening on port 8000");
// })


app.get('/', (req, res)=>{
  res.send(
      {msg:"app is working"}
  )
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))


// // importing routes
import userRouter from './src/routes/user.route.js'
import roomRouter from './src/routes/room.route.js'
import { Room } from "./src/models/room.model.js";
app.use("/api/v1/users",userRouter)
app.use("/api/v1/rooms",roomRouter)

