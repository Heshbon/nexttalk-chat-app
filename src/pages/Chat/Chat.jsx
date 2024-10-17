import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import Leftbar from '../../components/Left bar/Leftbar'
import Rightbar from '../../components/Right bar/Rightbar'
import ChatBox from '../../components/ChatBox/ChatBox'
import { AppState } from '../../context/AppState'

const Chat = () => {

  const {chatData, userData} = useContext(AppState);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    console.log('chatData:', chatData);
    console.log('userData:', userData);
    if (chatData.length > 0 && userData) {
      setFetching(false)
    }
  },[chatData,userData])

  return (
    <div className='Chat'>
      {
        fetching
        ?<p className='fetching'>fetching...</p>
        : <div className="chat-container">
          <Leftbar />
          <ChatBox />
          <Rightbar />
        </div>
      }
    </div>
  )
}

export default Chat;