
import React, { useEffect, useState } from 'react';
import { habitAPI } from '../../../api';
import StatCard from '../../UI/StatCard';

const SummaryCards = () => {
  const [totalHabits, setTotalHabits] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const [overallPerformance, setOverallPerformance] = useState('...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalResponse, doneResponse, performanceResponse] = await Promise.all([
          habitAPI.getHabitsCount(),
          habitAPI.getTodayCompletedCount(),
          habitAPI.getOverallPerformance()
        ]);

        setTotalHabits(totalResponse.data);
        setCompletedToday(doneResponse.data);
        setOverallPerformance(performanceResponse.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Habits',
      value: loading ? '...' : totalHabits,
      icon: '📊',
      color: 'blue',
      trend: { isPositive: true, value: '+2 this week' }
    },
    {
      title: 'Completed Today',
      value: loading ? '...' : `${completedToday}/${totalHabits}`,
      icon: '✅',
      color: 'green',
      trend: { isPositive: true, value: `${totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0}% completion` }
    },
    {
      title: 'Current Streak',
      value: '21 days',
      icon: '🔥',
      color: 'orange',
      trend: { isPositive: true, value: 'Personal best!' }
    },
    {
      title: 'Success Rate',
      value: loading ? '...' : overallPerformance,
      icon: '🎯',
      color: 'purple',
      trend: { isPositive: true, value: '+5% from last week' }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default SummaryCards;
