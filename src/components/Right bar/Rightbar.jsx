import React, {useContext, useEffect, useState} from 'react';
import './Rightbar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import { AppState } from '../../context/AppState';

const Rightbar = () => {

  const { chatUser, threads } = useContext(AppState);
  const [ threadImages, setThreadImages] = useState([]);

  useEffect (() => {
    let tempData = [];
    threads.map((thread) => {
      if (thread.image) {
        tempData.push(thread.image)
      }
    })
    setThreadImages(tempData);
  }, [threads])

  return chatUser ? (
    <div className='rb'>
      <div className='rb-profile'>
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ?<img className='dot' src={assets.bluedot_icon}alt=''/>:null}{chatUser.userData.name}</h3>
        <p>{chatUser.userData.info}</p>
      </div>
      <hr/>
      <div className="rb-media">
        <p>Media</p>
        <div>
        {threadImages.map((url,index)=>(<img onClick={()=>window.open(url)} key={index} src={url} alt="" />))}
        </div>
        </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  ) : <div className='rb'>
  <button onClick={()=>logout()}>Logout</button>
</div>
}

export default Rightbar;