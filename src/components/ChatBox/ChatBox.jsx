import React from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'

const ChatBox = () => {
  return (
    <div className='Chat-bar'>
      <div className='Chat-user'>
        <img src={assets.mary} alt="" />
        <p>Mary Muthoni <img className='dot' src={assets.bluedot_icon} alt='' /></p>
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
        <input type="file" id='image' accept='image/jpeg, image/png' hidden/>
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_icon} alt="" />
      </div>
    </div>
  )
}

export default ChatBox