/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
        }
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(59,130,246,0.3), 0 0 0 2px rgba(139,92,246,0.2), 0 0 0 3px rgba(236,72,153,0.1)',
        'glass-cyan': '0 0 0 1px rgba(6,182,212,0.3), 0 0 0 2px rgba(59,130,246,0.2)',
        'glass-red': '0 0 0 1px rgba(239,68,68,0.4), 0 0 0 2px rgba(239,68,68,0.2)',
      },
      animation: {
        'pulse-red': 'criticalPulse 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        criticalPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(59,130,246,0.3), 0 0 0 2px rgba(139,92,246,0.2), 0 0 0 3px rgba(236,72,153,0.1)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239, 68, 68, 0), 0 0 0 1px rgba(59,130,246,0.3), 0 0 0 2px rgba(139,92,246,0.2), 0 0 0 3px rgba(236,72,153,0.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};