
// Store user preference for mode
export const USER_PREFS_KEY = 'money_toolbox_mode';

// Modes enum
export const MODES = {
    FLOW: 'flow',   // Minimalist, cash flow only
    DASH: 'dash',   // Dashboard with charts
    WISH: 'wish'    // Gamified
};

export const getStoredMode = () => {
    return localStorage.getItem(USER_PREFS_KEY);
};

export const setStoredMode = (mode) => {
    localStorage.setItem(USER_PREFS_KEY, mode);
};

// --- New: Data Management ---
export const getBudgetData = () => {
    const data = localStorage.getItem('money_toolbox_settings');
    return data ? JSON.parse(data) : { budget: 2000, wishes: [], subscriptions: [] };
};

export const saveBudgetData = (data) => {
    localStorage.setItem('money_toolbox_settings', JSON.stringify(data));
};
