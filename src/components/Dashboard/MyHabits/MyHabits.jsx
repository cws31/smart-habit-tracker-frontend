
import React, { useState, useEffect } from 'react';
import { habitAPI } from '../../../api';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';

const MyHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      
      const response = await habitAPI.getAllHabits();
      const habitsData = response.data;
      
      setHabits(habitsData);
      setError('');
    } catch (err) {
      console.error('Error fetching habits:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const handleNewHabitAdded = (newHabit) => {
    console.log('New habit added:', newHabit);
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600 mt-2">Manage and track your daily habits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          + Add New Habit
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchHabits}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits found</h3>
          <p className="text-gray-600 mb-6">Start building your routine by adding your first habit!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
            />
          ))}
        </div>
      )}

      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={handleNewHabitAdded}
      />
    </div>
  );
};

export default MyHabits;