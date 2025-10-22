import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Auth/AuthLayout';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSwitchToSignup = () => {
    navigate('/signup'); // This will navigate to signup page
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your habit journey"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      onFooterLinkClick={handleSwitchToSignup}
    >
      <LoginForm 
        onSwitchToSignup={handleSwitchToSignup}
        onGoogleLogin={handleGoogleLogin}
      />
    </AuthLayout>
  );
};

export default LoginPage;