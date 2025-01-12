import React, { useState } from 'react'
import './Login.css'
import {toast} from 'react-toastify'
import axios from 'axios';
const Login = ({setToken,url}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(url + '/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="login-popup">
        <form className="login-pop-container"onSubmit={onSubmitHandler}>
          <h1 className="login-popup-title">Admin Panel</h1>
          <div className="login-popup-inputs">
            
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              
              type="email"
              placeholder="your@email.com"
            />
          </div>
          <div className="login-popup-inputs">
            
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              
              type="password"
              placeholder="Password Here"
            />
          </div>
          <button
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login
