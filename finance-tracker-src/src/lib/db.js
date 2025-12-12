import Dexie from 'dexie';

export const db = new Dexie('MoneyToolboxDB');

db.version(1).stores({
    transactions: '++id, date, amount, description, category, type, isRegret'
});

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
