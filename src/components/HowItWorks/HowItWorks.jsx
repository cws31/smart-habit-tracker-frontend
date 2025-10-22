import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      icon: '➕',
      title: 'Add Habit',
      description: 'Choose from pre-built habits or create custom ones that match your goals.'
    },
    {
      icon: '📝',
      title: 'Track Progress',
      description: 'Log your daily activities and monitor your consistency with easy-to-use tools.'
    },
    {
      icon: '🏆',
      title: 'Achieve Goals',
      description: 'Watch your habits transform into lasting lifestyle changes and achievements.'
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-16 md:py-20 bg-blue-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4">Simple steps to build lasting habits</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ step, index }) => (
  <div className="text-center p-4 sm:p-6 w-full">
    <div className="bg-white w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg mx-auto mb-4 sm:mb-6">
      {step.icon}
    </div>
    <div className="bg-blue-100 text-blue-600 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto mb-3 sm:mb-4">
      {index + 1}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
  </div>
);

export default HowItWorks;