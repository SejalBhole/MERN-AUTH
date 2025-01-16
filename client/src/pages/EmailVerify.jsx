import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData, getUserData} = useContext(AppContent)

  const inputRefs = React.useRef([]);
  const navigate = useNavigate();

  // Function to go from previous box to the next box automatically
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Function to delete the input and move focus to the previous box
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Function to handle OTP paste event
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)  //getting otp  
      const otp = otpArray.join('');

      //send the otp to backend server
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account',{otp})
      if(data.success){
       toast.success(data.message)
       getUserData()
       navigate('/')
      }else{
        toast.error(data.message)
      }
    
    } catch (error) {
      if (error.response && error.response.data) {
        // If backend sends an error response
        toast.error(error.response.data.message || 'Verification failed');
      } else {
        // Generic error message
        toast.error('An unexpected error occurred');
      }
    }
  }

   useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
   },[isLoggedin,userData])
   

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter 6-digit code sent to your EmailID
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {/* Creating 6 places for OTP */}
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
