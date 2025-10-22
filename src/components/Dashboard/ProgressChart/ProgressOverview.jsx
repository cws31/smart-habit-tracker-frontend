
import React, { useState, useEffect } from 'react';
import { habitAPI } from '../../../api';
import HabitChart from './HabitChart';

const ProgressOverview = () => {
    const [habitsData, setHabitsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllHabitProgress = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // 1. Fetch the list of all habits for the user
                const habitsResponse = await habitAPI.getAllHabits();
                const habits = habitsResponse.data;

                // 2. Fetch progress data for each habit concurrently
                const progressPromises = habits.map(habit => 
                    habitAPI.getHabitProgress(habit.id)
                        .then(response => response.data)
                        .catch(err => {
                            console.error(`Error fetching progress for habit ID ${habit.id}:`, err);
                            return null;
                        })
                );

                const progressResults = await Promise.all(progressPromises);

                // 3. Combine habit details with their progress history
                const combinedData = habits.map((habit, index) => {
                    const progress = progressResults[index];
                    return {
                        id: habit.id,
                        title: habit.title,
                        history: progress ? progress.dailyHistory : [],
                        longestStreak: progress ? progress.longestStreak : 0,
                    };
                }).filter(item => item.history && item.history.length > 0);

                setHabitsData(combinedData);

            } catch (err) {
                console.error("Progress Fetch Error:", err);
                setError(err.response?.data?.message || err.message || "An error occurred while loading progress data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllHabitProgress();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8 text-center text-xl text-blue-600">
                Loading habit progress... 📊
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 m-8 rounded-lg">
                Error: {error}
            </div>
        );
    }

    if (habitsData.length === 0) {
        return (
            <div className="p-8 text-center text-xl text-gray-500 bg-gray-50 m-8 rounded-lg border border-dashed">
                You don't have any habits with logged history yet. Start tracking!
            </div>
        );
    }

    return (
        <div className="p-6 sm:p-8 space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                All Habit Progress Overview 🚀
            </h1>
            
            {habitsData.map((habit, index) => (
                <div key={habit.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-blue-700">{habit.title}</h2>
                        <span className="text-sm text-gray-500">Longest Streak: {habit.longestStreak} days 🏆</span>
                    </div>
                    
                    <HabitChart history={habit.history} />
                </div>
            ))}
        </div>
    );
};

export default ProgressOverview;