import React, { useContext, useEffect, useState, useRef } from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { AppState } from '../../context/AppState';
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import upload from '../../lib/fileupload';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const { userData, threadsId, chatUser, threads, setThreads, chatVisible, setChatVisible } = useContext(AppState);
  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  const postThread = async () => {

    try {
      
      if (input && threadsId) {
        await updateDoc(doc(db, 'threads', threadsId), {
          threads: arrayUnion({
            sId: userData.id,
            text: input,
            createAt: new Date(),
          })
        })
        
        // Update the chats collection (chatsData)
        const userIDs = [chatUser.rId, userData.id];
        
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);
          
          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatsData.findIndex((c) => c.threadId === threadsId);
            userChatsData.chatsData[chatIndex].lastThread = input;
            userChatsData.chatsData[chatIndex].updateAt = Date.now();
            if (userChatsData.chatsData[chatIndex].rId === userData.id) {
              userChatsData.chatsData[chatIndex].threadSeen = false;
            }
            await updateDoc(userChatsRef, { chatsData: userChatsData.chatsData, });
          }
        })
      }
    } catch (error) { 
      toast.error('Error posting message: ' + error.message);
    }
    
    // Clear input after posting
    setInput('')
  }
  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return hour > 12 ? `${hour - 12}:${minute} PM` : `${hour}:${minute} AM`;
  };

  const postImage = async (e) => {
    
    const fileUrl = await upload(e.target.files[0])

    if (fileUrl && threadsId) {
      await updateDoc(doc(db, 'threads', threadsId), {
        threads: arrayUnion({
          sId: userData.id,
          Image: fileUrl,
          createdAt: new Date()
        })
      })
      
      const userIDs = [chatUser.rId, userData.id];
      
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'chats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chatsData.findIndex((c) => c.threadId === threadsId);          userChatsData.chatsData[chatIndex].lastThread = 'image';
          userChatsData.chatsData[chatIndex].updateAt = Date.now();
          await updateDoc(userChatsRef, { chatsData: userChatsData.chatsData, });
        }
      })
    }
  };
  
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads]);
  
  // Use effect to listen for changes in the thread
  useEffect(() => {
    if (threadsId) {
      const unSub = onSnapshot(doc(db, 'threads', threadsId), (res) => {
        setThreads(res.data().threads.reverse());
      });
      return () => {
        unSub(); // Cleanup on component unmount
        };
      }
    }, [threadsId]);
    
    return chatUser ? (
    <div className={'Chat-bar ${chatVisible ? "" : "hidden"}'}>
      <div className="Chat-user">
        <img src={chatUser ? chatUser.userData.avatar : assets.pict4} alt='' />
        <p>{chatUser ? chatUser.userData.name : 'shona'} {Date.now() - chatUser.userData.lastSeen <= 80000 ? <img className='dot' src={assets.bluedot_icon} alt='' /> : null}</p>
        <img onClick={() => setChatVisible(false)} className='arrow' src={assets.arrow_icon} alt="" />
        <img src={assets.help_icon} className="Help" alt="" />
        </div>
        <div className="chat-post">
          <div ref={scrollEnd}></div>
          { 
          threads.map((post, index) => {
            return (
              <div key={index} className={post.sId === userData.id ? 's-post' : 'r-post'}>
                {thread['image']
                ? <img className='post-img' src={post['image']} alt="" />
                : <p className='post'>{post['text']}</p>
              }
              <div>
                <img src={post.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
                <p>{convertTimestamp(post.createAt)}</p>
              </div>
            </div>
          )
        })
      }
    </div>
    <div className='chat-input'>
      <input onKeyDown={(e) => e.key === "Enter" ? postThread() : null} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Post a message' />
      <input onChange={postImage} type="file" id="image" accept="image/jpeg, image/png" hidden />
      <label htmlFor="image">
        <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={postThread} src={assets.send_icon} alt="" />
        </div>
      </div>
    ) : <div className={`hello-there ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt='' />
      <p>Chat Messaging, Simplified</p>
    </div>
  };

  export default ChatBox;