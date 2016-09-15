import { getCurrentFractal } from 'reducers'
import configureProgram from 'webgl-utilities/configureProgram'
import drawFrame from 'webgl/drawFrame'

/* shaders */
import vertexShaderSource from 'shaders/vertexShader.glsl'
import juliaShaderSource from 'shaders/julia.glsl'
import collatzShaderSource from 'shaders/collatz.glsl'

const { requestAnimationFrame } = window

const SHADER_SOURCES = {
  'julia set': juliaShaderSource,
  'mandelbrot set': juliaShaderSource,
  'modified collatz': collatzShaderSource
}

export default ({ store }) => {
  const canvas = document.getElementById('main')

  const startRunLoop = createRunLoop({
    canvas,
    context: canvas.getContext('webgl'),
    fractal: getCurrentFractal(store.getState()),
    store
  })

  store.subscribe(startRunLoop)

  startRunLoop()
}

const createRunLoop = ({ canvas, context, fractal, store, firstRun = true }) => () => {
  const state = store.getState()
  const currentFractal = getCurrentFractal(state)

  if (fractal !== currentFractal || firstRun) {
    fractal = currentFractal
    firstRun = false

    const program = programForFractal({ context, fractal: currentFractal })

    context.useProgram(program)
    requestAnimationFrame(drawFrame.bind(null, {
      canvas,
      context,
      fractal,
      program,
      store
    }))
  }
}

const programs = {}
const programForFractal = ({ context, fractal }) => (
  programs[fractal] = programs[fractal] || configureProgram({
    context,
    fragmentShaderSource: SHADER_SOURCES[fractal],
    vertexShaderSource: vertexShaderSource
  })
)
