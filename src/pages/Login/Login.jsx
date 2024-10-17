import React, { useState } from 'react'; // Import React and useState hook
import './Login.css'; // Import CSS for Login component
import assets from '../../assets/assets'; // Import assets
import { signup, login } from '../../config/firebase'; // Import Firebase signup and login functions

const Login = () => {
  const [currState, setCurrState] = useState("Sign up"); // State for current form (Sign up or Login)
  const [userName, setUserName] = useState(''); // State for username
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password

  // Form submission handler
  const onSubmitHandler = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Check the current state and call the appropriate Firebase function
    if (currState === 'Sign up') {
      signup(userName, email, password); // Call signup function
    } else {
      login(email, password); // Call login function
    }
  };

  return (
    <div className='login'> {/* Main container for Login component */}
      <img src={assets.chat_logo} alt='' className='logo' /> {/* Logo image */}
      <form onSubmit={onSubmitHandler} className='login-form'> {/* Login form */}
        <h2>{currState}</h2> {/* Dynamic heading based on currState */}
        {/* Show username input only during signup */}
        {currState === 'Sign up' ? (
          <input 
            onChange={(e) => setUserName(e.target.value)} // Update username state
            value={userName} 
            type="text" 
            placeholder='Username' 
            className="form-input" 
            required 
          />
        ) : null}
        <input 
          onChange={(e) => setEmail(e.target.value)} // Update email state
          value={email} 
          type="email" 
          placeholder='Email address' 
          className="form-input" 
          required 
        />
        <input 
          onChange={(e) => setPassword(e.target.value)} // Update password state
          value={password} 
          type="password" 
          placeholder='Password' 
          className="form-input" 
          required 
        />
        <button type='submit'>{currState === 'Sign up' ? 'Create Account' : 'Login Now'}</button> {/* Dynamic button text */}
        <div className='login-term'> {/* Terms and privacy policy section */}
          <input type="checkbox" /> {/* Checkbox for terms agreement */}
          <p>By using NextTalk, you agree to our Terms and Privacy Policy.</p>
        </div>
        <div className='login-forgot'> {/* Toggle between signup and login */}
          {
            currState === 'Sign up' ? (
              <p className='login-toggle'>Already have an account? <span onClick={() => setCurrState('Login')}>Login Here</span></p>
            ) : (
              <p className='login-toggle'>Create an account? <span onClick={() => setCurrState('Sign up')}>Click here</span></p>
            )
          }
        </div>
      </form>
    </div>
  );
};

export default Login; // Export Login component