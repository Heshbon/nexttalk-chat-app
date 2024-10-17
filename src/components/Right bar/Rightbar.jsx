import React from 'react';
import './Rightbar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';

const Rightbar = () => {

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='rb'>
      <div className="rb-profile">
        <img src={assets.erik} alt="Profile" />
        <h3>Erik Beth <img src={assets.bluedot_icon} className='dot' alt="Active status" /></h3>
        <p>Hello, I am Erik and glad to connect with you.</p>
      </div>
      <hr />
      <div className='rb-media'>
        <p>Media</p>
        <div className='media-gallery'>
          <img src={assets.photo1} alt="Media 1" />
          <img src={assets.pict2} alt="Media 2" />
          <img src={assets.pict3} alt="Media 3" />
          <img src={assets.pict4} alt="Media 4" />
          <img src={assets.photo1} alt="Media 5" />
          <img src={assets.pict2} alt="Media 6" />
        </div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Rightbar;