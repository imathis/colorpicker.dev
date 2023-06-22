export const colorModels = {
  hsl: ['hue', 'saturationl', 'lightness', 'alpha'],
  hwb: ['hue', 'white', 'wblack', 'alpha'],
  rgb: ['red', 'green', 'blue', 'alpha'],
}

const toString = {
  hwb: (parts) => {
    const main = `${parts[0]} ${parts[1]}% ${parts[2]}%`
    return parts[3] < 1 ? `hwb(${main} / ${parts[3]})` : `hwb(${main})`
  },
  hsl: (parts) => {
    const main = `${parts[0]} ${parts[1]}% ${parts[2]}%`
    return parts[3] < 1 ? `hsla(${main} / ${parts[3]})` : `hsl(${main})` 
  },
  rgb: (parts) => {
    const main = parts.slice(0,3).join(' ')
    return parts[3] < 1 ? `rgba(${main} / ${parts[3]})` : `rgb(${main})`
  },
}

const getRandom = (min, max, unit) => {
  const num = Math.floor(Math.random() * (max - min + 1)) + min
  return unit ? `${num}${unit}` : num
}

export const setRoot = (prop, value) => document.documentElement.style.setProperty(`--${prop}`, value)
export const getRoot = (prop) => document.documentElement.style.getPropertyValue(`--${prop}`)

// Matches rgba? hsla? hwb and really any xxxa?(xxx xxx xxx xxx) format. Optional alpha capture
const ColorTest = (type) => {
  const num = '([\\d.]+)' // number characters with decimals
  const percent = '([\\d.]+%)' // number characters with decimals
  const sep = '\\D+'      // non number characters
  const alph = '\\d\\.{0,1}\\d*' // number decimal number
  const main = {
    rgb: [num, num, num],
    hsl: [num, percent, percent],
    hwb: [num, percent, percent],
  }[type]
  return new RegExp(`^${type}a?\\(${main.join(sep)}(?:${sep}(${alph}))?\\)$`)
}

const isColor = {
  hsl: (str) => str.match(ColorTest('hsl'))?.slice(1) || null,
  hwb: (str) => str.match(ColorTest('hwb'))?.slice(1) || null,
  rgb: (str) => str.match(ColorTest('rgb'))?.slice(1) || null,
  hex: (str) => str.match(/^#([A-Fa-f0-9]+)$/) ? str : null,
}

const colorParts = (color, model = color.slice(0, 3)) => {
  const is = isColor[model](color)
  return is?.filter((n) => !!n).map((v) => Number.parseFloat(v)) || null
}

const rgbaToHex = (rgba) => `#${rgba.map(
  (n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')
).join('')}`

const toHslwb = ({ red: r, green: g, blue: b, alpha: a }) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  let h, w, wb, s
  let l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
    w = max;
    wb = 1 - max
  } else {
    w = min;
    wb = 1 - max
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    
    if (max === r) {
      h = (g - b) / diff + (g < b ? 6 : 0)
    } else if (max === g) {
      h = (b - r) / diff + 2
    } else if (max === b) {
      h = (r - g) / diff + 4
    }

    h /= 6;
  }

  h = Math.round(h * 360)
  s = Math.round(s * 1000) / 10
  l = Math.round(l * 1000) / 10
  w = Math.round(w * 1000) / 10
  wb = Math.round(wb * 1000) / 10

  const hsl = toString.hsl([h,s,l,a])
  const hwb = toString.hwb([h,w,wb,a])

  return { hsl, hwb, hue: h, saturationl: s, lightness: l, white: w, wblack: wb }
}

const toRgb = (str) => {
  try {
    const el = document.createElement('div')
    el.style.color = str
    const { color } = window.getComputedStyle(document.body.appendChild(el))
    const rgba = colorParts(color)
    document.body.removeChild(el)

    const [red, green, blue, alpha = 1] = rgba
    const rgb = toString.rgb([red, green, blue, alpha])
    const hex = rgbaToHex(rgba)

    return { red, blue, green, alpha, rgb, hex }
  } catch (e) {
    console.log(e)
    return null
  }
}

const inbound = (num, opts = {}) => {
  const { max = 100, min = 0 } = opts
  return min <= num && num <= max
}

const testHxx = (color, model) => {
  const parts = colorParts(color, model)
  if (!parts) return false
  const [hue, sw, lwb, alpha] = parts
  return inbound(hue, { max: 360 })
      && inbound(sw)
      && inbound(lwb)
      && (typeof alpha === 'undefined' || inbound(alpha, { max: 1 }))
}

const testRgb = (color, model) => {
  const parts = colorParts(color, model)
  if (!parts) return false
  const [r, g, b, alpha] = parts
  return inbound(r, { max: 255 })
    && inbound(g, { max: 255 }) 
    && inbound(b, { max: 255 }) 
    && (typeof alpha === 'undefined' || inbound(alpha, { max: 1 }))
}

// Validates hex colors with lengths: 3,4,6,8. (Those with 4 or 8 length contain alpha channel)
const testHex = (color, model) => (
  isColor[model](color) && [3, 4, 6, 8].includes(color.replace(/#/, '').length)
)

export const validate = {
  hsl: (str) => testHxx(str, 'hsl'),
  hwb: (str) => testHxx(str, 'hwb'),
  rgb: (str) => testRgb(str, 'rgb'), 
  hex: (str) => testHex(str, 'hex'),
}

export const colorModel = (str) => (
  Object.keys(isColor).find((type) => isColor[type](str))
) 

const reduceModel = (colorObj, model = colorObj.model) => {
  return colorModels[model].reduce((acc, part) => {
    return {...acc, [part]: colorObj[part] }
  }, {})
}

// Return a color split into its many named in an object
const modelParts = (color, model) => {
  if (model === 'hex') return { hex: color }
  const parts = colorParts(color, model)
  return parts.reduce((acc, part, index) => {
    return {...acc, [colorModels[model][index]]: part }
  }, {})
} 

export const validColor = (str) => !!colorModel(str)

export const Color = (color, model = colorModel(color)) => {
  if (!model) return null
  const rgb = toRgb(color)
  const hslwb = toHslwb(rgb)
  const colorObj = { 
    model,
    ...hslwb,
    ...rgb,
    // ensure that conversions don't override initial model with rounding errors
    ...modelParts(color, model),
  }

  const set = (attr, value) => {
    const parts = reduceModel(colorObj)
    if (typeof parts[attr] !== 'undefined') {
      parts[attr] = attr === 'alpha' ? Number.parseFloat(value, 10) : Number.parseInt(value, 10)
      const str = toString[model](Object.values(parts))
      const newColor = Color(str, model)
      return newColor
    }
    return null
  }

  return {
    ...colorObj,
    toString: () => colorObj[model],
    modelObject: () => reduceModel(colorObj),
    set,
  }
}

export const expandColor = (color) => {
  try {
    const model = colorModel(color)
    if (!model) return null
    const rgb = toRgb(color)
    const hslwb = toHslwb(rgb)
    return { ...hslwb, ...rgb, ...modelParts(color, model) }
  } catch (e) {
    return null
  }
}

export const getSwatchColor = () => {
  const { backgroundColor } = window.getComputedStyle(document.querySelector('.color-swatch'))
  return expandColor(backgroundColor)
}

export const randomColor = () => {
  return Color(`hsl(${getRandom(0,360)}, 100%, 50%, 1)`)
}
