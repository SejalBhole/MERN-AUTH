import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPass from './pages/ResetPass'
import {ToastContainer} from 'react-toastify'
import'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <>
     <ToastContainer/>  
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPass/>}/>        
      </Routes>
    </>
  )
}

export default App
