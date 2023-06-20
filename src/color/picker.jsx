import Color from 'color'
import React from 'react'
import { useColor } from './useColor'
import { Input } from './inputs'
import { useFormContext } from 'react-hook-form'

const trackBg = ({
  type = '',
  steps = 0,
  props = [],
  alpha = 'var(--alpha)',
}) => {
  const grad = []
  const propVal = (prop, i) => typeof prop === 'function' ? prop(i) : prop
  for (let i=0; i < steps; i += 1) {
    const vals = props.map((val) => propVal(val, i)).join(' ')
    grad.push(`${type}(${vals} / ${propVal(alpha, i)})`)
  }
  return `linear-gradient(to right, ${grad.join(', ')})`
}
const hslBg = ({
  hue   = 'var(--hue)',
  sat   = 'calc(var(--saturationl) * 1%)',
  lig   = 'calc(var(--lightness) * 1%)',
  ...props
}) => trackBg({ type: 'hsl', props: [hue, sat, lig], ...props })

const hwbBg = ({
  hue    = 'var(--hue)',
  white  = 'calc(var(--white) * 1%)',
  wblack = 'calc(var(--wblack) * 1%)',
  ...props
}) => trackBg({ type: 'hwb', props: [hue, white, wblack], ...props })

const rgbBg = ({
  red   = 'var(--red)',
  green = 'var(--green)',
  blue  = 'var(--blue)',
  steps = 255,
  ...props
}) => trackBg({ type: 'rgba', props: [red, green, blue], steps, ...props })

const background = {
  hsl: {
    hue: hslBg({ hue: (v) => v, steps: 360 }),
    saturationl: hslBg({ sat: (s) => s ? '100%' : '0%', steps: 2 }),
    lightness: hslBg({ lig: (l) => `${l * 50}%`, steps: 3 }),
    alpha: hslBg({ alpha: (v) => v, steps: 2 }),
  },
  hwb: {
    hue: hwbBg({ hue: (v) => v, steps: 360 }),
    white: hwbBg({ white: (v) => `${v * 100}%`, steps: 2 }),
    wblack: hwbBg({ wblack: (v) => `${v * 100}%`, steps: 2 }),
    alpha: hwbBg({ alpha: (v) => v, steps: 2 }),
  },
  rgb: {
    red: rgbBg({ red: (v) => v }),
    green: rgbBg({ green: (v) => v }),
    blue: rgbBg({ blue: (v) => v }),
    alpha: rgbBg({ alpha: (v) => v, steps: 2 }),
  },
}

const ColorSlider = ({ name, mode, ...props }) => (
  <>
    <div className="slider-track" style={{ background: background[mode][name] }}>
      <Input type="range" name={name} min={0} max={100} step={1} {...props} />
    </div>
    <Input type="number" name={`${name}Num`} min={0} max={100} step={1} {...props} />
  </>
)

const Hsl = (props) => (
  <>
    <ColorSlider name="hue" {...props} />
    <ColorSlider name="saturationl" {...props} />
    <ColorSlider name="lightness" {...props} />
  </>
)

const Hwb = (props) => (
  <>
    <ColorSlider name="hue" {...props} />
    <ColorSlider name="white" {...props} />
    <ColorSlider name="wblack" {...props} />
  </>
)

const Rgb = (props) => (
  <>
    <ColorSlider name="red" max={255} {...props} />
    <ColorSlider name="green" max={255} {...props} />
    <ColorSlider name="blue" max={255} {...props} />
  </>
)

export const Picker = () => {
  const { mode, setColor, colorObject, adjustColor } = useColor()
  const { setValue } = useFormContext()

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

  const onChange = ([name, value]) => {
    const colorProp = name.replace('Num', '')
    const matchingVal = name.includes('Num') ? colorProp : `${name}Num`
    setValue(matchingVal, value)
    const c = adjustColor(colorProp, value)
    setValue('hsl', c.hsl().string())
    setValue('hwb', c.hwb().string())
    setValue('rgb', c.rgb().string())
    setValue('hex', c.alpha() < 1 ? c.hexa() : c.hex())
  }

  const Sliders = {
    rgb: Rgb,
    hsl: Hsl,
    hwb: Hwb,
  }[mode]

  return (
    <div>
      <Sliders onChange={onChange} mode={mode} />
      <ColorSlider name="alpha" step={0.01} max={1} onChange={onChange} mode={mode} />

      <Input name="hsl" type="text" onChange={onChangeText} />
      <Input name="hwb" type="text" onChange={onChangeText} />
      <Input name="rgb" type="text" onChange={onChangeText} />
      <Input name="hex" type="text" onChange={onChangeText} />
    </div>
  )
}
