import React from 'react';
import Card from '../UI/Card';

const FeaturesSection = () => {
  const features = [
    {
      icon: '📊',
      title: 'Habit Tracking',
      description: 'Monitor your daily habits with intuitive tracking and visual progress indicators.'
    },
    {
      icon: '📈',
      title: 'Progress Insights',
      description: 'Get detailed analytics and insights to understand your habit formation patterns.'
    },
    {
      icon: '⏰',
      title: 'Smart Reminders',
      description: 'Personalized notifications to keep you on track with your habit goals.'
    },
    {
      icon: '🎯',
      title: 'Daily Goals',
      description: 'Set achievable targets and celebrate your milestones along the way.'
    }
  ];

  return (
    <section id="features" className="w-full py-16 md:py-20 bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader 
          title="Powerful Features"
          subtitle="Everything you need to build better habits and transform your daily routine"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12 md:mb-16 w-full">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
    <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const FeatureCard = ({ feature }) => (
  <Card hover={true} className="h-full w-full">
    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
  </Card>
);

export default FeaturesSection;