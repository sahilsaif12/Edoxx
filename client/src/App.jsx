import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './components/SignUp/SignUp.jsx'
import Home from './components/Home/Home.jsx'
import { Toaster } from 'react-hot-toast'
import CodeEditor from './components/Editor/CodeEditor.jsx'
import TextEditor from './components/Editor/TextEditor.jsx'
import Room from './components/Editor/Room.jsx'
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute.jsx'
import SignUpPrivateRoute from './utils/SignUpPrivateRoute.jsx'
import NotFound from './utils/NotFound.jsx'

function App() {

  return (
    <>

      {/* <SignUp/> */}
      {/* <Home/> */}
      {/* <CodeEditor/> */}
      {/* <TextEditor/> */}
      <Routes>
        <Route path='/signup' exact  element={<SignUpPrivateRoute Component={SignUp} /> }   />
        <Route path='/' exact element={<PrivateRoute Component={Home} /> }  />
        <Route path='/room/:roomId' exact element={<PrivateRoute Component={Room} /> }  />
        {/* <Route path='*' exact={true} element={<PrivateRoute Component={Home} /> }  /> */}
        <Route path="*"   element={<NotFound/>} />
        </Routes>
      {/* <Room/> */}
      
      <Toaster   position="bottom-center"/>
    </>
  )
}

export default App
