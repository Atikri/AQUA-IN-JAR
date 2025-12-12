import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/db';

const COLORS = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#60a5fa', '#a78bfa', '#f87171', '#9ca3af'];

const renderActiveShape = (props) => {
    return (
        <g>
            <text x={props.cx} y={props.cy} dy={8} textAnchor="middle" fill="#374151" className="text-xl font-bold">
                {props.payload.name}
            </text>
        </g>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg text-sm">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-indigo-600 font-medium">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

const DashboardCharts = ({ transactions }) => {
    const data = useMemo(() => {
        // 1. Filter expenses only
        const expenses = transactions.filter(t => t.type === 'expense');

        // 2. Group by category
        const grouped = expenses.reduce((acc, curr) => {
            const cat = curr.category || 'General';
            acc[cat] = (acc[cat] || 0) + curr.amount;
            return acc;
        }, {});

        // 3. Convert to array and sort
        return Object.entries(grouped)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    // Prevent rendering if empty
    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                <p>No data to visualize yet.</p>
            </div>
        );
    }

    return (
        <div className="h-80 w-full bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardCharts;
