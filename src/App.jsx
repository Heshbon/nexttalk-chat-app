import React, { useContext, useEffect, useReducer, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import Update from "./pages/Profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import AppStateProvider, { AppState } from "./context/AppState";

const App = () => {
  const navigate = useNavigate();
  const { loadUserData, userData } = useContext(AppState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid); // Load user data first

        // redirect based on profile completion
        if (userData && userData.name && userData.avatar) {
          navigate("/chat"); // navigate to chat if data is complete
        } else {
          navigate("/profile"); // navigate to profile if data is incomplete
        }
      } else {
        navigate("/"); // Navigate to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate, loadUserData, userData]); // keep dependencies minimal

  return (
    <AppStateProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Update />} />
      </Routes>
    </AppStateProvider>
  );
};

export default App;
