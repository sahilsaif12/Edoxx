import toast from "react-hot-toast"
import AppContext from "./AppContext.jsx"
import axios from "axios"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
// import { setCookie } from 'react-use-cookie';
// import Cookies from 'universal-cookie';



export default function AppState(props) {
    const [userData, setuserData] = useState('')
    const [currentRoom, setcurrentRoom] = useState(null)
    const [rooms, setrooms] = useState([])
    const server=import.meta.env.VITE_SERVER
const navigate=useNavigate()

    const copyRoomId = (text,e) => {
        if (navigator.clipboard) {
            // Use navigator.clipboard.writeText() to copy text to clipboard
            navigator.clipboard.writeText(text)
            toast.success("Room id copied", {
                duration: 2000,
                style:{
                    color:"black",
                    fontWeight:"bold",
                }
            })
            e.stopPropagation()
        }
    }

    const toastOptions={
        style:{
            color:'#fff',
            backgroundColor:"#242424",
            border:"2px solid green"
        },
        duration: 3000
    }

    const toastOptions2={
        style:{
            color:'#fff',
            backgroundColor:"#242424",
            border:"2px solid red"
        },
        duration: 3000
    }

    const generateRandomColor=() => {
        const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color
    }



    const register = async (email, fullName,gender,password) => {
        try {
            const res = await axios.post(`${server}/api/v1/users/register`, {
                email, fullName,gender,password
            })
            const success=res.data.success
            const data =res.data.data
            if (success) {
                Cookies.set('access-Token',data.accessToken);
                Cookies.set('refresh-Token',data.refreshToken);
                navigate("/")
            }
          } catch (error) {
            console.log(error);
            const data =error?.response?.data
            toast.error(data?.message);
          }
    }


    const userLogin = async (email,password) => {
        try {
            const res = await axios.post(`${server}/api/v1/users/login`, {
                email,password
            })
            // console.log(res);
            const success=res.data.success
            const data =res.data.data
            if (success) {
                const accessToken = data.accessToken
                const refreshToken = data.refreshToken
                // console.log(accessToken,refreshToken);
                Cookies.set('access-Token',accessToken);
                Cookies.set('refresh-Token',refreshToken);
                navigate("/")
            }
          } catch (error) {
            console.log(error);
            const data =error?.response?.data
            toast.error(data?.message);
          }
    }


    const userLogout= async () => {
        try {
            let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
            const res = await axios.get(`${server}/api/v1/users/logout`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'RefreshToken':refreshToken
                  }
              })
            const success=res.data.success
            if (success) {
                Cookies.remove('access-Token')
            Cookies.remove('refresh-Token')
                navigate("/signUp")
            }
          } catch (error) {
            console.log(error);
          }
    }


    const userDetails= async () => {
        try {

            let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
            const res = await axios.get(`${server}/api/v1/users/userDetails`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'RefreshToken':refreshToken
                  }
              })
              const data =res.data.data
              setuserData(data)
              setrooms(data.rooms)
            //   console.log(data);
            
          } catch (error) {
            console.log(error);
          }
    }

    const createRoom= async (roomId,roomName) => {
        try {
            let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
            const res = await axios.post(`${server}/api/v1/rooms/createRoom`,
            {roomId,roomName},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'RefreshToken':refreshToken
                  }
              })
              const data =res.data.data
              setcurrentRoom(data)
            //   console.log(data);
              navigate(`/room/${roomId}`,{state:{roomName:roomName}})
              toast.success("New room created",toastOptions)
            
          } catch (error) {
            console.log(error);
            const data =error?.response?.data
            toast.error(data?.message);
          }
    }


    const joinRoom= async (roomId) => {
        try {
            if (roomId.trim()=="") {
                toast.error("Room id is required")
                return;
            }
            let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
            const res = await axios.get(`${server}/api/v1/rooms/joinRoom/${roomId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'RefreshToken':refreshToken
                  }
              })
              const data =res.data.data
              setcurrentRoom(data)
            //   console.log(data);
              navigate(`/room/${roomId}`,{state:{roomName:data?.roomName}})
              toast.success(`Joined room "${data.roomName}"`,toastOptions)
            
          } catch (error) {
            console.log(error);
            const data =error?.response?.data
            toast.error(data?.message);
          }
    }


    const checkRoom= async (roomId) => {
        try {
            // if (roomId.trim()=="") {
            //     toast.error("Room id is required")
            //     return;
            // }
            let accessToken=Cookies.get('access-Token');
        let refreshToken=Cookies.get('refresh-Token');
            const res = await axios.get(`${server}/api/v1/rooms/checkRoom/${roomId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'RefreshToken':refreshToken
                  }
              })
              const data =res.data.data
              setcurrentRoom(data)
            //   console.log(data);
            //   navigate(`/room/${roomId}`,{state:{roomName:data?.roomName}})
            //   toast.success(`Joined room "${data.roomName}"`,toastOptions)
            
          } catch (error) {
            navigate("/")
            console.log(error);
            // const data =error?.response?.data
            // toast.error(data?.message);
          }
    }


    return (
        <AppContext.Provider value={{
            copyRoomId,
            toastOptions,
            toastOptions2,
            generateRandomColor,
            server,
            register,
            userLogin,
            userLogout,
            userDetails,
            userData,
            createRoom,
            currentRoom,
            setcurrentRoom,
            joinRoom,
            checkRoom,
            rooms
        }}>
            {props.children}
        </AppContext.Provider>
    )
}