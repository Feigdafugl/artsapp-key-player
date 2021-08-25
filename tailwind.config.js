module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#3079B6',
        secondary: '#F0A00C',
        darkGrey: '#333333',
        darkGreen: '#5FBB5A',
      },
      backgroundImage: () => ({
        'artsapp-web': "url('/src/images/artsapp-web-bg.jpg')",
      }),
    },
    screens: {
      'es': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1025px',
      'xl': '1280px',
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
