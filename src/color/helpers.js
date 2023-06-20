import Color from 'color'

const getRandom = (min, max, unit) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return unit ? `${num}${unit}` : num
}

export const randomColor = () => Color(`hsl(${getRandom(0,360)}, 100%, 50%, 1)`)
export const setRoot = (prop, value) => document.documentElement.style.setProperty(`--${prop}`, value)
export const getRoot = (prop) => document.documentElement.style.getPropertyValue(`--${prop}`)
