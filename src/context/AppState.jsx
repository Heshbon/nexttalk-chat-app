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
  const [threadsId, setThreadsId] = useState(null);
  const [threads, setThreads] = useState({});
  const [chatUser, setChatUser] = useState({});
  const [ chatVisible, setChatVisible] = useState(false);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setUserData(userData);
      if (userData) {
        setChatUser(userData);
        navigate('/chat');
      }
      else {
        navigate("/profile"); 
      }

      await updateDoc(userRef, {
        lastSeen: Date.now()
      })
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now()
          })
        }
      }, 300000);
     } catch (error) {
      toast.error("Failed to load user info. Please try again.");
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatLogs = res.data().chatsData;
        const tempValue = [];
        for (const item of chatLogs) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempValue.push({ ...item, userData });
        }

          setChatData(tempValue.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      
      return () => unSub(); // Unsubscribe when the component unmounts
    }
  }, [userData]);
  
  // // useEffect(() => {
  // //   if (userData) {
  // //     const chatRef = doc(db, "chats", userData.id);
  // //     const unSub = onSnapshot(chatRef, async (res) => {
  // //       const chatLogs = res.data().chatsData;
  // //       const tempValue = [];
  // //       for (const item of chatLogs) {
  // //         const userRef = doc(db, "users", item.rId);
  // //         const userSnap = await getDoc(userRef);
  // //         const userData = userSnap.data();
  // //         tempValue.push({ ...item, userData });
  // //       }
  // //       setChatData(tempValue.sort((a, b) => b.updatedAt - a.updatedAt));
  // //     }, 12000);
  // //   }
  // }, [userData]);
  
  const value = {
    userData, setUserData,
    chatData,
    loadUserData,
    threadsId,
    setThreadsId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
    threads,
    setThreads,
  };
  
  return <AppState.Provider value={value}>{props.children}</AppState.Provider>
};

  export default AppStateProvider;