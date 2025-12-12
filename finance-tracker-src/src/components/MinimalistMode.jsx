import React, { useMemo, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, formatCurrency } from '../lib/db';
import { motion } from 'framer-motion';
import { getBudgetData, saveBudgetData } from '../lib/modes';
import { Edit2, Check, X } from 'lucide-react';

const MinimalistMode = () => {
    const transactions = useLiveQuery(() => db.transactions.toArray(), []);
    const [budget, setBudget] = useState(2000);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const data = getBudgetData();
        if (data.budget) setBudget(data.budget);
    }, []);

    const handleSaveBudget = () => {
        const val = parseFloat(editValue);
        if (!isNaN(val) && val > 0) {
            setBudget(val);
            const data = getBudgetData();
            data.budget = val;
            saveBudgetData(data);
            setIsEditing(false);
        }
    };

    const startEditing = () => {
        setEditValue(budget.toString());
        setIsEditing(true);
    }

    const summary = useMemo(() => {
        if (!transactions) return { spent: 0 };
        const spent = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { spent };
    }, [transactions]);

    const remaining = budget - summary.spent;
    const cleanState = remaining >= 0;

    return (
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-1000 ${cleanState ? 'bg-[#F2F7F5]' : 'bg-[#FFF2F2]'}`}>
            <div className="text-center relative z-10 w-full max-w-4xl px-4">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <p className="text-sm uppercase tracking-widest text-gray-400 font-medium">Remaining Monthly Budget</p>
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                type="number"
                                className="w-32 p-1 text-sm border-b-2 border-gray-400 outline-none bg-transparent"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveBudget()}
                            />
                            <button onClick={handleSaveBudget} className="text-green-600"><Check size={18} /></button>
                            <button onClick={() => setIsEditing(false)} className="text-red-500"><X size={18} /></button>
                        </div>
                    ) : (
                        <button onClick={startEditing} className="opacity-50 hover:opacity-100 transition-opacity">
                            <Edit2 size={16} className="text-gray-400" />
                        </button>
                    )}
                </div>

                <motion.div
                    key={remaining}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`font-black tabular-nums leading-none tracking-tighter ${cleanState ? 'text-[#2D6A4F]' : 'text-[#D00000]'}`}
                    style={{ fontSize: 'clamp(5rem, 15vw, 12rem)' }} // Responsive big text
                >
                    {remaining.toLocaleString()}
                </motion.div>

                <p className="mt-8 text-xl text-gray-500 font-light">
                    {cleanState ? "You are doing great." : "Please slow down."}
                </p>
            </div>

            {/* Background texture for depth */}
            <div className={`absolute inset-0 opacity-10 pointer-events-none ${cleanState ? 'bg-[radial-gradient(#2D6A4F_1px,transparent_1px)]' : 'bg-[radial-gradient(#D00000_1px,transparent_1px)]'} [background-size:24px_24px]`}></div>
        </div>
    );
};

export default MinimalistMode;
