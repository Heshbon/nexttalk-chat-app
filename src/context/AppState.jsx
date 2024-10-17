import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppState = createContext();

const AppStateProvider = (props) => {
  const navigate = useNavigate(); // For navigation to the app
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [lastSeen, setLastSeen] = useState(Date.now());
  const [threadsId, setThreadsId] = useState(null);
  const [threads, setThreads] = useState(null);
  const [chatUser, setChatUser] = useState(null);

  // load user data and handle navigation
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("User not found");
      }
      
      const userData = userSnap.data();
      setUserData(userData);

      // navigate based on profile completeness
      if (userData.avatar && userData.name) {
        navigate("/chat"); // navigate to chat if complete
      } else {
        navigate("/profile"); // navigate to profile if incomplete
      }

      // update the last seen timestamp if necessary
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

  // use a single interval for lastSeen updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (auth.chatUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const now = Date.now();
        if (lastSeen !== now) {
          // Check if we need to update lastSeen
          await updateDoc(userRef, { lastSeen: now });
          setLastSeen(now);
        }
      }
    }, 300000); // update every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [lastSeen]); // depend on lastseen to update correctly

  // optimize chat data loading
  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(
        chatRef,
        async (res) => {
          const chatLogs = res.data()?.chatsData || []; // handle undefined chatsData
          
          // Use Promise.all to fetch data in parallel
          const userPromises = chatLogs.map(async (item) => {
            const userRef = doc(db, "users", item.rId);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            return { ...item, userData };
          });

          // Wait for all user data to be fetched
          const results = await Promise.all(userPromises);
          setChatData(results.sort((a, b) => b.updatedAt - a.updatedAt)); // sort recent chats on top
        },
        (error) => {
          console.error("Snapshot error", error);
        }
      );

      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData, setUserData,
    chatData, setChatData,
    loadUserData,
  };

  return <AppState.Provider value={value}>{props.children}</AppState.Provider>;
};

export default AppStateProvider;