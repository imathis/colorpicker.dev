import Color from 'color'
import React from 'react'
import { useColor } from './useColor'
import { Input } from './inputs'
import { useFormContext } from 'react-hook-form'

const Hue = (props) => (
  <>
    <Input name="hue" type="range" min={0} max={359} {...props} />
    <Input name="hueNum" type="number" min={0} max={359} {...props} />
  </>
)

const SaturationL = (props) => (
  <>
    <Input name="saturationl" type="range" min={0} max={100} {...props}/ >
    <Input name="saturationlNum" type="number" min={0} max={100} {...props}/ >
  </>
)

const Lightness = (props) => (
  <>
    <Input name="lightness" type="range" min={0} max={100} {...props} />
    <Input name="lightnessNum" type="number" min={0} max={100} {...props} />
  </>
)

const Alpha = (props) => (
  <>
    <Input name="alpha" type="range" min={0} step={0.01} max={1} {...props} />
    <Input name="alphaNum" type="number" min={0} step={0.01} max={1} {...props} />
  </>
)

const HslText = (props) => (
  <Input name="hsl" type="text" {...props}/>
)
const RgbText = (props) => (
  <Input name="rgb" type="text" {...props}/>
)
const HexText = (props) => (
  <Input name="hex" type="text" {...props}/>
)

export const Picker = () => {
  const { color, setColor, colorObject } = useColor()
  const { setValue } = useFormContext()

  const onChange = ([name, value]) => {
    const newColor = color[name](value)
    Object.entries(colorObject(newColor)).forEach(([n, v]) => {
      if (n !== name) setValue(n, v)
    })

    setColor(newColor.toString())
  }

  const onChangeText = ([name, value]) => {
    try {
      const newColor = Color(value)
      setColor(newColor)
      Object.entries(colorObject(newColor)).forEach(([n, v]) => {
        if (n !== name) setValue(n, v)
      })
    } catch (e) {
      console.log('cannot create color')
    }
  }

  return (
    <div>
      <Hue onChange={onChange} />
      <SaturationL onChange={onChange} />
      <Lightness onChange={onChange} />
      <Alpha onChange={onChange} />

      <HslText onChange={onChangeText} />
      <RgbText onChange={onChangeText} />
      <HexText onChange={onChangeText} />
    </div>
  )
}
