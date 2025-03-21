import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth(); // Get login and register from context
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Call login from context with email and password
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Call register from context with user data
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="User Name"
            placeholder="User Name"
            className="w-full px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 bg-black text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <LuEye size={20} /> : <LuEyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-500 hover:underline"
          >
            {isLogin ? 'Create account' : 'Sign in instead'}
          </button>
        </p>
      </div>
    </div>
  );
}