import React, { useContext, useEffect, useState } from 'react';
import './Leftbar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, getDoc, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, logout } from '../../config/firebase';
import { AppState } from '../../context/AppState';

const Leftbar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, setThreadsId, threadsId, chatVisible, setChatVisible } = useContext(AppState);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', '==', input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const addChat = async () => {
    const threadRef = collection(db, 'threads');
    const chatsRef = collection(db, 'chats');
    try {
      // Check if user exists and is not the current user
      if (user && user.id === userData.id) {
        return 0;
      }
      const newThreadRef = doc(threadsRef);

      await setDoc(newThreadRef, {
        createAt: serverTimestamp(),
        threads: []
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          threadId: newThreadRef.id,
          lastThread: '',
          rId: user.id,
          updatedAt: Date.now(),
          threadSeen: true
        }),
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion(chatData)
      });
      
      // Fetch user data and set the chat state
      const uSnap = await getDoc(doc(db, 'users', user.id));
      const uData = uSnap.data();
      setChat({
        threadId: newThreadRef.id,
        lastThread: '',
        rId: user.id,
        updatedAt: new Date(),
        threadSeen: true,
        userData: uData,
      });
      setShowSearch(false);
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setChat = async (item) => {
    setThreadsId(item.threadId);
    setChatUser(item);
    const userChatsRef = doc(db, "chats", userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();

    const chatIndex = userChatsData.chatsData.findIndex((c) => c.threadId === item.threadId);
    if (chatIndex !== -1) {
    userChatsData.chatsData[chatIndex].threadSeen = true;
    userChatsData.chatsData[chatIndex].updateAt = serverTimestamp();
    await updateDoc(userChatsRef, {
      chatsData: userChatsData.chatsData,
    });
  }
  
    setChatVisible(true);
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      if (chatUser && chatUser.userData) { // Check if chatUser and userData are defined
        const userRef = doc(db, "users", chatUser.userData.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setChatUser(prev => ({ ...prev, userData: userData }));
      }
    };
    updateChatUserData();
  }, [chatData]);

  return (
    <div className={`lb ${chatVisible ? "hidden" : ""}`}>
      <div className="lb-top">
        <div className="lb-nav">
          <img src={assets.logo} className="logo" alt="App Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu Icon" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>
        <div className="lb-search">
          <img src={assets.search_icon} alt="Search Icon" />
          <input onChange={inputHandler} type="text" placeholder="Search here..." />
        </div>
      </div>

      <div className="lb-list">
        {showSearch && user ? (
          <div onClick={addChat} className="contacts add-user">
            <img src={user.avatar} alt="User Avatar" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData && chatData.length > 0 ? (
            chatData.map((item, index) => (
              <div onClick={() => setChat(item)} key={index} className={`contacts ${item.threadSeen || item.threadId === threadsId ? "" : "border"}`}>
                <img src={item.userData.avatar} alt="User Avatar" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastThread}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No chats available</p>
          )
        )}
      </div>
    </div>
  );
};

export default Leftbar;