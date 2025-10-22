
import React, { useState } from 'react';
import { habitAPI } from '../../../api'; // Fixed import path

const AddHabitModal = ({ isOpen, onClose, onAddHabit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'DAILY',
    startDate: new Date().toISOString().split('T')[0],
    challengeDays: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const selectedDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Start date cannot be in the past. Please select today or a future date.');
      setIsLoading(false);
      return;
    }

    try {
      const apiData = {
        title: formData.title,
        description: formData.description,
        frequency: formData.frequency,
        startDate: formData.startDate,
        challengeDays: formData.challengeDays || null
      };

      console.log('Sending habit data:', apiData);

      const response = await habitAPI.createHabit(apiData);
      const newHabit = response.data;

      console.log('New habit created:', newHabit);

      setFormData({
        title: '',
        description: '',
        frequency: 'DAILY',
        startDate: new Date().toISOString().split('T')[0],
        challengeDays: null
      });
      
      if (onAddHabit) {
        onAddHabit(newHabit);
      }
      
      onClose();
      
    } catch (err) {
      console.error('Error adding habit:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? null : parseInt(value)) : value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Habit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-300"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Habit Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., Morning Meditation"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Brief description of your habit..."
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
              Frequency *
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              disabled={isLoading}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="challengeDays" className="block text-sm font-medium text-gray-700 mb-1">
              Challenge Days (Optional)
            </label>
            <input
              type="number"
              id="challengeDays"
              name="challengeDays"
              min="1"
              max="365"
              value={formData.challengeDays || ''}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Default challenge is 21 days (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to use default 21-day challenge
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Habit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;