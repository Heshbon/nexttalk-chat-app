import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Update from './pages/Profile/Profile'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import AppStateProvider, {AppState} from './context/AppState'

const App = () => {

  const navigate = useNavigate();
  const {loadUserInfo} = useContext(AppState)

  useEffect(()=> {
    onAuthStateChanged(auth, async (user)=> {
      if (user) {
        navigate('/chat')
        await loadUserInfo(user.uid)
      }
      else {
        navigate('/')
      }
    })
  },[])
  return (
    <AppStateProvider>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<Update/>}/>
      </Routes>
    </AppStateProvider>
  )
}

export default App