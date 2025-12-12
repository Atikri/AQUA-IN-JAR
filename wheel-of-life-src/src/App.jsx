import React, { useState, useMemo, useEffect } from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { RefreshCw, Download, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

// Register ChartJS components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const CATEGORIES = [
    { id: 'health', label: 'Health', color: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
    { id: 'career', label: 'Career', color: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
    { id: 'finances', label: 'Finances', color: 'rgba(255, 206, 86, 0.5)', border: 'rgba(255, 206, 86, 1)' },
    { id: 'partner', label: 'Partner', color: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
    { id: 'family', label: 'Family', color: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
    { id: 'friends', label: 'Friends', color: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' },
    { id: 'fun', label: 'Fun', color: 'rgba(199, 199, 199, 0.5)', border: 'rgba(199, 199, 199, 1)' },
    { id: 'community', label: 'Community', color: 'rgba(83, 102, 255, 0.5)', border: 'rgba(83, 102, 255, 1)' },
    { id: 'spirituality', label: 'Spirituality', color: 'rgba(60, 180, 75, 0.5)', border: 'rgba(60, 180, 75, 1)' },
];

function App() {
    const [scores, setScores] = useState(() => {
        const saved = localStorage.getItem('wheel_of_life_scores');
        if (saved) return JSON.parse(saved);
        // Default initial scores
        const initial = {};
        CATEGORIES.forEach(c => initial[c.id] = 5);
        return initial;
    });

    useEffect(() => {
        localStorage.setItem('wheel_of_life_scores', JSON.stringify(scores));
    }, [scores]);

    const handleScoreChange = (id, val) => {
        setScores(prev => ({ ...prev, [id]: parseInt(val) }));
    };

    const chartData = useMemo(() => {
        return {
            labels: CATEGORIES.map(c => c.label),
            datasets: [
                {
                    label: 'Score (1-10)',
                    data: CATEGORIES.map(c => scores[c.id]),
                    backgroundColor: CATEGORIES.map(c => c.color),
                    borderColor: CATEGORIES.map(c => c.border),
                    borderWidth: 1,
                },
            ],
        };
    }, [scores]);

    const chartOptions = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 10,
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    stepSize: 1,
                    backdropColor: 'transparent',
                    color: '#666'
                }
            },
        },
        plugins: {
            legend: {
                display: false, // Cleaner look without legend
            },
            tooltip: {
                backgroundColor: '#333',
                titleFont: { size: 14 },
                bodyFont: { size: 14 },
                padding: 10,
                cornerRadius: 8,
            }
        },
    };

    const focusAreas = useMemo(() => {
        const sorted = [...CATEGORIES].sort((a, b) => scores[a.id] - scores[b.id]);
        return sorted.filter(c => scores[c.id] < 6).slice(0, 3); // Get lowest scoring areas
    }, [scores]);

    const downloadChart = () => {
        const canvas = document.querySelector('canvas');
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-wheel-of-life-2026.png';
        a.click();
    };

    const resetScores = () => {
        if (confirm('Reset all scores to 5?')) {
            const reset = {};
            CATEGORIES.forEach(c => reset[c.id] = 5);
            setScores(reset);
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-800 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="inline-block bg-[#FFE135] text-black font-black text-2xl md:text-4xl px-4 py-2 transform -rotate-2 mb-4 shadow-sm border border-black/5">
                        Do the “Wheel of Life” exercise
                    </span>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                        Rate yourself from <strong>1-10</strong> in each category to visualize where you are imbalanced.
                        The areas you score lowest should be your focus as you head into <strong>2026</strong>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Controls Section */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Rate Categories</h3>
                            <button onClick={resetScores} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" title="Reset">
                                <RefreshCw size={18} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {CATEGORIES.map((cat) => (
                                <div key={cat.id} className="group">
                                    <div className="flex justify-between mb-2 items-center">
                                        <label className="font-semibold text-gray-700">{cat.label}</label>
                                        <span className={clsx(
                                            "font-mono font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm",
                                            scores[cat.id] >= 8 ? "bg-green-100 text-green-700" :
                                                scores[cat.id] <= 4 ? "bg-red-100 text-red-700" :
                                                    "bg-gray-100 text-gray-700"
                                        )}>
                                            {scores[cat.id]}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={scores[cat.id]}
                                        onChange={(e) => handleScoreChange(cat.id, e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black hover:accent-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visualization Section */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative aspect-square flex items-center justify-center">
                            <PolarArea data={chartData} options={chartOptions} />

                            <button
                                onClick={downloadChart}
                                className="absolute bottom-6 right-6 p-3 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all hover:scale-105"
                                title="Download Chart"
                            >
                                <Download size={20} />
                            </button>
                        </div>

                        {/* Focus Areas Card */}
                        {focusAreas.length > 0 && (
                            <div className="bg-[#FFE135]/20 border border-[#FFE135] p-8 rounded-3xl">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ArrowRight size={24} className="text-black" />
                                    Your Analysis
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Based on your ratings, here are your recommended focus areas for 2026:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {focusAreas.map(c => (
                                        <span key={c.id} className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full font-bold text-sm shadow-sm">
                                            {c.label} ({scores[c.id]})
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;
