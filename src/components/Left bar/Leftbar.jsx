import React from 'react'
import './Leftbar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Leftbar = () => {

  const navigate = useNavigate();
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
          <input type="text" placeholder='Search here..' />
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