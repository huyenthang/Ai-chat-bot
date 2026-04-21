/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: '#12121a',
        border: '#1e1e2e',
        primary: '#6366f1',
        'primary-hover': '#818cf8',
        'text-primary': '#f0f0f5',
        'text-secondary': '#9ca3af',
        'user-msg': '#1e1b4b',
        'ai-msg': '#18181b',
      },
    },
  },
  plugins: [],
}