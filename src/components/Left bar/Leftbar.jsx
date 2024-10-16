import React, { useContext, useState } from 'react';
import './Leftbar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppState } from '../../context/AppState';

const Leftbar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppState);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    const input = e.target.value;
    setUser(null); // Reset user when input changes

    try {
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where('username', '==', input.toLowerCase()));
        const querySnap = await getDocs(q);

        if (!querySnap.empty && userData && querySnap.docs[0].data().id !== userData.id) {
          setUser(querySnap.docs[0].data());
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
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
          <div className='contacts add-user'>
            <img src={user?.avatar} alt="" />
            <p>{user?.name}</p>
          </div>
        ) : (
          Array(13).fill('').map((_, index) => (
            <div key={index} className='contacts'>
              <img src={assets.precious} alt="" />
              <div>
                <p>Precious Angel</p>
                <span>Hey, how is life?</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leftbar;