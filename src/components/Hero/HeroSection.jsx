import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup'); // Navigate to signup page
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          <div className="text-center md:text-left w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track Your Habits,<br />
              <span className="text-blue-600">Build Your Future</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-4 sm:mt-6 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
              Transform your life one habit at a time. Our smart tracking system helps you build 
              lasting routines and achieve your personal goals with ease and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                variant="primary" 
                className="w-full sm:w-auto text-center"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
              <Button 
                variant="secondary" 
                className="w-full sm:w-auto text-center"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
};

const HeroVisual = () => (
  <div className="relative mt-8 md:mt-0 w-full">
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl w-full">
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Daily Habits</h3>
          <span className="text-xs sm:text-sm text-blue-600">Today</span>
        </div>
        <div className="space-y-2 sm:space-y-3 w-full">
          {['Morning Meditation', 'Exercise', 'Read 30min', 'Water Intake'].map((habit, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-blue-50 rounded w-full">
              <span className="text-gray-700 text-sm sm:text-base">{habit}</span>
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-400 rounded-full flex items-center justify-center">
                {index < 2 && <span className="text-blue-600 text-xs sm:text-sm">✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;