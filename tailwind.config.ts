import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bronze: {
                    50: '#fbf7f3',
                    100: '#f5ebe3',
                    200: '#ebd7c6',
                    300: '#dfbe9f',
                    400: '#d0a076',
                    500: '#c48553', // Handpan Bronze
                    600: '#b86e44',
                    700: '#995639',
                    800: '#7d4633',
                    900: '#653a2c',
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
