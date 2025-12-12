import React, { useMemo, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, formatCurrency } from '../lib/db';
import { Target, Trophy, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBudgetData, saveBudgetData } from '../lib/modes';

const Wishitem = ({ wish, progress, onDelete }) => {
    const percentage = Math.min((progress / wish.price) * 100, 100);
    const achieved = percentage >= 100;

    return (
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 relative overflow-hidden group hover:border-indigo-300 transition-colors">
            <button
                onClick={() => onDelete(wish.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-20"
            >
                <X size={18} />
            </button>

            <div
                className={`absolute bottom-0 left-0 h-2 bg-gradient-to-r ${achieved ? 'from-yellow-400 to-yellow-600' : 'from-pink-400 to-rose-500'} transition-all duration-1000`}
                style={{ width: `${percentage}%` }}
            />

            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${achieved ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Target size={24} />
                </div>
                {achieved && <Trophy className="text-yellow-500 animate-bounce" />}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1">{wish.name}</h3>
            <p className="text-sm text-gray-400 font-medium">
                {formatCurrency(progress)} / {formatCurrency(wish.price)}
            </p>
        </div>
    );
};

const AddWishForm = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && price) {
            onSave({ name, price: parseFloat(price) });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border-2 border-indigo-500 shadow-xl flex flex-col gap-4">
            <h3 className="font-bold text-lg text-indigo-900">New Quest</h3>
            <input
                autoFocus
                placeholder="Quest Name (e.g. Japan Trip)"
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-gray-800"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Target Price ($)"
                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none font-mono text-gray-800"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
                <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                    <Save size={16} /> Save
                </button>
            </div>
        </form>
    );
}

const GamificationMode = () => {
    const transactions = useLiveQuery(() => db.transactions.toArray(), []);
    const [wishes, setWishes] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const data = getBudgetData();
        if (data.wishes) setWishes(data.wishes);
    }, []);

    const saveWishes = (newWishes) => {
        setWishes(newWishes);
        const data = getBudgetData();
        data.wishes = newWishes;
        saveBudgetData(data);
    };

    const handleAddWish = (wish) => {
        const newWish = { ...wish, id: Date.now() };
        saveWishes([...wishes, newWish]);
        setIsAdding(false);
    };

    const handleDeleteWish = (id) => {
        if (confirm('Abandon this quest?')) {
            saveWishes(wishes.filter(w => w.id !== id));
        }
    };

    // Calculate total XP (Net Savings)
    const xp = useMemo(() => {
        if (!transactions) return 0;
        return transactions.reduce((acc, t) => {
            return t.type === 'expense' ? acc - t.amount : acc + t.amount;
        }, 0);
    }, [transactions]);

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">My Inventory</h1>
                    <p className="text-gray-500">Save money to unlock new gear.</p>
                </div>
                <div className="bg-gray-900 text-white px-6 py-3 rounded-full font-mono text-lg font-bold shadow-lg shadow-indigo-500/20">
                    XP: {formatCurrency(xp)}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pb-32">
                <AnimatePresence>
                    {wishes.map((wish, idx) => (
                        <motion.div
                            key={wish.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Wishitem
                                wish={wish}
                                onDelete={handleDeleteWish}
                                progress={Math.max(xp - (idx * 1000), 0)} // Simplified XP distribution logic for demo
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isAdding ? (
                    <AddWishForm onSave={handleAddWish} onCancel={() => setIsAdding(false)} />
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center justify-center p-8 min-h-[180px] rounded-3xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all font-bold gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <Plus size={24} />
                        </div>
                        <span>Add New Quest</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default GamificationMode;
