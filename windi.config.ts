const path = require('path')
import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class', // 暗模式
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {},
    },
  },
  extract: {
    // A common use case is scanning files from the root directory
    include: [path.resolve(__dirname, 'src/**/*.{vue,html,jsx,tsx}')],
    // if you are excluding files, make sure you always include node_modules and .git
    exclude: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '.git'),
      path.resolve(__dirname, 'dist'),
    ],
  },
  plugins: [createEnterPlugin()],
})

/**
 * Used for animation when the element is displayed
 * @param maxOutput The larger the maxOutput output, the larger the generated css volume
 */
function createEnterPlugin(maxOutput = 7) {
  const createCss = (index: number, d = 'x') => {
    const upd = d.toUpperCase()
    return {
      [`*> .enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(50px)`,
      },
      [`*> .-enter-${d}:nth-child(${index})`]: {
        transform: `translate${upd}(-50px)`,
      },
      [`* > .enter-${d}:nth-child(${index}),* > .-enter-${d}:nth-child(${index})`]: {
        'z-index': `${10 - index}`,
        opacity: '0',
        animation: `enter-${d}-animation 0.4s ease-in-out 0.3s`,
        'animation-fill-mode': 'forwards',
        'animation-delay': `${(index * 1) / 10}s`,
      },
    }
  }
  const handler = ({ addBase }) => {
    const addRawCss = {}
    for (let index = 1; index < maxOutput; index++) {
      Object.assign(addRawCss, {
        ...createCss(index, 'x'),
        ...createCss(index, 'y'),
      })
    }
    addBase({
      ...addRawCss,
      [`@keyframes enter-x-animation`]: {
        to: {
          opacity: '1',
          transform: 'translateX(0)',
        },
      },
      [`@keyframes enter-y-animation`]: {
        to: {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
    })
  }
  return { handler }
}
