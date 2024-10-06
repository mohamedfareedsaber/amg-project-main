import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure Tailwind is imported globally if required

const Login = ({ setIsAuthenticated, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('center', response.data.center);
        setIsAuthenticated(true);
        setRole(response.data.role);

        // Navigate based on user role
        if (response.data.role === 'superAdmin') {
          navigate('/dashboard-superAdmin');
        } else if (response.data.role === 'centerAdmin' || response.data.role === 'centerUser') {
          navigate('/dashboard-center');
        } else if (response.data.role === 'doctoradmin') {
          navigate('/dashboard-doctor'); // Navigate to doctor dashboard
        }
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error);
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <h2 className="text-center text-white text-bold mb-8 font-semibold">Login Admin OR Center</h2>

          {/* Username input */}
          <div className="relative mb-6">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Password input */}
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="submit-btn">Sign in</button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Login;
