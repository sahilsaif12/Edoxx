import React, { useContext } from 'react'
import roomImg from '../../assets/roomImg.webp'
import toast from 'react-hot-toast';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
function RoomCard({roomData,roomId,roomName,createdAt}) {
    // let roomId = 'q4d@t48#q#'
    const {copyRoomId,setcurrentRoom,toastOptions} = useContext(AppContext)
    const navigate=useNavigate()
    const d=new Date(createdAt)
    const options = {year: 'numeric', month: 'short', day: 'numeric',hour:'numeric',minute: 'numeric'};

    const enterRoom=async()=>{
        toast.success(`Entered to ${roomName}`,toastOptions)
        setcurrentRoom(roomData)
        navigate(`/room/${roomId}`,{state:{roomName:roomName}})
    }
    return (
        <div>
            <div onClick={enterRoom} className="p-4 h-60 min-w-52 text-center flex flex-col justify-center items-center rounded-lg   shadow-md shadow-gray-900 border-x-2   border-purple-700 border-y-4   border-x-gray-600 bg-gray-900/80 hover:bg-gray-950/80  cursor-pointer transition duration-700 "   >
                <img src={roomImg} className="min-w-full h-3/4 rounded-md" alt="" />
                <div className="p-2 text-center">
                    {roomName}
                </div>
                <div onClick={(e)=>copyRoomId(roomId,e)} className="text-md text-cyan-200 bg-slate-800 w-full rounded-md text-center p-1"><ion-icon name="copy-outline" style={{paddingTop:"3px"}}  ></ion-icon> &nbsp; {roomId}</div>
            </div>
            <div className="p-2 text-xs text-right text-gray-300/80">{d.toLocaleString(undefined,options) }</div>
        </div>
    )
}
export default RoomCard
