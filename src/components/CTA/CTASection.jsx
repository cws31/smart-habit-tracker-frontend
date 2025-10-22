import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartFreeTrial = () => {
    navigate('/signup'); // Navigate to signup page
  };

  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Habits?
        </h2>
        <p className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Join thousands of users who have already started their habit-building journey
        </p>
        <Button 
          variant="white" 
          className="text-sm sm:text-base"
          onClick={handleStartFreeTrial}
        >
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
};

export default CTASection;