import React from 'react'
import './Leftbar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'

const Leftbar = () => {

  const navigate = useNavigate();
  
  const inputHandler = async (e) =>  {

    try {
      const input = e.target.value;
      const userRef = collection(db,'users');
      const q = query(userRef,where('username','==',input.toLowerCase()));
      const querySnap = await getDocs(q);
      if(!querySnap.empty)
      {
        console.log(querySnap.docs[0].data());
        console.log("User Data:", userData); // Log the fetched data
      }
    } catch (error) {
      
    }
  }
  return (
    <div className='lb'>
      <div className="lb-top">
        <div className="lb-nav">
          <img src={assets.logo} className='logo' alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => { console.log("Clicked Edit Profile"); navigate('/profile')}}>Edit profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="lb-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search here..' />
        </div>
      </div>
      <div className="lb-list">
        {Array(15).fill('').map((item,index)=>(
          <div key={index} className='contacts'>
            <img src={assets.precious} alt="" />
            <div>
              <p>Precious Angel</p>
              <span>Hey, how is life?</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leftbar