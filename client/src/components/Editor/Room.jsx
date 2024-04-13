import React, { useContext, useEffect, useState } from 'react'
import TextEditor from './TextEditor'
import logo from '../../assets/logo.png'
import CodeEditor from './CodeEditor'
import UserAvatar from './UserAvatar'
import { Button } from 'flowbite-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AppContext from '../../context/AppContext'
import toast from 'react-hot-toast'
import Loader from '../../utils/Loader'

function Room() {
    const { toastOptions, toastOptions2, userData } = useContext(AppContext)
    const { roomId } = useParams();
    const location = useLocation()
    const  roomName  = location.state
    const { copyRoomId, currentRoom,checkRoom ,userDetails} = useContext(AppContext)
    const [socket, setsocket] = useState(null)
    const [connectedClients, setconnectedClients] = useState([])
const [loading, setloading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        // console.log(roomName);
        // console.log(roomId);
        // console.log(currentRoom);
        async function  checkingRoom(){
            setloading(true)
            await checkRoom(roomId)
            await userDetails()
            setloading(false)
            // console.log("here");
        }

        if (!roomName) {
            checkingRoom()
        }
        else setloading(false)
    }, [])

    useEffect(() => {
        socket?.on('user-joined', (data) => {
            toast(`${data.fullName} joined the room`, { icon: "👋🏻", ...toastOptions });
            // console.log("new user");
        })

        socket?.on('user-leave', (data) => {
            toast(`${data.fullName} left the room`, { icon: "🏃🏻‍♂️", ...toastOptions2 });
            // console.log("one user left");
        })

        socket?.on('connected-users', (data) => {
            console.log(data);
            const index = data.findIndex(user => user._id === userData._id );
            // const index = data.indexOf(userData);
            if (index !== -1) {
                data.splice(index, 1); // Remove the element from its current position
                data.unshift(userData); // Add the element to the beginning of the array
            }
            setconnectedClients(data)
            // toast(`${data.fullName} left the room`,{icon:"🏃🏻‍♂️",...toastOptions2});
            // console.log("one user left");
        })

        window.addEventListener("beforeunload", () => {
            socket?.emit('leave-room', { roomId, data: userData });
          
            socket.off();
          });


        return () => {
            socket?.off('user-joined')
            socket?.off('user-leave')
        }
    }, [socket])

    const userLeft = () => {
        socket?.emit('leave-room', { roomId, data: userData })
        navigate("/")
    }
    return (
        <div className=' h-screen w-screen'>
        {loading ? <Loader/>:
        <div className='grid grid-cols-10 gap-6  overflow-hidden bg-red-70 h-screen w-screen'>
            <div className="flex flex-col   h-screen justify-between sm:col-span-2 col-span-3 border-r-4 p-2 bg-indigo-950 border-slate-500">
                <div className="h-4/5     ">
                    <div className="flex flex-col xl:flex-row items-center  gap-4 p-2">
                        <img src={logo} alt="" className="w-20" />
                        <h1 class="md:text-3xl text-2xl font- tracking-widest Comfortaa text-cyan-100 ">Edoxx</h1>
                    </div>

                    <div className="md:text-base text-sm text-slate-300/80 p-2">Active users</div>

                    <div className="flex avatarbox p-2 flex-wrap gap-4 bg-red-5 overflow-y-scroll  h-3/5 "  >
                        {connectedClients?.map(client =>
                            <UserAvatar key={client._id} name={client.fullName} gender={client.gender} avatar={client.avatar} id={client._id} />
                        )}
                        {/* <UserAvatar name="sahil " />
                        <UserAvatar name="sahil saif " />
                        <UserAvatar name="raghubanshi " />
                        <UserAvatar name="sahil " /> */}
                        {/* <UserAvatar name="sahil " />
                        <UserAvatar name="sahil " />
                        <UserAvatar name="sahil " />
                        <UserAvatar name="sahil " />
                        <UserAvatar name="sahil " /> */}
                    </div>
                </div>
                <div className="my-2 ">
                    <Button onClick={() => copyRoomId(roomId)} color="white" className="bg-purple-800 w-full mt-2 hover:bg-purple-900 border-none " ><ion-icon name="copy"  ></ion-icon>&nbsp;&nbsp; Copy Room Id</Button>
                    <Button onClick={userLeft} color="white" className="bg-red-800 hover:bg-red-900 mt-3 w-full border-none " >Leave Room</Button>
                </div>


            </div>
            <div className="sm:col-span-8 col-span-7">
                <TextEditor socket={socket} setsocket={setsocket} />
                {/* <CodeEditor/> */}
                <span className="p-2 absolute right-5 border-t-4 border-x-2  border-gray-700 bg-slate-950 rounded-t-lg bottom-0 px-10  w-auto">🟢 {currentRoom?.roomName} </span>
            </div>
        </div>
        }
        </div>
    )
}

export default Room