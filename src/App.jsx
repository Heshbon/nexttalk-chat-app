import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login"; 
import Chat from "./pages/Chat/Chat"; 
import Update from "./pages/Profile/Profile"; 
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { onAuthStateChanged } from "firebase/auth"; 
import { auth } from "./config/firebase"; 
import { AppState } from "./context/AppState"; 

const App = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { loadUserData, setChatUser,setThreadsId} = useContext(AppState);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        loadUserData(user.uid); // Load user data from Firestore using UID
        } else {
          setChatUser({})
          setThreadsId(null)
          navigate('/')
        }
      })
    }, [])

  return (
    <>
      <ToastContainer /> // Toast notification container
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/profile" element={<Update />} />
      </Routes>
      </>
      )
    };

export default App; // Exporting the App component