import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppState = createContext();

const AppStateProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [ lastSeen, setLastSeen ] = useState(null);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);
      if (userData.avatar && userData.name) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }

      const now = Date.now();
      if (lastSeen !== now) { // ONly update if necessary
        await updateDoc(userRef, { lastSeen: now});
          lastSeen(now);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Failed to load user info. Please try again.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (auth.chatUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const now = Date.now();
        if (lastSeen !== now) { // Check if we need to update
          await updateDoc(userRef, { lastSeen:now });
          setLastSeen(now);
        }
      }
    }, 300000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [lastSeen]); // depend on lastseen to update correctly

  const value = {
    userData,setUserData,
    chatData,setChatData,
    loadUserData,
  };

  return (
    <AppState.Provider value={value}>
      {props.children}
    </AppState.Provider>
  );
};

export default AppStateProvider;