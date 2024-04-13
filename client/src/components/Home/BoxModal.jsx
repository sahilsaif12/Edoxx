
import { Button, Label, Modal } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import generateUniqueId from 'generate-unique-id'
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppContext from "../../context/AppContext";
import Loader from "../../utils/Loader";


function BoxModal({ setModalOpen, type }) {
    const [openModal, setOpenModal] = useState(false);
    const [roomId, setroomId] = useState(false);
    const [roomName, setroomName] = useState('');
    const [joiningId, setjoiningId] = useState('');
    const [loading, setloading] = useState(false);
    const roomNameRef = useRef(null);
    const modalBtnRef = useRef(null);
    // const navigate=useNavigate()
    const {createRoom,currentRoom,joinRoom} = useContext(AppContext)
    const generateId = () => {
        const id = generateUniqueId({
            length: 10,
        });
        setroomId(id)
    }

    useEffect(() => {
        modalBtnRef.current.click()
        generateId()
    }, [])

    useEffect(() => {
        setModalOpen(openModal)
    }, [openModal])


    const handleRoomOpen=async() => {

        if(type=="joining"){
            setloading(true)
            await joinRoom(joiningId)
            setloading(false)
        }else{
            setloading(true)
            await createRoom(roomId,roomName)
            setloading(false)
            // setModalOpen(false)
        }
       
    }
    return (
        <>
            <Button ref={modalBtnRef} className="hidden" onClick={() => setOpenModal(true)}>Toggle modal</Button>
            <Modal dismissible className="backdrop-blur-" show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={roomNameRef}>


                <Modal.Body className=" bg-gray-950 border-y-4 border-x-2 border-y-purple-800 border-x-purple-500/50 rounded-md shadow-lg shadow-violet-950">
                    <div className="space-y-6 py-5">
                    {loading && <Loader/>}
                    {type!="joining" &&
                        <div>
                            <div className="mb-2 block text-gray-400">
                                <Label htmlFor="roomId" className="text-gray-400" value="Your generated room id" />
                            </div>
                            <div className="flex items-center">
                                <input id="roomId" value={roomId} disabled className="block w-full p-3 rounded bg-gray-950/60  border-2 border-transparent border-b-slate-600  focus:border-indigo-600 focus:outline-none" required />
                                <abbr title="change room id">
                                    <ion-icon name="sync-circle-outline" style={{ color: '#DAD8D4', cursor: 'pointer' }} onClick={generateId} size="large"></ion-icon>
                                </abbr>
                            </div>
                        </div>
                    }
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="roomName" className="text-gray-400" value={`${type == "joining" ? "Room Id" : "Room Name"}`} />
                            </div>
                            {type == "joining" ?
                                <input id="roomName" ref={roomNameRef} value={joiningId} onChange={(e)=>setjoiningId(e.target.value)}  type="text" className="block w-full p-3 rounded bg-gray-950/60 border  border-b-2 border-transparent border-b-slate-600  focus:border-purple-700 focus:outline-none" required />
                                : <input id="roomName" ref={roomNameRef} value={roomName} onChange={(e)=>setroomName(e.target.value)} type="text" className="block w-full p-3 rounded bg-gray-950/60 border  border-b-2 border-transparent border-b-slate-600  focus:border-purple-700 focus:outline-none" required />
                            }
                        </div>

                        <div className="w-ful flex gap-4 justify-end">
                            <Button color="white" className={`bg-purple-900 ${loading && "-z-10"}  hover:bg-purple-700 border-none `} onClick={handleRoomOpen}> {`${type == "joining" ? "Join Room" : "Create Room"}`}  </Button>
                            <Button color="white" className={`bg-red-800 hover:bg-red-900  ${loading && "-z-10"} border-none `} onClick={() => setOpenModal(false)}>cancel</Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}


export default BoxModal
