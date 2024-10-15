import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import Update from './pages/Profile/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import AppStateProvider, {AppState} from './context/AppState';

const App = () => {

  const navigate = useNavigate();
  const { loadUserData, setUserData } = useContext(AppState);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, async (user)=> {
      if (user) {
        await loadUserData(user.uid); // Load user data first
        setHasNavigated(true);
        navigate('/profile'); // navigate to profile after loadind data
      }
      else {
        if (!hasNavigated) {
          navigate('/'); // Navigate to login if not authenticated
          setHasNavigated(true);
        } 
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  },[navigate, loadUserData, hasNavigated, setUserData]); // keep dependencies minimal

  return (
    <AppStateProvider>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/chat' element={<Chat />}/>
        <Route path='/profile' element={<Update />}/>
      </Routes>
    </AppStateProvider>
  );
};

export default App