

import React, { useState, useMemo } from 'react';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

const STATUS_COLORS = {
    DONE: '#10B981',
    PENDING: '#F59E0B',
    SKIPPED: '#EF4444'
};

const PIE_COLORS = [STATUS_COLORS.DONE, STATUS_COLORS.SKIPPED, STATUS_COLORS.PENDING];

const CustomTooltip = ({ active, payload, label, chartType }) => {
    if (active && payload && payload.length) {
        if (chartType === 'line' || chartType === 'bar' || chartType === 'area') {
            const dataPoint = payload[0].payload;
            return (
                <div className="p-3 bg-white border border-gray-300 shadow-xl rounded-lg text-sm backdrop-blur-sm">
                    <p className="font-bold text-gray-800">
                        {new Date(dataPoint.fullDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                        Status: <span className="font-semibold capitalize">{dataPoint.status.toLowerCase()}</span>
                    </p>
                </div>
            );
        } else if (chartType === 'pie') {
            const data = payload[0];
            return (
                <div className="p-3 bg-white border border-gray-300 shadow-xl rounded-lg text-sm backdrop-blur-sm">
                    <p className="font-bold text-gray-800">{data.name}</p>
                    <p className="text-gray-600">
                        <span className="font-semibold">{data.value} days</span>
                    </p>
                    <p className="text-gray-600">
                        {((data.value / data.payload.total) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
    }
    return null;
};

const HabitChart = ({ history }) => {
    const [chartType, setChartType] = useState('line');
    const [selectedMonth, setSelectedMonth] = useState('');

    if (!history || history.length === 0) {
        return (
            <div className="h-64 w-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-sm font-medium text-gray-600">No data available</p>
                </div>
            </div>
        );
    }

    const availableMonths = useMemo(() => {
        const months = new Set();
        history.forEach(day => months.add(day.date.substring(0, 7)));
        const monthsArray = Array.from(months).sort().reverse();
        if (!selectedMonth && monthsArray.length > 0) {
            setSelectedMonth(monthsArray[0]);
        }
        return monthsArray;
    }, [history, selectedMonth]);

    const { chartData, pieData, streakData } = useMemo(() => {
        if (!selectedMonth) return { chartData: [], pieData: [], streakData: [] };

        const [year, month] = selectedMonth.split('-').map(Number);
        const selectedMonthIndex = month - 1;

        const filteredData = history
            .filter(day => {
                const date = new Date(day.date);
                return date.getMonth() === selectedMonthIndex && date.getFullYear() === year;
            })
            .map(day => ({
                dayOfMonth: new Date(day.date).getDate(),
                fullDate: day.date,
                status: day.status,
                value: day.status === 'DONE' ? 1 : day.status === 'SKIPPED' ? 0 : 0.5,
                date: day.date
            }))
            .sort((a, b) => a.dayOfMonth - b.dayOfMonth);

        const statusCounts = filteredData.reduce((acc, day) => {
            acc[day.status] = (acc[day.status] || 0) + 1;
            return acc;
        }, { DONE: 0, SKIPPED: 0, PENDING: 0 });

        const total = filteredData.length;
        const pieData = [
            { name: 'Completed', value: statusCounts.DONE, total },
            { name: 'Skipped', value: statusCounts.SKIPPED, total },
            { name: 'Pending', value: statusCounts.PENDING, total }
        ].filter(item => item.value > 0);

        let currentStreak = 0;
        const streakData = filteredData.map(day => {
            if (day.status === 'DONE') {
                currentStreak++;
            } else {
                currentStreak = 0;
            }
            return {
                ...day,
                streak: currentStreak
            };
        });

        return { chartData: filteredData, pieData, streakData };
    }, [history, selectedMonth]);

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="h-48 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <div className="text-3xl mb-2">📅</div>
                        <p className="text-sm">No data for selected month</p>
                    </div>
                </div>
            );
        }

        const monthLength = new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate();
        const xAxisTicks = Array.from({ length: monthLength }, (_, i) => i + 1)
            .filter(d => d % (monthLength > 20 ? 5 : 3) === 0 || d === 1 || d === monthLength);

        switch (chartType) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                            <XAxis 
                                dataKey="dayOfMonth"
                                ticks={xAxisTicks}
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                            />
                            <YAxis 
                                domain={[0, 1]} 
                                ticks={[0, 0.5, 1]} 
                                tickFormatter={(value) => value === 1 ? 'Done' : value === 0 ? 'Skipped' : 'Pending'}
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                                width={45}
                            />
                            <Tooltip content={<CustomTooltip chartType="line" />} />
                            <Line 
                                type="stepAfter" 
                                dataKey="value" 
                                stroke={STATUS_COLORS.DONE}
                                strokeWidth={3}
                                dot={{ r: 4, stroke: STATUS_COLORS.DONE, strokeWidth: 2, fill: '#ffffff' }}
                                activeDot={{ r: 6, stroke: STATUS_COLORS.DONE, strokeWidth: 2, fill: '#D1FAE5' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                            <XAxis 
                                dataKey="dayOfMonth"
                                ticks={xAxisTicks}
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                            />
                            <YAxis 
                                domain={[0, 1]} 
                                ticks={[0, 0.5, 1]} 
                                tickFormatter={(value) => value === 1 ? 'Done' : value === 0 ? 'Skipped' : 'Pending'}
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                                width={45}
                            />
                            <Tooltip content={<CustomTooltip chartType="bar" />} />
                            <Bar 
                                dataKey="value" 
                                fill={STATUS_COLORS.DONE}
                                radius={[3, 3, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip chartType="pie" />} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={streakData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                            <XAxis 
                                dataKey="dayOfMonth"
                                ticks={xAxisTicks}
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                            />
                            <YAxis 
                                style={{ fontSize: '10px' }}
                                stroke="#6B7280"
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip chartType="area" />} />
                            <Area 
                                type="monotone" 
                                dataKey="streak" 
                                stroke={STATUS_COLORS.DONE}
                                fill={STATUS_COLORS.DONE}
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    const displayDate = selectedMonth ? new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1] - 1, 1) : new Date();
    const monthName = displayDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Progress Analytics</h3>
                    <p className="text-sm text-gray-600">{monthName}</p>
                </div>
                
                <div className="flex gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {[
                            { type: 'line', icon: '📈' },
                            { type: 'bar', icon: '📊' },
                            { type: 'pie', icon: '🥧' },
                            { type: 'area', icon: '📈' }
                        ].map(({ type, icon }) => (
                            <button
                                key={type}
                                onClick={() => setChartType(type)}
                                className={`p-2 rounded-md text-sm transition-all ${
                                    chartType === type
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                                title={type.charAt(0).toUpperCase() + type.slice(1)}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>

                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 bg-white"
                    >
                        {availableMonths.map(monthKey => {
                            const [year, month] = monthKey.split('-');
                            const date = new Date(year, month - 1, 1);
                            const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                            return <option key={monthKey} value={monthKey}>{label}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className="h-64 sm:h-80 lg:h-96">
                {renderChart()}
            </div>

            {chartData.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                        <div className="font-bold text-green-700">
                            {chartData.filter(d => d.status === 'DONE').length}
                        </div>
                        <div className="text-green-600">Done</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <div className="font-bold text-yellow-700">
                            {chartData.filter(d => d.status === 'PENDING').length}
                        </div>
                        <div className="text-yellow-600">Pending</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                        <div className="font-bold text-red-700">
                            {chartData.filter(d => d.status === 'SKIPPED').length}
                        </div>
                        <div className="text-red-600">Skipped</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitChart;