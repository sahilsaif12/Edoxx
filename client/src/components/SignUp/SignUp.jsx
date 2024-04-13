import React, { useContext, useEffect, useRef, useState } from 'react'
import logo from '../../assets/logo.png'
import AppContext from '../../context/AppContext'
import Loader from '../../utils/Loader'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
function SignUp() {
    const [login, setlogin] = useState(true)
    const [passwordShow, setpasswordShow] = useState(false)
    const [email, setemail] = useState('')
    const [name, setname] = useState('')
    const [password, setpassword] = useState('')
    const [gender, setgender] = useState(null)
    const [loading, setloading] = useState(false)

    const { register, userLogin,server } = useContext(AppContext)
const navigate=useNavigate()
    const handleLoginSignupSwitch = async () => {
        setlogin(!login)
        setemail('')
        setname('')
        setpassword('')

    }
    // useEffect(() => {
    //     let n = {
    //         data
    //     }
    //     Cookies.set("name", n)
    // }, [])

    const loginOrSignUp = async () => {
        setloading(true)
        if (login) {
               await userLogin(email,password)
            setloading(false)

        } else {
            await register(email, name, gender, password)
            setloading(false)
        }

    }

    const copyToClipboard =(text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
        toast.success("Copied")

    }
    return (
        <div class="bg-gray-20 w-screen  flex justify-center items-center h-screen  font-sans text-gray-300">
        <div className="absolute top-0 right-0 bg-gray-900 text-gray-400 border border-purple-700  p-2 rounded-md">
        <div className="text-lg my-1 text-gray-500">Testing credentials </div>
        <div onClick={()=>copyToClipboard("example123@gmail.com")} className="text-base p-2 flex justify-between items-center rounded hover:bg-gray-800 gap-3">Email: example123@gmail.com <ion-icon name="copy" style={{paddingTop:"3px",cursor:"pointer"}}  ></ion-icon>  </div>
        <div onClick={()=>copyToClipboard("123456")} className="text-base p-2 flex items-center justify-between rounded hover:bg-gray-800 gap-3">password: 123456 <ion-icon name="copy" style={{paddingTop:"3px",cursor:"pointer"}}  ></ion-icon>  </div>
            
        </div>
            <div class=" mx-auto bg p-8 w-1/2 flex">
                <div class="max-w-md w-full   mx-auto">

                    <div class=" border-y-4 border-indigo-700 glassDesign rounded-lg overflow-hidden shadow-dxl  shadow-indigo-800">
                        {loading && <Loader />}
                        <div className="flex my-4 items-center justify-evenl gap-6">
                            <img src={logo} alt="" className='w-20 ml-5 ' />
                            <h1 class="text-3xl Comfortaa  tracking-widest">Edoxx</h1>
                        </div>
                        <div class="p-8 py-">
                            <div class="mb-3">
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-400">Email</label>

                                <input type="text" value={email} onChange={(e) => setemail(e.target.value)} name="email" class="block w-full p-3 rounded bg-gray-950/60  border-2 border-transparent border-b-slate-600  focus:border-indigo-600 focus:outline-none" />
                            </div>
                            {
                                !login &&

                                <div class="mb-3 ">
                                    <label for="name" class="block mb-2 text-sm font-medium text-gray-400">Name</label>

                                    <input type="text" value={name} onChange={(e) => setname(e.target.value)} name="name" class="block w-full p-3 rounded bg-gray-950/60  border-2 border-transparent border-b-slate-600  focus:border-indigo-600 focus:outline-none" />
                                </div>
                            }

                            {
                                !login &&
                                <div className="mb-3 flex gap-4 ">
                                    <label onClick={() => setgender('male')} for="male" class="block cursor-pointer mb-2 text-sm font-medium text-gray-400">Male</label>
                                    <input onClick={() => setgender('male')} type="radio" id='male' name="radio-2" className="radio bg-transparent  cursor-pointer radio-secondary" />
                                    <label onClick={() => setgender('female')} for="female" class="block mb-2 cursor-pointer text-sm font-medium text-gray-400">Female</label>
                                    <input onClick={() => setgender('female')} type="radio" id='female' name="radio-2" className="radio  bg-transparent  cursor-pointer radio-secondary" />
                                </div>
                            }
                            <div class="mb-5">
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-400">Password</label>
                                <div className="flex items-center gap-3">

                                    <input type={`${passwordShow ? "text" : "password"}`} value={password} onChange={(e) => setpassword(e.target.value)} name="password" class="block w-full p-3 rounded  bg-gray-950/60 border-b-2 border-b-slate-600 focus:border-2 focus:border-indigo-600 focus:outline-none" />
                                    {passwordShow ?
                                        <ion-icon onClick={() => setpasswordShow(!passwordShow)} size="large" style={{ color: "gray", cursor: "pointer" }} name="eye-off-outline"></ion-icon>
                                        : <ion-icon onClick={() => setpasswordShow(!passwordShow)} size="large" style={{ color: "gray", cursor: "pointer" }} name="eye-outline"></ion-icon>
                                    }
                                </div>
                            </div>

                            <button onClick={loginOrSignUp} class="w-full p-3 my-4 focus:outline-none hover:bg-indigo-600/90 bg-indigo-600 text-white rounded shadow border-none">{`${login ? "Log in" : "Sign up"}`}</button>

                            <div class="flex justify-between p-8 text-sm bg-gray-10">
                                <span onClick={handleLoginSignupSwitch} class="cursor-pointer hover:text-indigo-200 font-medium text-indigo-400">{`${login ? "Create account" : "Already have account?"}`}</span>

                                <span onClick={()=>toast.error("Forget password not implemented yet")} class="cursor-pointer hover:text-indigo-200 text-gray-500">Forgot password?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp