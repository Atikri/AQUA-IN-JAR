import React, { useState, useEffect, useMemo } from 'react';
import { format, addMonths, subMonths, isSameMonth, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Trash2, ChevronLeft, ChevronRight, Plus, ArrowUpRight, ArrowDownRight, Wallet, Download, X } from 'lucide-react';

const STORAGE_KEY = 'simple_ledger_data';

const Ledger = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    // Export State
    const [showExport, setShowExport] = useState(false);
    const [exportStart, setExportStart] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [exportEnd, setExportEnd] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => isSameMonth(parseISO(t.date), currentMonth))
            .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
    }, [transactions, currentMonth]);

    const summary = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            if (t.type === 'income') acc.income += t.amount;
            else acc.expense += t.amount;
            return acc;
        }, { income: 0, expense: 0 });
    }, [filteredTransactions]);

    const netBalance = summary.income - summary.expense;

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount || !desc) return;

        const newTx = {
            id: Date.now().toString(),
            type,
            amount: parseFloat(amount),
            desc,
            date
        };

        setTransactions([newTx, ...transactions]);
        setAmount('');
        setDesc('');
    };

    const handleDelete = (id) => {
        if (confirm('Delete this record?')) {
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    const handleExport = () => {
        const start = parseISO(exportStart);
        const end = parseISO(exportEnd);

        // Ensure end includes the full day (comparison often depends on time)
        // Since we parse YYYY-MM-DD, it parses to 00:00 local.
        // We want end date to be inclusive.
        // Simple string comparison works for ISO dates if YYYY-MM-DD format is consistent.

        const dataToExport = transactions.filter(t => {
            return t.date >= exportStart && t.date <= exportEnd;
        });

        const headers = ['Date', 'Type', 'Description', 'Amount', 'ID'];
        const csvRows = [
            headers.join(','),
            ...dataToExport.map(t => {
                const safeDesc = t.desc.replace(/"/g, '""'); // Escape quotes
                return [
                    t.date,
                    t.type,
                    `"${safeDesc}"`,
                    t.amount,
                    t.id
                ].join(',');
            })
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `money_toolbox_export_${exportStart}_to_${exportEnd}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExport(false);
    };

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 relative">

            {/* Top Navbar / Month Selector */}
            <div className="sticky top-0 z-10 bg-[#F5F5F7]/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Wallet size={20} />
                        <span className="font-semibold tracking-tight text-gray-900 hidden sm:inline">Ledger</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors text-gray-500"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-semibold text-gray-900 min-w-[100px] sm:min-w-[120px] text-center select-none">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors text-gray-500"><ChevronRight size={16} /></button>
                        </div>

                        <button
                            onClick={() => setShowExport(true)}
                            className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            title="Export Data"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
                    <div className="bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-24 md:h-28">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Income</span>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#34C759] tracking-tight truncate">
                            {formatMoney(summary.income)}
                        </div>
                    </div>
                    <div className="bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-24 md:h-28">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expense</span>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF3B30] tracking-tight truncate">
                            {formatMoney(summary.expense)}
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-24 md:h-28">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Balance</span>
                        <div className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate ${netBalance < 0 ? 'text-[#FF3B30]' : 'text-gray-900'}`}>
                            {formatMoney(netBalance)}
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 flex flex-col md:flex-row gap-2">
                    <div className="flex bg-[#F5F5F7] rounded-xl p-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-white text-[#FF3B30] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Exp
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-white text-[#34C759] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Inc
                        </button>
                    </div>

                    <input
                        type="date"
                        required
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full md:w-auto bg-transparent px-3 py-2 text-sm font-medium text-gray-600 outline-none focus:bg-gray-50 rounded-lg transition-colors"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        required
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        className="flex-1 bg-transparent px-4 py-2 text-gray-900 placeholder:text-gray-300 font-medium outline-none focus:bg-gray-50 rounded-lg transition-colors"
                        autoFocus
                    />

                    <input
                        type="number"
                        placeholder="0.00"
                        required
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-24 md:w-32 bg-transparent px-4 py-2 text-right font-mono font-bold text-gray-900 placeholder:text-gray-300 outline-none focus:bg-gray-50 rounded-lg transition-colors"
                    />

                    <button type="submit" className="bg-[#007AFF] hover:bg-[#0066CC] text-white rounded-xl w-12 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <Plus size={20} strokeWidth={3} />
                    </button>
                </form>

                {/* Transaction List */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Recent Transactions</h3>

                    {filteredTransactions.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-100 text-gray-300 mb-3">
                                <Wallet size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-gray-400 font-medium">No transactions in this month.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                            {filteredTransactions.map(t => (
                                <div key={t.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'}`}>
                                            {t.type === 'income' ? <ArrowUpRight size={18} strokeWidth={2.5} /> : <ArrowDownRight size={18} strokeWidth={2.5} />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 leading-tight">{t.desc}</span>
                                            <span className="text-xs text-gray-400 font-medium">{format(parseISO(t.date), 'MMM d')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono font-bold tracking-tight ${t.type === 'income' ? 'text-[#34C759]' : 'text-[#1D1D1F]'}`}>
                                            {t.type === 'income' ? '+' : ''}{formatMoney(t.amount)}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="md:opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Export Modal */}
            {showExport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Export Options</h3>
                            <button onClick={() => setShowExport(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-500">Select a date range to export your transactions as a CSV file.</p>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                                <input
                                    type="date"
                                    value={exportStart}
                                    onChange={(e) => setExportStart(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                                <input
                                    type="date"
                                    value={exportEnd}
                                    onChange={(e) => setExportEnd(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleExport}
                                className="w-full bg-[#007AFF] hover:bg-[#0066CC] text-white font-bold py-3 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Download CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Ledger;
