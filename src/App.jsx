import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Update from './pages/Profile/Profile'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppState } from './context/AppState'

const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppState)
  useEffect(()=> {
    onAuthStateChanged(auth, async (user)=> {
      if (user) {
        navigate('/chat')
        await loadUserData(user.uid)
      }
      else {
        navigate('/')
      }
    })
  },[])
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<Update/>}/>
      </Routes>
    </>
  )
}

export default App