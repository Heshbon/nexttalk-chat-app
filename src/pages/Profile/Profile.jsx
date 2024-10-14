import React, { useContext, useEffect, useState } from 'react';
import './Profile.css';
import assets from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/fileupload';
import { AppState } from '../../context/AppState';

const Profile = () => {

  const navigate = useNavigate();
  const [image,setImage] = useState(false);
  const [name,setName] = useState('');
  const [info,setInfo] = useState('');
  const [uid,setUid] = useState('');
  const [lastImage,setLastIMage] = useState('');
  const {setUserData} = useContext(AppState);

  const Update = async (event) => {
    event.preventDefault();
    try {
      
      if (!lastImage && !image) {
        toast.error('Choose your profile image');
        return; // stop further execution if no image
      }
      const docRef = doc(db,'users',uid)
      if (image) {
        const imgUrl = await upload(image);
        setLastIMage(imgUrl);
        await updateDoc(docRef,{
          avatar:imgUrl,
          info:info,
          name:name
        });
      }
      else{
        await updateDoc(docRef,{
          info:info,
          name:name
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success('Profile updated successfully!'); // Indicate success
      navigate('/chat'); // Navigate after updating
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db,'users',user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setInfo(data.info || '');
          setLastIMage(data.avatar || '');
          setUserData(data); // Set user data if it exits
        } else {
          toast.error('Your profile is not set up yet. Please complete your profile.');
          navigate('/profile'); // Redirect to profile to set it up
        }
      } else {
        navigate('/'); // Navigate to homepage if not authenticated
      }
    });
    
    return () => unsubscribe(); // Cleanup on unmount
    }, [navigate]);
  
    return (
      <div className='account'>
        <div className="account-container">
        <form onSubmit={Update}>
        <h3>Account info</h3>
        <label htmlFor="avatar">
        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='avatar' accept='.jpg, .jpeg, .png' hidden />
        <img src={image? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
        Update your photo
        </label>
        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Contact name' required />
        <textarea onChange={(e)=>setInfo(e.target.value)} value={info} placeholder='Update your info' required></textarea>
        <button type='submit'>Save</button>
        </form>
        <img className='account-pict' src={image? URL.createObjectURL(image) : assets.logo} alt="" />
      </div>
    </div>
  );
};
    

export default Profile