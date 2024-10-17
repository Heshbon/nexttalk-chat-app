import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppState } from '../../context/AppState'
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const ChatBox = () => {

  const {userData, threadsId, chatUser, threads, setThreads} = useContext(AppState);

  const [input, setInput] = useState('');

  const postMessage = async () => {
    try {
      
      if (input && threadsId) {
        await updateDoc(doc(db,'threads', threadsId),{
          threads: arrayUnion({
            sId:userData,
            text:input,
            createAt:new Data()
          }
        })
        const userIDs = [chatUser.rId,userData.id];
      }
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if (threadsId) {
      const unSub = onSnapshot(doc(db,'threads',threadsId),(res) =>{
        setThreads(res.data().threads.reverse())
        console.log(res.data().threads.reverse());
      })
      return () => {
        unSub();
      }
    }
  },[threadsId])

  return chatUser ? (
    <div className='Chat-bar'>
      <div className='Chat-user'>
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.bluedot_icon} alt='' /></p>
        <img src={assets.help_icon} className='Help' alt="" />
      </div>
      
      <div className='chat-post'>
        <div className='t-post'>
          <p className='post'>Can’t wait for the disruptive force of innovation..</p>
          <div>
            <img src={assets.phin} alt="" />
            <p>3:00 AM</p>
          </div>
        </div>
        <div className='t-post'>
          <img className='post-img' src={assets.pict1} alt="" />
          <div>
            <img src={assets.phin} alt="" />
            <p>3:00 AM</p>
          </div>
        </div>
        <div className='r-post'>
          <p className='post'>Can’t wait for the disruptive force of innovation..</p>
          <div>
            <img src={assets.phin} alt="" />
            <p>3:00 AM</p>
          </div>
        </div>
      </div>
      <div className="chat-data">
        <input type="text" placeholder='Post a Message' />
        <input onChange={(e) => setInput(e.target.value)} value={input} type="file" id='image' accept='image/jpeg, image/png' hidden/>
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_icon} alt="" />
      </div>
    </div>
  )
  :<div className='hello-there'>
    <img src={assets.logo} alt='' />
    <p>Chat Messaging, Simplified</p>
  </div>
}

export default ChatBox;