import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppState = createContext();

const AppStateProvider = (props) => {
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [lastSeen, setLastSeen] = useState(Date.now());
  const [threadsId, setThreadsId] = useState(null);
  const [threads, setThreads] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("User not found");
      }

      const userData = userSnap.data();
      setUserData(userData);

      if (userData.avatar && userData.name) {
        navigate("/chat"); 
      } else {
        navigate("/profile"); 
      }

      const now = Date.now();
      if (lastSeen !== now) {
        await updateDoc(userRef, { lastSeen: now });
        setLastSeen(now);
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      toast.error("Failed to load user info. Please try again.");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const now = Date.now();
        if (lastSeen !== now) {
          await updateDoc(userRef, { lastSeen: now });
          setLastSeen(now);
        }
      }
    }, 300000);

    return () => clearInterval(intervalId);
  }, [lastSeen]);

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatLogs = res.data()?.chatsData || []; 

        const userPromises = chatLogs.map(async (item) => {
          const userRef = doc(db, "users", item.rId);
          try {
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            return { ...item, userData };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
          }
        });

        const results = await Promise.all(userPromises);
        setChatData(results.filter(item => item !== null).sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => unSub();
    }
  }, [userData]);

  const value = {
    userData, setUserData,
    chatData, setChatData,
    loadUserData,
    threads, setThreads,
    threadsId, setThreadsId,
    chatUser, setChatUser,
  };

  return <AppState.Provider value={value}>{props.children}</AppState.Provider>;
};

export default AppStateProvider;