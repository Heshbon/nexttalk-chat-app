import React from 'react'
import './Chat.css'
import Leftbar from '../../components/Left bar/Leftbar'
import Rightbar from '../../components/Right bar/Rightbar'
import ChatBox from '../../components/ChatBox/ChatBox'

const Chat = () => {
  return (
    <div className='Chat'>
      <div className="chat-container">
        <Leftbar />
        <ChatBox/>
        <Rightbar />
      </div>
    </div>
  )
}

export default Chat