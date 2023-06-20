import Color from 'color'
import React from 'react'
import { ColorContext } from './Context'

window.Color = Color

const getRandom = (min, max, unit) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return unit ? `${num}${unit}` : num
}

const models = {
  hsl: ['hue', 'saturationl', 'lightness', 'alpha'],
  hwb: ['hue', 'white', 'wblack', 'alpha'],
  rgb: ['red', 'green', 'blue', 'alpha'],
}

const setRootColor = (color) => {
  document.documentElement.style.setProperty('--color', color.alpha(1).toString().replaceAll(',','').replace(')', ` / ${color.alpha()})`))
}

export const useColorHooks = () => {
  const [model, setModel] = React.useState('hsl')
  const [color, setColorValue] = React.useState()

  const setColor = React.useCallback((val) => {
    setColorValue(val)
    setRootColor(val)
  }, [])

  const getCurrentColor = React.useCallback(() => {
    try {
      const p = models[model].map((part) => (
        Number.parseFloat(document.documentElement.style.getPropertyValue(`--${part}`), 10)
      ))
      return Color[model](...p)
    } catch (e) {
      return null
    }
  }, [model])

  const adjustColor = React.useCallback((prop, value) => {
    document.documentElement.style.setProperty(`--${prop}`, value)
    const newColor = getCurrentColor()
    setColor(newColor)
    return newColor
  }, [setColor, getCurrentColor])

  const colorObject = React.useCallback((c) => ({
    hue: c.hue(),
    saturationl: c.saturationl(),
    lightness: c.lightness(),
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
    if (!color) {
      const initialColor = Color(Color(`hsla(${getRandom(0,359)}, 100%, 50%, 1)`).hexa())
      setColor(initialColor)
    } else if (color.model !== model) {
      models[model].forEach((part) => {
        document.documentElement.style.setProperty(`--${part}`, color[part]())
      })
    }
  }, [color, model])

  return {
    model,
    models,
    color,
    setColor,
    colorObject,
    adjustColor,
  }
}

export const useColor = () => React.useContext(ColorContext)
