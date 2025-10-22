import React from 'react';
import SummaryCards from './SummaryCards/SummaryCards';
import HabitCards from './HabitCards/HabitCards';

const DashboardOverview = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Keep up the great work! 🎉</h1>
        <p className="text-blue-100">You're on a 21-day streak! Consistency is key to building lasting habits.</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Habit Cards */}
      <HabitCards />
    </div>
  );
};

export default DashboardOverview;