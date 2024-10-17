import React, { useContext, useEffect, useState } from 'react';
import './Profile.css'; // Import CSS for Profile component
import assets from '../../assets/assets'; // Import assets
import { onAuthStateChanged } from 'firebase/auth'; // Firebase authentication
import { auth, db } from '../../config/firebase'; // Firebase configuration
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import { toast } from 'react-toastify'; // Toast notifications
import upload from '../../lib/fileupload'; // File upload utility
import { AppState } from '../../context/AppState'; // Import AppState context

const Profile = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [image, setImage] = useState(false); // State for profile image
  const [name, setName] = useState(''); // State for user's name
  const [info, setInfo] = useState(''); // State for user info
  const [uid, setUid] = useState(''); // State for user ID
  const [lastImage, setLastIMage] = useState(''); // State for last uploaded image
  const { setUserData } = useContext(AppState); // Set user data in context

  // Function to update the user's profile
  const updateProfile = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      // Check if an image is selected
      if (!lastImage && !image) {
        toast.error('Choose your profile image'); // Show error if no image
        return; // Stop further execution if no image
      }

      const docRef = doc(db, 'users', uid); // Reference to the user's document
      // Upload new image if selected
      if (image) {
        const imgUrl = await upload(image); // Upload image
        setLastIMage(imgUrl); // Update last image state
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
      setUserData(snap.data()); // Update user data in context
      toast.success('Profile updated successfully!'); // Show success message
      navigate('/chat'); // Navigate to chat after updating
    } catch (error) {
      console.error(error); // Log any errors
      toast.error(error.message); // Show error message
    }
  };

  // Effect to check authentication state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid); // Set user ID
        const docRef = doc(db, 'users', user.uid); // Reference to the user's document
        const docSnap = await getDoc(docRef); // Get user document snapshot
        if (docSnap.exists()) {
          const data = docSnap.data(); // Extract data from snapshot
          setName(data.name || ''); // Set name state
          setInfo(data.info || ''); // Set info state
          setLastIMage(data.avatar || ''); // Set last image state
          setUserData(data); // Set user data if it exists
        } else {
          toast.error('Your profile is not set up yet. Please complete your profile.'); // Error if no profile exists
          navigate('/profile'); // Redirect to profile to set it up
        }
      } else {
        navigate('/'); // Redirect to home if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
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