import React, { useState, useEffect } from 'react';
import { getBudgetData, saveBudgetData } from '../lib/modes';
import { formatCurrency } from '../lib/db';
import { CreditCard, Plus, X, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const SubscriptionsView = () => {
    const [subs, setSubs] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCost, setNewCost] = useState('');

    useEffect(() => {
        const data = getBudgetData();
        if (data.subscriptions) setSubs(data.subscriptions);
    }, []);

    const saveSubs = (newSubs) => {
        setSubs(newSubs);
        const data = getBudgetData();
        data.subscriptions = newSubs;
        saveBudgetData(data);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (newName && newCost) {
            const cost = parseFloat(newCost);
            if (!isNaN(cost)) {
                saveSubs([...subs, { id: Date.now(), name: newName, cost }]);
                setNewName('');
                setNewCost('');
                setIsAdding(false);
            }
        }
    };

    const handleDelete = (id) => {
        saveSubs(subs.filter(s => s.id !== id));
    };

    const total = subs.reduce((a, b) => a + b.cost, 0);

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8 min-h-[300px] flex flex-col">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10 flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-gray-400 font-medium text-sm uppercase tracking-wider mb-1">Monthly Fixed Burn</h3>
                    <p className="text-3xl font-bold">{formatCurrency(total)}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group cursor-pointer hover:bg-white/20 transition-colors" onClick={() => setIsAdding(true)}>
                    {isAdding ? <X size={24} /> : <Plus size={24} />}
                </div>
            </div>

            <div className="space-y-3 relative z-10 flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                {isAdding && (
                    <form onSubmit={handleAdd} className="bg-white/10 p-3 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2 border border-white/10">
                        <input
                            autoFocus
                            placeholder="Service (e.g. Netflix)"
                            className="w-full bg-transparent border-b border-white/20 text-sm mb-2 pb-1 outline-none placeholder:text-gray-500"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Cost"
                                className="w-20 bg-transparent border-b border-white/20 text-sm pb-1 outline-none placeholder:text-gray-500"
                                value={newCost}
                                onChange={e => setNewCost(e.target.value)}
                            />
                            <button type="submit" className="text-xs bg-indigo-500 px-3 py-1 rounded ml-auto hover:bg-indigo-400 transition-colors">Add</button>
                        </div>
                    </form>
                )}

                {subs.length === 0 && !isAdding && (
                    <p className="text-gray-500 text-sm text-center py-8 italic">No subscriptions tracked yet.</p>
                )}

                {subs.map((s) => (
                    <div key={s.id} className="group flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
                        <span className="text-gray-300 font-medium">{s.name}</span>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-gray-400">{formatCurrency(s.cost)}</span>
                            <button onClick={() => handleDelete(s.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-auto pt-6 text-xs text-gray-500 bg-black/20 p-3 rounded-lg flex items-center gap-2">
                <CreditCard size={12} />
                <span>You lose this amount every month automatically.</span>
            </p>
        </div>
    );
};

export default SubscriptionsView;
