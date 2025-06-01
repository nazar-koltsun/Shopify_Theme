/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
  ],
  theme: {
    extend: {
      screens: {
        'max-860': { max: '860px' },
        'max-720': { max: '720px' },
        'max-380': { max: '380px' },
      },
    },
  },
  plugins: [],
};
