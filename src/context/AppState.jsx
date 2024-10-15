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

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();
      setUserData(userData);

      if (userData.avatar && userData.name) {
        navigate('/chat');
      } else {
        navigate('/profile');
      }

      const now = Date.now();
      await updateDoc(userRef, { lastSeen: now });
      setLastSeen(now);
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Failed to load user info. Please try again.');
    }
  };

  useEffect(() => {
    // Ensure auth.currentUser is not null before accessing uid
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUserData(userData);

          if (userData.avatar && userData.name) {
            navigate('/chat');
          } else {
            navigate('/profile');
          }

          const now = Date.now();
          if (lastSeen !== now) {
            updateDoc(userRef, { lastSeen: now });
            setLastSeen(now);
          }
        }
      });

      return () => unsubscribe();
    } else {
      // Handle case where user is not logged in
      navigate('/login'); // Redirect to login page or handle accordingly
    }
  }, [lastSeen, navigate]);

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, 'chats', userData.id);
      const unsubscribe = onSnapshot(chatRef, async (chatSnap) => {
        const chatLogs = chatSnap.data()?.chatsData || [];

        const userPromises = chatLogs.map(async (item) => {
          const userRef = doc(db, 'users', item.rId);
          const userSnap = await getDoc(userRef);
          return { ...item, userData: userSnap.data() };
        });

        const chatWithUserData = await Promise.all(userPromises);
        setChatData(chatWithUserData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => unsubscribe();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
  };

  return (
    <AppState.Provider value={value}>
      {props.children}
    </AppState.Provider>
  );
};

export default AppStateProvider;