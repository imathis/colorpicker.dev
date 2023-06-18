import Color from 'color'
import React from 'react'
import { ColorContext } from './Context'

window.Color = Color

const getRandom = (min, max, unit) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return unit ? `${num}${unit}` : num
}

export const useColorHooks = () => {
  const initialColor = Color(`hsla(${getRandom(0,359)}, 100%, 50%, 1)`)
  const [color, setColorValue] = React.useState(initialColor)

  const setColor = (val) => {
    const c =  Color(val)
    setColorValue(c)
  }

  const colorObject = React.useCallback((c) => ({
    hue: c.hue(),
    hueNum: c.hue(),
    saturationl: c.saturationl(),
    saturationlNum: c.saturationl(),
    saturationv: c.saturationv(),
    saturationvNum: c.saturationv(),
    lightness: c.lightness(),
    lightnessNum: c.lightness(),
    alpha: c.alpha(),
    alphaNum: c.alpha(),
    hsl: c.hsl().string(),
    rgb: c.rgb().string(),
    hex: c.alpha() < 1 ? c.hexa() : c.hex(),
  }), [])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--color', color)
  }, [color])


  return {
    color,
    setColor,
    colorObject,
  }
}

export const useColor = () => React.useContext(ColorContext)
