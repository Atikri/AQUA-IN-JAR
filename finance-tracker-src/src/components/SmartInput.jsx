import React, { useState } from 'react';
import { Send, PlusCircle } from 'lucide-react';
import { parseTransactionInput } from '../lib/parser';
import { db } from '../lib/db';
import { cn } from '../lib/utils';

const SmartInput = ({ onTransactionAdded }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(null);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await processInput();
        }
    };

    const processInput = async () => {
        setError(null);
        const parsed = parseTransactionInput(inputValue);

        if (!parsed) {
            setError('Could not understand. Try: "Lunch 15 Food"');
            return;
        }

        try {
            await db.transactions.add(parsed);
            setInputValue('');
            if (onTransactionAdded) onTransactionAdded();
        } catch (err) {
            console.error(err);
            setError('Failed to save transaction.');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 relative">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type naturally: 'Coffee 5' or 'Taxi 25 Transport'..."
                    className={cn(
                        "w-full h-14 pl-6 pr-12 rounded-full border-2 border-gray-100 bg-white shadow-sm text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400",
                        error && "border-red-300 focus:border-red-400 focus:ring-red-50"
                    )}
                />
                <button
                    onClick={processInput}
                    className="absolute right-2 top-2 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-md"
                >
                    {inputValue.length > 0 ? <Send size={18} /> : <PlusCircle size={20} />}
                </button>
            </div>
            {error && (
                <p className="absolute -bottom-6 left-6 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SmartInput;
