import React from 'react';
import Header from '../components/Header/Header';
import HeroSection from '../components/Hero/HeroSection';
import FeaturesSection from '../components/Features/FeaturesSection';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import CTASection from '../components/CTA/CTASection';
import Footer from '../components/Footer/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;