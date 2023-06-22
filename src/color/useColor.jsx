import React from 'react'
import { ColorContext } from './Context'
import { randomColor, Color, getRoot, setRoot, colorModels as models, colorModel } from './helpers'

const updateModelVars = ({ color }) => {
  Object.keys(color.modelObject()).forEach((part) => {
    setRoot(part, color[part])
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
  setRoot('color', color.rgb)
}

export const useColorHooks = (options = {}) => {
  const { color: initialColor = null } = options
  const [model, setModelValue] = React.useState()
  const [color, setColorValue] = React.useState()

  const setModel = React.useCallback((m, c = color) => {
    if (models[m]) { 
      setRoot('model', m)
      setModelValue(m) 
      updateModelVars({ color: c })
    }
  }, [color])

  const setColor = React.useCallback((newColor) => {
    /* let newColor = (typeof c === 'string') ? Color(c) : c */
    
    // Initially there won't be a model, so set it
    if (!model && models[newColor.model]) {
      setModel(newColor.model, newColor)
    }
    /* else if (model && newColor.model !== model) { */
    /*   newColor = newColor[model]() */
    /* } */

    updateModelVars({ color: newColor })
    setColorValue(newColor)
    setRootColor(newColor)
    return newColor
  }, [model, setModel])

  React.useEffect(() => {
    if (!color) {
      setColor(initialColor || randomColor())
    }
  }, [color, setColor, initialColor])

  const adjustColor = React.useCallback((prop, value) => {
    setRoot(prop, value)
    return setColor(color.set(prop, value))
  }, [setColor, color])

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
