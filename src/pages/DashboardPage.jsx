

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const navigate = useNavigate();

  const validateTokenWithBackend = async (token) => {
    try {
      console.log('🔑 Validating token with backend...');
      
      if (!token) {
        throw new Error('No token provided for validation');
      }

      const response = await authAPI.validateToken();
      console.log('✅ Token validation successful:', response.data);
      
      if (response.data.valid === true || response.data.status === 'VALID') {
        console.log('✅ Token is valid for user:', response.data.email);
        setIsTokenValid(true);
        return true;
      } else {
        throw new Error(response.data.message || 'Token validation failed');
      }
    } catch (error) {
      console.error('❌ Token validation error:', error);
      setIsTokenValid(false);
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      throw error;
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log('🔐 Authentication check - Token exists:', !!token);
        console.log('🔐 Authentication check - User data exists:', !!userData);

        if (!token || !userData) {
          console.warn('No authentication data found, redirecting to login');
          navigate('/login');
          return;
        }

        if (typeof token !== 'string' || token.trim() === '') {
          console.error('Invalid token format');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        
        if (!parsedUser || !parsedUser.email) {
          console.error('Invalid user data');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        setUser(parsedUser);
        
        await validateTokenWithBackend(token);
        
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  useEffect(() => {
    const checkTokenPeriodically = () => {
      const token = localStorage.getItem('token');
      if (token && user) {
        validateTokenWithBackend(token).catch(error => {
          console.warn('Token revalidation failed:', error);
        });
      }
    };

    if (user && isTokenValid) {
      const intervalId = setInterval(checkTokenPeriodically, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [user, isTokenValid]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('Page unloading, cleaning up...');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      navigate('/login');
      return null;
    }
    
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    return `Bearer ${cleanToken}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user || !isTokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authentication required. Redirecting...</p>
        </div>
      </div>
    );
  }

  return <DashboardLayout user={user} getValidToken={getValidToken} />;
};

export default DashboardPage;