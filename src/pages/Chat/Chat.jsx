import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import Leftbar from '../../components/Left bar/Leftbar'; // Import Leftbar component
import Rightbar from '../../components/Right bar/Rightbar'; // Import Rightbar component
import ChatBox from '../../components/ChatBox/ChatBox'; // Import ChatBox component
import { AppState } from '../../context/AppState'; // Import AppState context

const Chat = () => {
  // Destructure chatData and userData from AppState context
  const { chatData, userData } = useContext(AppState);
  const [fetching, setFetching] = useState(true); // State to manage loading

  // Effect to check if data has been fetched
  useEffect(() => {
    console.log('chatData:', chatData);
    console.log('userData:', userData);
    if (chatData.length > 0 && userData) {
      setFetching(false); // Stop fetching if data is available
    }
  }, [chatData, userData]);

  return (
    <div className='Chat'>
      {
        fetching
          ? <p className='fetching'>fetching...</p> // Show loading message
          : <div className="chat-container">
              <Leftbar /> // Render Leftbar component
              <ChatBox /> // Render ChatBox component
              <Rightbar /> // Render Rightbar component
            </div>
      }
    </div>
  );
};

export default Chat; // Export Chat component