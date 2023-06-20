import Color from 'color'
import React from 'react'
import { ColorContext } from './Context'
import { getRoot, setRoot } from './helpers'

const models = {
  hsl: ['hue', 'saturationl', 'lightness', 'alpha'],
  hwb: ['hue', 'white', 'wblack', 'alpha'],
  rgb: ['red', 'green', 'blue', 'alpha'],
}

const updateModelVars = ({ color, model = color.model }) => {
  models[model].forEach((part) => {
    setRoot(part, color[part]())
  })
}

const getCurrentColor = () => {
  return models[getRoot('model')].map((part) => {
    const value = getRoot(part)
    return (part === 'alpha') 
      ? Number.parseFloat(value, 10)
      : Number.parseInt(value, 10)
  })
}

const setRootColor = (color) => {
  setRoot('color', color.alpha(1).toString().replaceAll(',','').replace(')', ` / ${color.alpha()})`))
}

export const useColorHooks = (options = {}) => {
  const { color: initialColor = null } = options
  const [model, setModelValue] = React.useState()
  const [color, setColorValue] = React.useState()

  const setModel = React.useCallback((m, c = color) => {
    if (models[m]) { 
      setRoot('model', m)
      setModelValue(m) 
      updateModelVars({ color: c, model: m })
    }
  }, [color])

  const setColor = React.useCallback((c) => {
    let newColor = (typeof c === 'string') ? Color(c) : c
    
    // Initially there won't be a model, so set it
    if (!model && models[newColor.model]) setModel(newColor.model, newColor)
    else if (model && newColor.model !== model) {
      newColor = newColor[model]()
    }

    updateModelVars({ color: newColor })
    setColorValue(newColor)
    setRootColor(newColor)
    return newColor
  }, [model, setModel])

  React.useEffect(() => {
    if (initialColor && !color) setColor(initialColor)
  }, [color, setColor, initialColor])

  const adjustColor = React.useCallback((prop, value) => {
    setRoot(prop, value)
    const newColor = Color[getRoot('model')](...getCurrentColor()) 
    setColor(newColor)
    return newColor
  }, [setColor])

  return {
    model,
    models,
    setModel,
    color,
    setColor,
    adjustColor,
  }
}

export const useColor = () => React.useContext(ColorContext)
