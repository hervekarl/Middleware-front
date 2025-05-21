
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // chemins à scanner pour les classes Tailwind
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
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",                // préfixe des classes DaisyUI (vide = par défaut)
  },
}
