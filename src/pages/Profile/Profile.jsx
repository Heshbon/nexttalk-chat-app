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
  const [image, setImage] = useState(false);
  const [name, setName] = useState('');
  const [info, setInfo] = useState('');
  const [uid, setUid] = useState('');
  const [lastImage, setLastIMage] = useState('');
  const { setUserData } = useContext(AppState);

  // Function to update the user's profile
  const updateProfile = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // Check if an image is selected
      if (!lastImage && !image) {
        toast.error('Choose your profile image');
        return;
      }

      const docRef = doc(db, 'users', uid);
      if (image) {
        const imgUrl = await upload(image);
        setLastIMage(imgUrl);
        // Update user's document in Firestore
        await updateDoc(docRef, {
          avatar: imgUrl,
          info: info,
          name: name,
        });
      } else {
        // Update user info without changing the image
        await updateDoc(docRef, {
          info: info,
          name: name,
        });
      }

      // Fetch the updated user document
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success('Profile updated successfully!');
      navigate('/chat'); // Navigate to chat after updating
    } catch (error) {
      console.error(error); // Log any errors
      toast.error(error.message); // Show error message
    }
  };

  // Effect to check authentication state and fetch user data
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid); // Set user ID
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.data().name) { // Set name state
          setName(docSnap.data().name);
        }
        if (docSnap.data().info) {
          setInfo(docSnap.data().info);
        }
        if (docSnap.data().avatar) {
          setLastIMage(docSnap.data().avatar);
        }
      }
      else {
        navigate('/'); // Redirect to home if not authenticated
        }
      })
    }, []);
    
    return (
    <div className='account'>
      <div className="account-container">
        <form onSubmit={updateProfile}>
          <h3>Account info</h3>
          <label htmlFor="avatar">
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.jpg, .jpeg, .png' 
              hidden 
            />
            <img 
              src={image ? URL.createObjectURL(image) : assets.avatar_icon} 
              alt="" 
            />
            Update your photo
          </label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            placeholder='Contact name' 
            required 
          />
          <textarea 
            onChange={(e) => setInfo(e.target.value)} 
            value={info} 
            placeholder='Update your info' 
            required
          ></textarea>
          <button type='submit'>Save</button>
        </form>
        <img 
          className='account-pict' 
          src={image ? URL.createObjectURL(image) : lastImage ? lastImage : assets.logo} 
          alt="Profile Display" 
        />
      </div>
    </div>
  );
};

export default Profile; // Export Profile component