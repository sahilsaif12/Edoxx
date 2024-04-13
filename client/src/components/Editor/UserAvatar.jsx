import React, { useContext } from 'react'
import Avatar, { genConfig } from 'react-nice-avatar'
import AppContext from '../../context/AppContext'

function UserAvatar({gender,name,id,avatar}) {
  const{userData}=useContext(AppContext)
  // const{avtName,bgColor,hairColor,shirtColor}=avatar
    // let manAv=["boy", "man", "male1","male2","male3","male7","boy2","boy99"]
    const initialConfig = genConfig(avatar?.avtName)
    const config = genConfig({ ...initialConfig, sex: gender=="male" ? "man" : "woman", hairColor:avatar?.hairColor, bgColor:avatar?.bgColor, shirtColor:avatar?.shirtColor })
  return (
    <div className='flex flex-col items-center '>
        <Avatar shape='rounded' className="w-16 h-16 cursor-pointe outline  outline-1 outline-offset-2 outline-purple-600 "  {...config} />
        <div className='text-l text-center mt-1 text-cyan-100'>{name?.split(" ")[0].substring(0,11) }  {userData?._id==id && "(me)"}  </div>
    </div>
  )
}

export default UserAvatar