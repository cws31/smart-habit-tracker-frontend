import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/Auth/AuthLayout';
import SignupForm from '../components/Auth/SignupForm';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/login'); // This will navigate to login page
  };

  const handleGoogleSignup = () => {
    console.log('Google signup');
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building better habits today"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      onFooterLinkClick={handleSwitchToLogin}
    >
      <SignupForm 
        onSwitchToLogin={handleSwitchToLogin}
        onGoogleSignup={handleGoogleSignup}
      />
    </AuthLayout>
  );
};

export default SignupPage;