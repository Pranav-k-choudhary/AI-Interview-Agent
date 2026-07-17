import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on startup to check for active cookie session
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await API.get('/auth/profile');
        setUser(data);
      } catch (error) {
        // Not logged in or expired token, clear state silently
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed. Please check credentials.';
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      setUser(data);
      return data;
    } catch (error) {
      console.error("رजिस्ट्रेशन एरर की पूरी डिटेल:", error.response?.data || error);
      throw error.response?.data?.message || 'Registration failed. Try again.';
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout request error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await API.put('/auth/profile', profileData);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
