import { doc, getDoc, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppState = createContext();

const AppStateProvider = (props) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({name: '', avatar: '', info: '',});
  const [chatInfo, setChatInfo] = useState(null);

  const loadUserInfo = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userInfo = userSnap.data();
      setUserInfo(userInfo);
      if (userInfo && userInfo.avatar && userInfo.name) {
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
