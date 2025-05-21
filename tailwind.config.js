
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // chemins à scanner pour les classes Tailwind
  ],
  safelist: [
    'dark', 
    'light',
    'data-theme-dark',
    'data-theme-light',
    // ajoute toutes les classes dynamiques nécessaires
  ],
  theme: {
    extend: {
      colors: {
        // tu peux ajouter ici des couleurs personnalisées
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // exemple de police personnalisée
      },
    },
  },
  plugins: [require("daisyui")],
  
  daisyui: {
    themes: ["light", "dark"], // tu peux aussi mettre "cupcake", "bumblebee", etc.
    darkTheme: "dark",         // thème utilisé quand `dark` est activé
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",                // préfixe des classes DaisyUI (vide = par défaut)
  },
}
