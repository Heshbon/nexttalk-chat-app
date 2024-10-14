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
      await updateDoc(userRef, {
        lastSeen: Date.now()
      });
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Failed to load user info. Please try again.');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (auth.chatUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          lastSeen: Date.now()
        });
      }
    }, 60000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const value = {
    userInfo,setUserInfo,
    chatInfo,setChatInfo,
    loadUserInfo,
  };

  return (
    <AppState.Provider value={value}>
      {props.children}
    </AppState.Provider>
  );
};

export default AppStateProvider;
