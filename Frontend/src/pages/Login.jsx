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
    <section className="h-screen">
      <div className="container max-w-screen-lg mx-auto h-full px-6 py-24">
        <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* Left column with image */}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img
              src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
              alt="Phone illustration"
            />
          </div>

          {/* Right column with login form */}
          <div className="">
            <form onSubmit={handleLogin}>
              {/* Username input */}
              <div className="relative mb-6">
                <input
                  type="text"
                 
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label
                  htmlFor="username"
                  className="absolute left-3 top-0 pt-[0.37rem] text-neutral-500 transition-all dark:text-neutral-400"
                >
                  Username
                </label>
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
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 top-0 pt-[0.37rem] text-neutral-500 transition-all dark:text-neutral-400"
                >
                  Password
                </label>
              </div>

              {/* Remember me checkbox */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <input
                    type="checkbox"
                    id="remember"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="remember" className="inline-block">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="inline-block w-full rounded bg-primary px-7 py-3 text-white font-medium text-sm leading-normal transition duration-150"
              >
                Sign in
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
