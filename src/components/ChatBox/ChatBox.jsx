import React, { useContext, useEffect, useState } from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { AppState } from '../../context/AppState';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const ChatBox = () => {

  const {userData, threadsId, chatUser, threads, setThreads} = useContext(AppState);
  const [input, setInput] = useState('');

  // Function to post a message to the chat
  const postMessage = async () => {
    try {
      
      if (input && threadsId) {
        await updateDoc(doc(db, 'threads', threadsId),{
          threads: arrayUnion({
            sId:userData,
            text:input,
            createAt:new Date(),
          }),
        });

        const userIDs = [chatUser.rId,userData.id];
        const userChatsRef = doc(db, 'chats',userIDs.join('_'));
        const userChatsSnapshot = await getDoc(userChatsRef);

        // Update the chat data if it exists
        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chatsData.findIndex((c) => c.threadId === threadsId);
          if (chatIndex !== -1) {
          userChatData.chatsData[chatIndex].lastThread = input.slice(0,30);
          userChatData.chatsData[chatIndex].updateAt = Date.now();
          if (userChatData.chatsData[chatIndex].rId === userData.id) {
            userChatData.chatsData[chatIndex].threadSeen = false;
          }

          await updateDoc(userChatsRef, {
            chatsData: userChatData.chatsData,
          });
        }
      }

      // Clear input after posting
      setInput('');
    }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  // Use effect to listen for changes in the thread
  useEffect(() => {
    if (threadsId) {
      const unSub = onSnapshot(doc(db,'threads',threadsId),(res) =>{
        setThreads(res.data().threads.reverse())
        console.log(res.data().threads.reverse());
      });
      return () => {
        unSub(); // Cleanup on the component unmount
      };
    }
  },[threadsId])

  // Function to handle key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      postMessage();
    }
  };

  return chatUser ? (
    <div className='Chat-bar'>
      <div className='Chat-user'>
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} <img className='dot' src={assets.bluedot_icon} alt='' /></p>
        <img src={assets.help_icon} className='Help' alt="" />
      </div>
      
      <div className='chat-post'>
        {threads.map((thread, index) =>(
          <div key={index} className={thread.sId === userData.id ? 'r-post' : 't-post'}>
            <p className='post'>{thread.text}</p>
          <div>
            <img src={thread.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
            <p>{new Date(thread.createAt).toLocaleTimeString()}</p> {/* Format timestamp */}
          </div>
        </div>
        ))}
      </div>
      
      <div className="chat-data">
        <input 
        type="text" 
        placeholder='Post a Message'
        onChange={(e) => setInput(e.target.value)}
        value={input}
        onKeyPress={handleKeyPress}
        />
        <input type="file" id='image' accept='image/jpeg, image/png' hidden/>
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={postMessage} src={assets.send_icon} alt="" /> {/* Trigger postMessage on click */}
      </div>
    </div>
  ) : (
  <div className='hello-there'>
    <img src={assets.logo} alt='' />
    <p>Chat Messaging, Simplified</p>
  </div>
  );
}

export default ChatBox;