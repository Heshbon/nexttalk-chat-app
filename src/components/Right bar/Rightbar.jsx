import React from 'react'
import './Rightbar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'

const Rightbar = () => {
  return (
    <div className='rb'>
      <div className="rb-profile">
        <img src={assets.erik} alt="" />
        <h3>Erik Beth <img src={assets.bluedot_icon} className='dot' alt="" /></h3>
        <p>Hello, I am Erik and glad to connect with you.</p>
      </div>
      <hr />
      <div className='rb-media'>
        <p>Media</p>
        <div>
          <img src={assets.photo1} alt="" />
          <img src={assets.pict2} alt="" />
          <img src={assets.pict3} alt="" />
          <img src={assets.pict4} alt="" />
          <img src={assets.photo1} alt="" />
          <img src={assets.pict2} alt="" />
        </div>
      </div>
      <button onClick={()=>logout()}>Logout</button>
    </div>
  )
}

export default Rightbar