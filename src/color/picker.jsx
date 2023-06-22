import React from 'react'
import { useColor } from './useColor'
import { Input, CodeInput } from './inputs'
import { useFormContext } from 'react-hook-form'
import { validate } from './helpers'

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

const ColorSlider = ({ name, model, ...props }) => (
  <div className="color-slider">
    <div className="slider-track" >
      <Input type="range" name={name} min={0} max={100} step={1} {...props} style={{ background: background[model][name] }} />
    </div>
    <Input type="number" name={`${name}Num`} min={0} max={100} step={1} {...props} />
  </div>
)

const Hsl = (props) => (
  <>
    <ColorSlider name="hue" max={360} {...props} />
    <ColorSlider name="saturationl" {...props} />
    <ColorSlider name="lightness" {...props} />
  </>
)

const Hwb = (props) => (
  <>
    <ColorSlider name="hue" max={360} {...props} />
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
  const { model, color, adjustColor, models, setModel, setColor } = useColor()
  const { setValue } = useFormContext()
  const init = React.useRef(true)
  const swatch = React.useRef(true)

  const updateText = React.useCallback(({ newColor, fromInput }) => {
    const inputs = {
      hsl: newColor.hsl,
      hwb: newColor.hwb,
      rgb: newColor.rgb,
      hex: newColor.hex,
    }
    Object.entries(inputs).filter(([k])=> k !== fromInput).forEach(([k, v]) => {
      setValue(k, v)
    })
  }, [setValue])

  // When a color is set, update each slider and number input
  const updateSliders = React.useCallback(({ newColor }) => {
    if (model) {
      models[model].forEach((prop) => {
        setValue(prop, newColor[prop])
        setValue(`${prop}Num`, newColor[prop])
      })
    }
  }, [setValue, model, models])

  // When a slider (or matching number input) changes:
  // - Update the matching input (number or slider)
  // - Set the color prop
  // - Update the text inputs with the new color
  const setSliderInput = React.useCallback(([name, value]) => {
    const colorProp = name.replace('Num', '')
    const matchingVal = name.includes('Num') ? colorProp : `${name}Num`
    setValue(matchingVal, value)
    updateText({ newColor: adjustColor(colorProp, value) })
  }, [updateText, adjustColor, setValue])

  const onChangeText = React.useCallback(([name, value]) => {
    try {
      const newColor = setColor(value)
      updateText({ newColor, fromInput: name })
      updateSliders({ newColor })
    } catch (e) {
      console.log(e)
      console.log('cannot create color')
    }
  }, [setColor, updateText, updateSliders])

  // On initial load, or when model changes, update inputs to match new color model
  React.useEffect(() => {
    if ((init.current && color) || (!init.current && color?.model !== model)) {
      updateSliders({ newColor: color })
      updateText({ newColor: color })
      init.current = false
    }
  }, [model, color, init, updateText, updateSliders])

  const Sliders = {
    rgb: Rgb,
    hsl: Hsl,
    hwb: Hwb,
  }[model]

  if (model) return (
    <div className="color-picker-wrapper">
      <div className="color-picker">
        <div className="color-swatch" ref={swatch} />
        <div className="color-sliders">
          <Sliders onChange={setSliderInput} model={model} />
          <ColorSlider name="alpha" step={0.01} max={1} onChange={setSliderInput} model={model} />
        </div>
      </div>

      <div className="color-inputs">
        <CodeInput name="hex" onChange={onChangeText} />
        <CodeInput name="rgb" onChange={onChangeText} />
        <CodeInput name="hsl" onChange={onChangeText} />
        <CodeInput name="hwb" onChange={onChangeText} />
        <span />
        <button type="button" onClick={()=>setModel('rgb')}>rgb</button>
        <button type="button" onClick={()=>setModel('hsl')}>hsl</button>
        <button type="button" onClick={()=>setModel('hwb')}>hwb</button>
      </div>
    </div>
  )
  return null
}
