import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import Leftbar from '../../components/Left bar/Leftbar';
import Rightbar from '../../components/Right bar/Rightbar';
import ChatBox from '../../components/ChatBox/ChatBox';
import { AppState } from '../../context/AppState';

const Chat = () => {
  // Destructure chatData and userData from AppState context
  const { chatData, userData } = useContext(AppState);
  const [fetching, setFetching] = useState(true); // State to manage loading

  // Effect to check if data has been fetched
  useEffect(() => {
    if (chatData && userData) {
      setFetching(false);
      } else {
        setFetching(true); // Keep fetching if data is not available
      }
    }, [chatData, userData]);
    
    return (
    <div className='Chat'>
      {fetching
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