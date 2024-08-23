import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock, UserCircle, Briefcase } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate()
  const authToken = useSelector((state) => state.auth.authToken)
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false)

  const [warning, setWarning] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (authToken && isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleOptionChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError('');
      setWarning('');
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          roles: role === "employee" ? { employee: 3000 } : {}
        })
      });

      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setError("")
        navigate('/login');
      } else {
        setWarning(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark flex flex-col items-center justify-center min-h-full px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark">Sign Up</h2>
        {error && (
          <div className='text-center text-white bg-secondary-light dark:bg-secondary-dark p-3 rounded-md'>
            {error}
          </div>
        )}
        {warning && (
          <div className="text-center dark:text-white text-black bg-yellow-300 dark:bg-yellow-500 p-3 rounded-md">
            {warning}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark bg-white dark:bg-gray-700 text-text-light dark:text-text-dark"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${role === 'user' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-gray-200 dark:bg-gray-600 text-text-light dark:text-text-dark'}`}>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={handleOptionChange}
                className="hidden"
              />
              <UserCircle size={20} />
              <span>User</span>
            </label>
            <label className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${role === 'employee' ? 'bg-primary-light dark:bg-primary-dark text-white' : 'bg-gray-200 dark:bg-gray-600 text-text-light dark:text-text-dark'}`}>
              <input
                type="radio"
                name="role"
                value="employee"
                checked={role === 'employee'}
                onChange={handleOptionChange}
                className="hidden"
              />
              <Briefcase size={20} />
              <span>Employee</span>
            </label>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary-light dark:bg-primary-dark rounded-md shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark transition duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
      <Link to="/" className='mt-6 text-text-light dark:text-text-dark font-bold text-lg hover:underline'>
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Signup;