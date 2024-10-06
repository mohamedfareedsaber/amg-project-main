import React, { useState } from 'react';
import axios from 'axios';
import './DoctorLogin.css'; // Ensure Tailwind is imported globally if required

const DoctorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/doctors/login', { username, password });
      setMessage(`Welcome, ${response.data.doctor.name}!`);
      console.log(response.data.doctor); // Store doctor info if needed
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="form-container">
        <h2 className="text-center text-white text-2xl mb-8 font-semibold">Doctor Login</h2>
        <form onSubmit={handleLogin}>
          
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        {message && <p className="text-center text-white mt-4">{message}</p>}
      </div>
    </section>
  );
};

export default DoctorLogin;
