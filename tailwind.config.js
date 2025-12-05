/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#dc2626',
        'primary-red-hover': '#b91c1c',
        'light-red': '#fee2e2',
        'dark-grey': '#374151',
        'light-grey': '#f9fafb',
        'border-grey': '#e5e7eb',
        'text-dark': '#111827',
        'text-grey': '#6b7280',
      },
    },
  },
  plugins: [],
}

