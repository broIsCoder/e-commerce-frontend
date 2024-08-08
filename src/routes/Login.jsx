import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { authenticate } from '../redux-slices/authSlice';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { addAlert } from '../redux-slices/alertsSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  if (authToken && isLoggedIn) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    try {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWarning('');
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok && response.status === 500) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        dispatch(authenticate({ authToken: data.authToken }));
        navigate('/');
      } else {
        setWarning(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark flex flex-col items-center justify-center  min-h-full px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-text-light dark:text-text-dark">Login</h2>
        {error && (
          <div className="text-center text-white bg-secondary-light dark:bg-secondary-dark p-3 rounded-md">
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
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm text-primary-light dark:text-primary-dark hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-primary-light dark:bg-primary-dark rounded-md shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark transition duration-300"
          >
            {loading ? "Loging..." : "Login"}
          </button>
        </form>
      </div>

      <Link to="/signup" className='mt-6 text-text-light dark:text-text-dark font-bold text-lg hover:underline'>
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default Login;
