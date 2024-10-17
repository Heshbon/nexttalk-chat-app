import React, { useContext, useState } from 'react';
import './Leftbar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppState } from '../../context/AppState';

// Debounce function to optimize input handling (reduce unnecessary API calls)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const Leftbar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setChatUser, setThreadsId } = useContext(AppState); // Destructured context
  const [user, setUser] = useState(null); // Searched user state
  const [showSearch, setShowSearch] = useState(false); // Toggle for search view
  const [error, setError] = useState(null); // Error handling state

  // Input handler with debounce to fetch user data based on search input
  const inputHandler = debounce(async (e) => {
    const input = e.target.value.trim().toLowerCase(); // Sanitize input
    setUser(null); // Reset the user state on every change
    setError(null); // Clear error state on input change

    try {
      if (input && /^[a-zA-Z0-9_]+$/.test(input)) { // Validate input for allowed characters
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', '==', input)); // Query for the username in Firestore
        const querySnap = await getDocs(q);

        if (!querySnap.empty && userData && querySnap.docs[0].data().id !== userData.id) {
          setUser(querySnap.docs[0].data()); // Set the fetched user data
        } else {
          setUser(null); // No user found
        }
      } else {
        setShowSearch(false); // Hide search result if input is invalid
      }
    } catch (error) {
      console.error("Error fetching user:", error); // Log error
      setError('Error fetching user data'); // Set error message
    }
  }, 300); // Debounce delay of 300ms

  // Function to add a chat session
  const addChat = async () => {
    if (!user) return; // Ensure user exists before proceeding
    try {
      const threadRef = collection(db, 'threads');
      const newThreadRef = doc(threadRef); // Create new thread doc reference

      // Create a new thread document in Firestore
      await setDoc(newThreadRef, {
        createAt: serverTimestamp(),
        threads: [],
      });

      const sessionRef = collection(db, 'sessions');
      
      // Add chat data for the selected user
      await updateDoc(doc(sessionRef, user.id), {
        chatsData: arrayUnion({
          threadId: newThreadRef.id,
          lastThread: '',
          rId: userData.id,
          updateAt: serverTimestamp(),
          threadSeen: true,
        }),
      });

      // Add chat data for the current user
      await updateDoc(doc(sessionRef, userData.id), {
        chatsData: arrayUnion({
          threadId: newThreadRef.id,
          lastThread: '',
          rId: user.id,
          updateAt: serverTimestamp(),
          threadSeen: true,
        }),
      });

      setUser(null); // Reset the search field after adding chat
      setShowSearch(false);
    } catch (error) {
      console.error("Error adding chat:", error);
      setError('Failed to add chat'); // Display error message
    }
  };

  // Set the selected chat when clicked
  const setChat = (item) => {
    setThreadsId(item.threadId); // Set the current thread
    setChatUser(item); // Set the selected chat user
  };

  return (
    <div className="lb">
      <div className="lb-top">
        <div className="lb-nav">
          <img src={assets.logo} className="logo" alt="App Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu Icon" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>

        <div className="lb-search">
          <img src={assets.search_icon} alt="Search Icon" />
          <input onChange={inputHandler} type="text" placeholder="Search here..." />
        </div>
      </div>

      <div className="lb-list">
        {error && <p className="error">{error}</p>} {/* Display error message if any */}

        {/* Display user search results */}
        {showSearch && user ? (
          <div onClick={addChat} className="contacts add-user">
            <img src={user.avatar} alt="User Avatar" />
            <p>{user.name}</p>
          </div>
        ) : (
          chatData && chatData.length > 0 ? (
            chatData.map((item, index) => (
              <div onClick={() => setChat(item)} key={index} className="contacts">
                <img src={item.userData.avatar} alt="User Avatar" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastThread}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No chats available</p> // Fallback message if no chats
          )
        )}
      </div>
    </div>
  );
};

export default Leftbar;