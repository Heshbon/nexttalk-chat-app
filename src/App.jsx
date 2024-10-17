import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login"; // Importing the Login component
import Chat from "./pages/Chat/Chat"; // Importing the Chat component
import Update from "./pages/Profile/Profile"; // Importing the Profile component
import { ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Importing toast notification styles
import { onAuthStateChanged } from "firebase/auth"; // For auth state management
import { auth } from "./config/firebase"; // Importing firebase auth configuration
import AppStateProvider, { AppState } from "./context/AppState"; // Importing AppState provider and context

const App = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { loadUserData, userData } = useContext(AppState); // Accessing state and actions from AppState context

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid); // Load user data from Firestore using UID

        // Redirect based on profile completion
        if (userData && userData.name && userData.avatar) {
          navigate("/chat"); // Navigate to chat if profile data is complete
        } else {
          navigate("/profile"); // Navigate to profile if data is incomplete
        }
      } else {
        navigate("/"); // Navigate to login if user is not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate, loadUserData, userData]); // Dependencies for useEffect

  return (
    <AppStateProvider> // Providing AppState context to the app
      <ToastContainer /> // Toast notification container
      <Routes>
        <Route path="/" element={<Login />} /> // Route for login page
        <Route path="/chat" element={<Chat />} /> // Route for chat page
        <Route path="/profile" element={<Update />} /> // Route for profile page
      </Routes>
    </AppStateProvider>
  );
};

export default App; // Exporting the App component