import React from 'react';

const HabitCard = ({ habit }) => {
  const getMotivationalMessage = () => {
    if (habit.completed) {
      return `✅ Great work! You’ve completed "${habit.name}" today.`;
    }
    if (habit.streak >= 20) {
      return `🔥 You're on a ${habit.streak}-day streak! Keep it going.`;
    }
    if (habit.streak >= 10) {
      return `🚀 ${habit.streak} days strong — you're building momentum!`;
    }
    return `🌱 Stick with "${habit.name}" — every step counts.`;
  };

  return (
    <div className="p-4 bg-white shadow rounded text-center border">
      <p className="text-lg font-medium text-gray-700 italic">
        {getMotivationalMessage()}
      </p>
    </div>
  );
};

export default HabitCard;
