import React, { useContext, useState } from 'react';
import './Leftbar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppState } from '../../context/AppState';

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
  const { userData, chatData} = useContext(AppState);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = debounce(async (e) => {
    const input = e.target.value.trim(); // Trim whitespace
    setUser(null); // Reset user when input changes

    try {
      if (input && /^[a-zA-Z0-9_]+$/.test(input)) { // Validate input
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', '==', input.toLowerCase()));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && userData && querySnap.docs[0].data().id !== userData.id) {
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null); // reset user if conditions are not met
        }
      } else {
        setShowSearch(false); // Hide search if input is invalid or empty
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, 300); // Adjust the delay as needed

  const addChat = async () => {
    const threadRef = collection(db,'threads');
    const sessionsRef = collection(db,'sessions');
    try {
      const newThreadRef = doc(threadRef);
      await setDoc(newThreadRef,{
        createAt:serverTimestamp(),
        threads: []
      });

      await updateDoc(doc(sessionsRef, user.id),{
        chatsData:arrayUnion({
          threadId:newThreadRef.id,
          lastThread:'',
          rId:userData.id,
          updateAt:Date.now(), // consistent field passing
          threadSeen:true
        })
      });
      await updateDoc(doc(sessionsRef, userData.id),{
        chatsData:arrayUnion({
          threadId:newThreadRef.id,
          lastThread:'',
          rId:user.id,
          updateAt:Date.now(), 
          threadSeen:true
        })
      });
    } catch (error) {
      
    }
  };

  return (
    <div className='lb'>
      <div className="lb-top">
        <div className="lb-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => { console.log("Clicked Edit Profile"); navigate('/profile'); }}>Edit profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="lb-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search here..' />
        </div>
      </div>
      <div className="lb-list">
        {showSearch && user ? (
          <div onClick={addChat} className='contacts add-user'>
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          (chatData && chatData.length > 0) ? chatData.map((item, index) => (
            <div key={index} className='contacts'>
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastThread}</span>
              </div>
            </div>
          )) : <p>No chats available</p> // fallback message
        )}
      </div>
    </div>
  );
};

export default Leftbar;