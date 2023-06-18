import Color from 'color'
import React from 'react'
import { useColor } from './useColor'
import { Input } from './inputs'
import { useFormContext } from 'react-hook-form'

const Hue = ({ color, ...props }) => (
  <>
    <div className="slider-track" style={{
      background: `linear-gradient(to right, ${Array(360).fill(0).map((_, i) => color.hue(i)).join(', ')})`,
    }}>
      <Input name="hue" type="range" min={0} max={359} {...props} />
    </div>
    <Input name="hueNum" type="number" min={0} max={359} {...props} />
  </>
)

const SaturationL = ({ color, ...props }) => (
  <>
    <div className="slider-track" style={{
      background: `linear-gradient(to right, ${color.saturationl(0)}, ${color.saturationl(100)})`,
    }}>
      <Input name="saturationl" type="range" min={0} max={100} {...props}/ >
    </div>
    <Input name="saturationlNum" type="number" min={0} max={100} {...props}/ >
  </>
)

const Lightness = ({ color, ...props }) => (
  <>
    <div className="slider-track" style={{
      background: `linear-gradient(to right, ${color.lightness(0)}, ${color.lightness(50)}, ${color.lightness(100)})`,
    }}>
      <Input name="lightness" type="range" min={0} max={100} {...props} />
    </div>
    <Input name="lightnessNum" type="number" min={0} max={100} {...props} />
  </>
)

const Alpha = ({ color, ...props }) => (
  <>
    <div className="slider-track" style={{
      background: `linear-gradient(to right, ${color.alpha(0)}, ${color.alpha(1)})`,
    }}>
      <Input name="alpha" type="range" min={0} step={0.01} max={1} {...props} />
    </div>
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
    try {
      const newColor = color[name.replace('Num', '')](value)
      Object.entries(colorObject(newColor)).forEach(([n, v]) => {
        if (n !== name) setValue(n, v)
      })
      setColor(newColor.toString())
    } catch (e) {
      console.log('cannot create color')
    }
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
      <Hue onChange={onChange} color={color} />
      <SaturationL onChange={onChange} color={color} />
      <Lightness onChange={onChange} color={color} />
      <Alpha onChange={onChange} color={color} />

      <HslText onChange={onChangeText} />
      <RgbText onChange={onChangeText} />
      <HexText onChange={onChangeText} />
    </div>
  )
}
