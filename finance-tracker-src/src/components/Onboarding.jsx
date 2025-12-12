import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MODES } from '../lib/modes';
import { Wallet, LayoutDashboard, Gift } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const cards = [
        {
            id: MODES.FLOW,
            icon: <Wallet className="w-12 h-12 text-green-500" />,
            title: "The Zen Type",
            desc: "I just want to know if I've overspent. Keep it simple.",
            color: "bg-green-50 hover:bg-green-100 border-green-200"
        },
        {
            id: MODES.DASH,
            icon: <LayoutDashboard className="w-12 h-12 text-indigo-500" />,
            title: "The Watchful Type",
            desc: "I want to see charts, breakdowns, and track every penny.",
            color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
        },
        {
            id: MODES.WISH,
            icon: <Gift className="w-12 h-12 text-pink-500" />,
            title: "The Hunter Type",
            desc: "I'm saving up for something big! Turn my savings into rewards.",
            color: "bg-pink-50 hover:bg-pink-100 border-pink-200"
        }
    ];

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full text-center"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Money Toolbox</h1>
                <p className="text-xl text-gray-500 mb-12">How do you prefer to manage your finances?</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {cards.map((card, idx) => (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => onComplete(card.id)}
                            className={`p-8 rounded-3xl border-2 text-left transition-all ${card.color} flex flex-col items-start gap-4 hover:scale-105`}
                        >
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
