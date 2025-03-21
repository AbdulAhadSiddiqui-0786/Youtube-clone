import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Runs on mount to check if user is logged in
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
  
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        await checkAuth(); // Fetch user data immediately after login
        navigate('/');
      } else {
        console.error('Unexpected response:', response.data);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      await checkAuth(); // Fetch user details immediately after registration
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.error || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
