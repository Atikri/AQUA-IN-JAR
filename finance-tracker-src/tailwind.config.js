/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                income: '#4ade80', // Soft Green
                expense: '#f87171', // Soft Red
            }
        },
    },
    plugins: [],
}
