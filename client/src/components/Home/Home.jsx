import React, { useContext, useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import Avatar, { genConfig } from 'react-nice-avatar'
import RoomCard from './RoomCard'
import BoxModal from './BoxModal'
import AppContext from '../../context/AppContext'
import Loader from '../../utils/Loader'
import toast from 'react-hot-toast'

function Home() {
    const [avatarMenuOpen, setavatarMenuOpen] = useState(false)
    //* boy, man, male1,male2,male3,male7,boy2,boy99
    //* girl4,girl3,girl6,girl9,girl20
    const avatarMenuRef = useRef('')
    const [createRoomModal, setcreateRoomModal] = useState(false)
    const [joinRoomModal, setjoinRoomModal] = useState(false)
    const [loading, setloading] = useState(false)
    const { userLogout, userDetails, userData ,rooms} = useContext(AppContext)
    const{fullName,avatar,gender}=userData
    // const{avtName,bgColor,shirtColor,hairColor}=avatar
    const initialConfig = genConfig(avatar?.avtName)
    const config = genConfig({ ...initialConfig, sex: gender=="male"?"man":"woman",bgColor: avatar?.bgColor, hairColor: avatar?.hairColor, shirtColor: avatar?.shirtColor })
    // const [rooms, setrooms] = useState(userData.rooms)
    
    useEffect(() => {
        const handleOutSideClick = (event) => {
            if (!avatarMenuRef.current?.contains(event.target)) {
                setavatarMenuOpen(false)
            }
        };
        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, [avatarMenuRef]);


    useEffect(() => {
        userDetails()
        // console.log(rooms);
    }, [])

    const handleLogout = async () => {
        // console.log("sahil");
        setloading(true)
        await userLogout()
        setloading(false)
    }

    return (
        <div className=' ' >
            <div className="flex px-4 sticky top-0 z-10 py-2 w-full justify-between border-b-2 border-b-indigo-900 bg-slate-900  ">
                <div className="gap-4 flex items-center">
                    <img src={logo} alt="" className='w-16 ' />
                    <h1 class="text-3xl font- tracking-widest Comfortaa text-cyan-100 ">Edoxx</h1>
                </div>

                <div className='flex items-center gap-8 '>
                    <div onClick={() => setjoinRoomModal(true)} class="relative px-1 py-0.5 cursor-pointer inline-flex items-center justify-center font-bold overflow-hidden group rounded-md">
                        <span class="w-full h-full bg-gradient-to-br from-[#0956d1] via-[#a71adb] to-[#5200c4] absolute"></span>
                        <span class="relative px-6 py-3 bg-gradient-to-b transition-all ease-out bg-gray-900/90 rounded-md group-hover:from-[#5200c4] group-hover:via-[#380a7d] group-hover:to-[#1d0a37] duration-">
                            <span class="relative  flex items-center gap-2 text-white"><ion-icon size="larg" style={{ fontSize: "25px" }} name="add-outline"></ion-icon> Join A Room</span>
                        </span>
                    </div>
                    {joinRoomModal && <BoxModal type="joining" setModalOpen={setjoinRoomModal} />}
                    <div ref={avatarMenuRef} className="py-2 relative">
                        <div onClick={() => setavatarMenuOpen(!avatarMenuOpen)} className="flex items-center gap-3  pr-2 rounded-lg  bg-slate-950/90" >
                            <Avatar className="w-14 h-14 cursor-pointer  outline z-10  outline-offset-4 outline-purple-600 "  {...config} />
                            <div className="text-lg">
                                {fullName}
                            </div>
                        </div>
                        {
                            avatarMenuOpen &&
                            <div className="avatar-menu  animate__animated absolute animate__fadeIn animate__faster  mt-2 p-2 w-36 rounded-lg text-black cursor-pointer  bg-slate-300">
                                <div onClick={() =>toast.error("profile page not implemented yet")} className="p-2 border-b border-b-slate-500  hover:bg-slate-400 rounded cursor-pointer "><ion-icon name="person-outline"></ion-icon> My profile</div>
                                <div onClick={handleLogout} className="p-2 hover:bg-slate-400 cursor-pointer rounded"><ion-icon name="log-out-outline"></ion-icon> Log out</div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex gap-10  gap-y-9 flex-wrap justify-start   p-6">
                {loading && <Loader />}
                <div onClick={() => setcreateRoomModal(true)} className="p-2 h-56 max-w-52 min-w-52 text-center flex flex-col justify-center items-center rounded-lg   shadow-md shadow-gray-900 border-x-2   border-purple-700 border-y-4   border-y-purple-700 bg-gradient-to-b from-[#4b05acb9] via-[#3f0892] to-[#1d0a37]  hover:from-[#4b05acb9] hover:via-[#391271] hover:to-[#1d0a37]   cursor-pointer transition duration-700  outline-dashed outline-offset-4 outline-gray-600  "   >
                    <ion-icon style={{ fontSize: "90px" }} name="add-outline"></ion-icon>
                    <div className="p-2">
                        Create a Document <br /> <br /> ( collaborative editing room )
                    </div>
                </div>
                {
                    rooms?.length==0 && <div className="text-center flex-grow self-center text-gray-400">No previous document rooms available</div>
                }
                {rooms?.map(room =>
                    <RoomCard roomData={room} roomId={room.roomId} roomName={room.roomName} createdAt={room.createdAt}  />
                )}

                {
                    createRoomModal && <BoxModal setModalOpen={setcreateRoomModal} />
                }

            </div>
        </div>
    )
}


export default Home