import React, {useContext, useEffect, useState} from 'react';
import './Rightbar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import { AppState } from '../../context/AppState';

const Rightbar = () => {

  const { chatUser, threads } = useContext(AppState);
  const [ postImages, setPostImages] = useState([]);

  useEffect (() => {
    let tempData = [];
    threads.map((post) => {
      if (post.image) {
        tempData.push(post.image)
      }
    })
    setPostImages(tempData);
  }, [threads])

  return chatUser ? (
    <div className='rb'>
      <div className='rb-profile'>
        <img src={chatUser.userData.avatar} alt="" />
        <h3>{Date.now() - chatUser.userData.lastSeen <= 80000 ?<img className='dot' src={assets.bluedot_icon}alt=''/>:null}{chatUser.userData.name}</h3>
        <p>{chatUser.userData.info}</p>
      </div>
      <hr/>
      <div className="rb-media">
        <p>Media</p>
        <div>
          {postImages.map((url,index)=>(<img onClick={()=>window.open(url)} key={index} src={url} alt="" />))}
          </div>
        </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  ) : <div className='rb'>
  <button onClick={()=>logout()}>Logout</button>
</div>
}

export default Rightbar;