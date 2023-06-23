import React from 'react'
import { ColorContext } from './Context'
import { Color, randomColor, setRoot, colorModels } from './helpers'

const updateModelVars = ({ color }) => {
  Object.keys(color.modelObject()).forEach((part) => {
    setRoot(part, color[part])
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
    if (colorModels[m]) { 
      setRoot('model', m)
      setModelValue(m) 
      const newColor = c.adjust('model', m)
      setColorValue(newColor)
      if (color && color.model !== m) updateModelVars({ color: newColor })
    }
  }, [color, setColorValue])

  const setColor = React.useCallback((c) => {
    let newColor = (typeof c === 'string') ? Color(c) : c
    
    // Initially there won't be a model, so set it
    if (!model && colorModels[newColor.model]) {
      setModel(newColor.model, newColor)
    }

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

  const adjustColor = React.useCallback((...args) => {
    return setColor(color.adjust(...args))
  }, [setColor, color])

  return {
    model,
    colorModels,
    setModel,
    color,
    setColor,
    adjustColor,
  }
}

export const useColor = () => React.useContext(ColorContext)
