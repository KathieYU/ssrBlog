const path = require('path')
const { getColors } = require('theme-colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: 'all',
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'content/**/*.md',
      path.join(__dirname, 'components/**/*.vue'),
      path.join(__dirname, 'layouts/**/*.vue'),
      path.join(__dirname, 'pages/**/*.vue'),
      path.join(__dirname, 'plugins/**/*.js'),
    ],
    options: {
      whitelist: ['dark-mode'],
    },
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
        mono: ['DM Mono', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        primary: getColors('#E24F55'),
        orange: colors.orange,
        bgdark: '#1a1c20',
        desgray: getColors('#738a94'),
      },
      maxHeight: {
        '(screen-16)': 'calc(100vh - 4rem)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
            },
            h2: {
              paddingBottom: theme('padding.2'),
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.200'),
            },
            h3: {
              paddingBottom: theme('padding.2'),
              borderBottomWidth: '1px',
              borderBottomColor: theme('colors.gray.200'),
            },
            blockquote: {
              fontWeight: '400',
              color: theme('colors.gray.600'),
              fontStyle: 'normal',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
            code: {
              fontWeight: '400',
              backgroundColor: theme('colors.gray.100'),
              padding: theme('padding.1'),
              borderWidth: 1,
              borderColor: theme('colors.gray.200'),
              borderRadius: theme('borderRadius.default'),
            },
            'code::before': {
              content: '',
            },
            'code::after': {
              content: '',
            },
            'h3 code': {
              fontWeight: '600',
            },
            'pre code': {
              fontFamily: 'DM Mono',
            },
            'a code': {
              color: theme('colors.primary.500'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            '[class~="lead"]': {
              color: theme('colors.gray.300'),
            },
            a: {
              color: theme('colors.primary.500'),
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            'ol > li::before': {
              color: theme('colors.gray.400'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.600'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            blockquote: {
              color: theme('colors.gray.400'),
              borderLeftColor: theme('colors.gray.700'),
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.800'),
            },
            h3: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.800'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            'figure figcaption': {
              color: theme('colors.gray.400'),
            },
            code: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.gray.800'),
              borderWidth: 0,
            },
            'a code': {
              color: theme('colors.primary.500'),
            },
            thead: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.600'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
    darkSelector: '.dark-mode',
  },
  variants: {
    margin: ['responsive', 'last'],
    padding: ['responsive', 'hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'dark', 'dark-focus'],
    textColor: [
      'responsive',
      'hover',
      'focus',
      'dark',
      'dark-hover',
      'dark-focus',
    ],
    borderColor: ['responsive', 'hover', 'focus', 'dark', 'dark-focus'],
    borderWidth: ['responsive', 'first', 'last'],
    typography: ['responsive', 'dark'],
  },
  plugins: [
    require('tailwindcss-dark-mode')(),
    require('@tailwindcss/typography'),
  ],
}
