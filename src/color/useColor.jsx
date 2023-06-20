import Color from 'color'
import React from 'react'
import { ColorContext } from './Context'

window.Color = Color

const getRandom = (min, max, unit) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return unit ? `${num}${unit}` : num
}

const parts = {
  hsl: ['hue', 'saturationl', 'lightness'],
  hwb: ['hue', 'white', 'wblack'],
  rgb: ['red', 'green', 'blue'],
}

export const useColorHooks = () => {
  const initialColor = Color(`hsla(${getRandom(0,359)}, 100%, 50%, 1)`)
  const [color, setColorValue] = React.useState(initialColor)
  const [mode, setMode] = React.useState('rgb')

  const setColor = (val) => {
    const c =  Color(val)
    setColorValue(c)
  }

  const adjustColor = React.useCallback((prop, value) => {
    document.documentElement.style.setProperty(`--${prop}`, value)
    const p = parts[mode].map((part) => (
      Number.parseInt(document.documentElement.style.getPropertyValue(`--${part}`), 10)
    ))
    const alpha = Number.parseFloat(document.documentElement.style.getPropertyValue(`--alpha`), 10)
    const colorString = `${mode}(${p.join(' ')} / ${alpha})`
    document.documentElement.style.setProperty(`--color`, colorString)
    const newColor = Color(colorString)
    setColor(newColor)
    return newColor
  }, [mode])

  const colorObject = React.useCallback((c) => ({
    hue: c.hue(),
    saturationl: c.saturationl(),
    saturationv: c.saturationv(),
    lightness: c.lightness(),
    value: c.value(),
    white: c.white(),
    wblack: c.wblack(),
    red: c.red(),
    green: c.green(),
    blue: c.blue(),
    alpha: c.alpha(),
    hsl: c.hsl().string(),
    rgb: c.rgb().string(),
    hex: c.alpha() < 1 ? c.hexa() : c.hex(),
    hwb: c.hwb().string()
  }), [])

  React.useEffect(() => {
    document.documentElement.style.setProperty('--color', color.alpha(1).toString().replaceAll(',','').replace(')', ` / ${color.alpha()})`))
    const c = colorObject(color)
    Object.entries(c).forEach(([k, v]) => { 
      document.documentElement.style.setProperty(`--${k}`, v)
    })
  }, [color, colorObject])


  return {
    mode,
    color,
    setColor,
    colorObject,
    adjustColor,
  }
}

export const useColor = () => React.useContext(ColorContext)
