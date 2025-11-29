import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Deep Dark Palette
                void: '#050505',      // Absolute Black
                nebula: '#0f172a',    // Deep Blue Grey
                stardust: '#fbbf24',  // Warm Gold
                cosmic: '#22d3ee',    // Cyan Glow

                // Glass Colors
                'glass-dark': 'rgba(10, 10, 10, 0.7)',
                'glass-light': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "deep-space": "linear-gradient(to bottom, #050505, #0f172a)",
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.6), 0 0 10px rgba(34, 211, 238, 0.4)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
