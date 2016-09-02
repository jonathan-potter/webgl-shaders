export const DEFAULT_MENU_CONFIG = {
  'julia set': {
    menuOrder: ['colorset', 'brightness', 'speed', 'exponent', 'supersamples'],
    controls: {
      brightness: { type: 'range', min: 1, max: 8 },
      colorset: { type: 'select', options: ['linear', 'squared periodic'] },
      exponent: { type: 'range', min: 0, max: 10 },
      speed: { type: 'range', min: 0, max: 320 },
      supersamples: { type: 'select', options: { 1: '1x', 4: '4x', 16: '16x' } }
    }
  },
  'mandelbrot set': {
    menuOrder: ['colorset', 'brightness', 'exponent', 'supersamples'],
    controls: {
      brightness: { type: 'range', min: 1, max: 8 },
      colorset: { type: 'select', options: ['linear', 'squared periodic'] },
      exponent: { type: 'range', min: 0, max: 10 },
      supersamples: { type: 'select', options: { 1: '1x', 4: '4x', 16: '16x' } }
    }
  }
}

export const DEFAULT_STORE = {
  'julia set': {
    config: {
      brightness: 4,
      colorset: 0,
      exponent: 2,
      speed: 16,
      supersamples: 1
    },
    viewport: {
      center: { x: 0, y: 0 },
      range: { x: 4, y: 4 }
    }
  },
  'mandelbrot set': {
    config: {
      brightness: 4,
      colorset: 0,
      exponent: 2,
      supersamples: 1
    },
    viewport: {
      center: { x: 0, y: 0 },
      range: { x: 4, y: 4 }
    }
  }
}

export const FRACTAL_ENUM = {
  'julia set': 0,
  'mandelbrot set': 1
}
