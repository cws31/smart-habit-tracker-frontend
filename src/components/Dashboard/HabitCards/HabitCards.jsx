import React from 'react';

const HabitCards = () => {
  const messages = [
    "🌱 Small habits build a strong foundation. Stick with it!",
    "🔥 You're closer to your goals than you think. Keep showing up!",
    "🎯 Focus on consistency, not perfection. Progress is what counts.",
    "🚀 Great things take time — keep putting in the work every day.",
    "💡 One habit at a time. One day at a time. You're doing great.",
    "🏆 Habits shape your future. You're on the right path.",
    "💪 Your discipline today is your success tomorrow.",
    "⏳ Every habit completed today brings you closer to your best self.",
  ];

  // Get a random message on each render
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Motivation</h2>
      <p className="text-lg text-gray-600 italic">{randomMessage}</p>
    </div>
  );
};

export default HabitCards;
