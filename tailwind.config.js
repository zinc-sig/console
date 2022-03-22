const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  theme: {
    extend: {
      height:{
        "uploader":"40rem"
      },
      boxShadow:{
        "inner-lg" : "inset 0 5px 8px 0 rgba(0, 0, 0, 0.2)"
      },
      colors: {
        cse: {
          '100': '#8FADE0',
          '200': '#6F95D8',
          '300': '#4F7ECF',
          '400': '#3560C0',
          '500': '#2C56A0',
          '600': '#234580',
          '700': '#1B3663',
          '800': '#162B50',
          '900': '#122340'
        },
        section: {
          '0': '#0466C8',
          '1': '#0353A4',
          '2': '#023E7D',
          '3': '#002855',
          '4': '#001845',
          '5': '#001233',
          '6': '#33415C',
          '7': '#5C677D',
          '8': '#7D8597',
          '9': '#979DAC',
        }
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code',...defaultTheme.fontFamily.mono]
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
    require('@tailwindcss/typography')
  ],
}
