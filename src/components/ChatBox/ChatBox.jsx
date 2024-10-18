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
  const scrollEnd = useRef(null);

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return hour > 12 ? `${hour - 12}:${minute} PM` : `${hour}:${minute} AM`;
  };

  // Function to post a message to the chat
  const postMessage = async () => {
    if (input && threadsId) {
      try {
        // Update threads collection
        await updateDoc(doc(db, 'threads', threadsId), {
          threads: arrayUnion({
            sId: userData.id,
            text: input,
            createAt: new Date(),
          }),
        });

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

            await updateDoc(userChatsRef, { chatsData: userChatsData.chatsData });
          }
        });
      } catch (error) {
        toast.error('Error posting message: ' + error.message);
      }
      // Clear input after posting
      setInput('');
    }
  };

  const postImage = async (e) => {
    const fileUrl = await upload(e.target.files[0]);
    if (fileUrl && threadsId) {
      await updateDoc(doc(db, 'threads', threadsId), {
        threads: arrayUnion({
          sId: userData.id,
          Image: fileUrl,
          createAt: new Date(),
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'chats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chatsData.findIndex((c) => c.threadId === threadsId);
          userChatsData.chatsData[chatIndex].lastThread = 'image';
          userChatsData.chatsData[chatIndex].updateAt = Date.now();
          await updateDoc(userChatsRef, {
            chatsData: userChatsData.chatsData,
          });
        }
      });
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
    <div className="Chat-bar">
      <div className="Chat-user">
        <img src={chatUser.userData.avatar || assets.photo1.png} alt="" />
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.bluedot_icon} alt='' /> : null}</p>
        <img onClick={() => setChatVisible(false)} className='arrow' src={assets.arrow_icon} alt="" />
        <img src={assets.help_icon} className="Help" alt="" />
      </div>
      <div className="chat-post">
        <div ref={scrollEnd}></div>
        {threads.map((thread, index) => (
          <div key={index} className={thread.sId === userData.id ? 's-post' : 'r-post'}>
            {thread.Image
              ? <img className='thread-img' src={thread.Image} alt="" />
              : <p className="thread">{thread.text}</p>
            }
            <div>
              <img src={thread.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimestamp(thread.createAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='chat-input'>
        <input onKeyDown={(e) => e.key === "Enter" ? postMessage() : null} onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Post a message' />
        <input onChange={postImage} type="file" id="image" accept="image/jpeg, image/png" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={postMessage} src={assets.send_icon} alt="" />
      </div>
    </div>
  ) : (
    <div className={`hello-there ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt='' />
      <p>Chat Messaging, Simplified</p>
    </div>
  );
};

export default ChatBox;