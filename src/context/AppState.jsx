import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppState = createContext();

const AppStateProvider = (props) => {
  const navigate = useNavigate(); // for navigation to the app
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [lastSeen, setLastSeen ] = useState(Date.now());

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      setUserData(userData);

      // navigate based on profile completeness
      if (userData.avatar && userData.name) {
        navigate('/chat'); // navigate to chat if complete
      } else {
        navigate('/profile'); // navigate to profile if incomplete
      }
      
      const now = Date.now();
      if (lastSeen !== now) { // Only update if necessary
        await updateDoc(userRef, { lastSeen: now});
          setLastSeen(now);
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
    }, 300000); // update every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [lastSeen]); // depend on lastseen to update correctly

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, 'chats', userData.id);
      const unSub = onSnapshot(chatRef,async (res) => {
        const chatLogs = res.data()?.chatsData || []; // handle undefined chatsData
        const tempData = [];

        for (const item of chatLogs){
          const userRef = doc(db, 'users',item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({...item,userData});
        }
        setChatData(tempData.sort((a,b) => b.updatedAt - a.updatedAt)); // recent chats on top and old on bottom
      }, (error) => {
        console.error('Snapshot error', error);
      });

      return () => {
        unSub();
      };
    }
  }, [userData]);

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