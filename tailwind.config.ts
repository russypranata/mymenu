import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        poppins:  ['var(--font-poppins)',  'Poppins',       'sans-serif'],
        nunito:   ['var(--font-nunito)',   'Nunito',        'sans-serif'],
        dm:       ['var(--font-dm-sans)',  'DM Sans',       'sans-serif'],
        space:    ['var(--font-space)',    'Space Grotesk', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        // Landscape orientation media query — used for modal/drawer height adjustments
        landscape: { raw: "(orientation: landscape)" },
      },
    },
  },
  plugins: [
    // scrollbar-hide utility
    plugin(({ addUtilities }) => {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": { display: "none" },
        },
      });
    }),
  ],
};

export default config;
