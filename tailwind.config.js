const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,tsx}'],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: (theme) => ({
        'highlight/4': 'inset 0 1px 0 0 rgb(255 255 255 / 0.04)',
        'highlight/20': 'inset 0 1px 0 0 rgb(255 255 255 / 0.2)',
        copied: `0 0 0 1px ${theme('colors.sky.500')}, inset 0 0 0 1px ${theme(
          'colors.sky.500'
        )}`,
      }),
    },
  },
}
